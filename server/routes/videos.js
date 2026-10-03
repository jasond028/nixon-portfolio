const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const os = require('os');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');
const {
  uploadVideoToDrive,
  deleteVideoFromDrive,
  streamVideoFromDrive,
} = require('../services/googleDrive');

// Allowed video MIME types
const ALLOWED_MIME_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
const ALLOWED_EXTENSIONS = ['.mp4', '.webm', '.mov'];

// Configure Multer storage (save temporary chunk to system temp directory)
const uploadDir = path.join(os.tmpdir(), 'portfolio-video-uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const maxSizeBytes = (parseInt(process.env.MAX_VIDEO_SIZE_MB || '500', 10)) * 1024 * 1024;

const upload = multer({
  storage,
  limits: { fileSize: maxSizeBytes },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ALLOWED_MIME_TYPES.includes(file.mimetype) || ALLOWED_EXTENSIONS.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only MP4, WebM, and MOV videos are allowed.'));
    }
  },
});

// GET /api/videos - Public endpoint returning video metadata list
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, title, description, category, display_order, 
              google_drive_file_id, google_drive_url, file_name, mime_type, created_at, updated_at
       FROM videos
       ORDER BY display_order ASC, created_at DESC`
    );

    // Transform video list to include streaming endpoint URL for seamless browser playback
    const videos = result.rows.map((row) => ({
      ...row,
      stream_url: `/api/videos/stream/${row.google_drive_file_id}`,
    }));

    res.json({ videos });
  } catch (err) {
    console.error('Fetch videos error:', err);
    res.status(500).json({ error: 'Failed to retrieve videos' });
  }
});

// GET /api/videos/stream/:fileId - Streaming proxy for Google Drive videos (supports HTTP 206 Range)
router.get('/stream/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    const requestHeaders = {};

    if (req.headers.range) {
      requestHeaders.Range = req.headers.range;
    }

    const driveResponse = await streamVideoFromDrive(fileId, requestHeaders);

    // Forward relevant headers from Google Drive
    if (driveResponse.headers['content-range']) {
      res.status(206);
      res.setHeader('Content-Range', driveResponse.headers['content-range']);
    } else {
      res.status(200);
    }

    if (driveResponse.headers['content-length']) {
      res.setHeader('Content-Length', driveResponse.headers['content-length']);
    }
    if (driveResponse.headers['content-type']) {
      res.setHeader('Content-Type', driveResponse.headers['content-type']);
    }
    res.setHeader('Accept-Ranges', 'bytes');

    driveResponse.data.pipe(res);
  } catch (err) {
    console.error('Video stream error:', err.message);
    res.status(500).send('Error streaming video from Google Drive');
  }
});

// POST /api/videos - Protected admin upload
router.post('/', requireAuth, (req, res) => {
  upload.single('video')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Video file is required' });
    }

    const { title, description, category, display_order } = req.body;

    if (!title || !title.trim()) {
      // Clean up uploaded temp file
      fs.unlink(req.file.path, () => {});
      return res.status(400).json({ error: 'Title is required' });
    }

    const tempFilePath = req.file.path;
    const fileName = req.file.originalname;
    const mimeType = req.file.mimetype || 'video/mp4';

    try {
      // 1. Upload to Google Drive
      const driveData = await uploadVideoToDrive(tempFilePath, fileName, mimeType);

      // Clean up temp file
      fs.unlink(tempFilePath, () => {});

      // 2. Save metadata to PostgreSQL
      const queryText = `
        INSERT INTO videos (
          title, description, category, display_order,
          google_drive_file_id, google_drive_url, file_name, mime_type
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;
      const values = [
        title.trim(),
        description ? description.trim() : '',
        category ? category.trim() : 'General',
        parseInt(display_order || '0', 10),
        driveData.fileId,
        driveData.webViewLink || driveData.directUrl,
        fileName,
        mimeType,
      ];

      const dbResult = await db.query(queryText, values);

      res.status(201).json({
        message: 'Video uploaded and saved successfully',
        video: {
          ...dbResult.rows[0],
          stream_url: `/api/videos/stream/${driveData.fileId}`,
        },
      });
    } catch (uploadErr) {
      // Clean up temp file on error
      if (fs.existsSync(tempFilePath)) {
        fs.unlink(tempFilePath, () => {});
      }
      console.error('Error uploading video:', uploadErr);
      res.status(500).json({
        error: `Failed to upload video: ${uploadErr.message}`,
      });
    }
  });
});

// PUT /api/videos/:id - Update video metadata
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, display_order } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title cannot be empty' });
    }

    const queryText = `
      UPDATE videos
      SET title = $1,
          description = $2,
          category = $3,
          display_order = $4,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *
    `;

    const values = [
      title.trim(),
      description ? description.trim() : '',
      category ? category.trim() : 'General',
      parseInt(display_order || '0', 10),
      id,
    ];

    const result = await db.query(queryText, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.json({
      message: 'Video metadata updated successfully',
      video: result.rows[0],
    });
  } catch (err) {
    console.error('Update video error:', err);
    res.status(500).json({ error: 'Failed to update video metadata' });
  }
});

// DELETE /api/videos/:id - Delete video from Google Drive and PostgreSQL
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Fetch file ID from database
    const findResult = await db.query('SELECT * FROM videos WHERE id = $1', [id]);
    if (findResult.rows.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }

    const video = findResult.rows[0];
    const googleDriveFileId = video.google_drive_file_id;

    // 2. Delete from Google Drive
    let driveDeleteSuccess = false;
    let driveErrorMsg = null;
    try {
      await deleteVideoFromDrive(googleDriveFileId);
      driveDeleteSuccess = true;
    } catch (driveErr) {
      driveErrorMsg = driveErr.message;
      console.warn(`Failed to delete Google Drive file ${googleDriveFileId}:`, driveErr.message);
    }

    // 3. Delete record from PostgreSQL
    await db.query('DELETE FROM videos WHERE id = $1', [id]);

    if (!driveDeleteSuccess) {
      return res.status(207).json({
        message: 'Video removed from database, but Google Drive file deletion reported an issue.',
        warning: driveErrorMsg,
      });
    }

    res.json({ message: 'Video deleted successfully from Google Drive and database' });
  } catch (err) {
    console.error('Delete video error:', err);
    res.status(500).json({ error: 'Failed to delete video' });
  }
});

module.exports = router;


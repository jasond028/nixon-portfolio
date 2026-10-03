const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

// Simple email regex for validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/contact - Public submission
router.post('/', async (req, res) => {
  try {
    const { name, email, project_type, message } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (!email || !EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({ error: 'A valid email address is required' });
    }
    if (!project_type || !project_type.trim()) {
      return res.status(400).json({ error: 'Project type is required' });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    // Insert into contact_messages
    const result = await db.query(
      `INSERT INTO contact_messages (name, email, project_type, message, status)
       VALUES ($1, $2, $3, $4, 'unread')
       RETURNING id, name, email, project_type, message, status, created_at`,
      [name.trim(), email.trim().toLowerCase(), project_type.trim(), message.trim()]
    );

    res.status(201).json({
      message: 'Thank you! Your inquiry has been sent successfully.',
      data: result.rows[0],
    });
  } catch (err) {
    console.error('Contact submission error:', err);
    res.status(500).json({ error: 'Failed to process inquiry. Please try again later.' });
  }
});

// GET /api/contact - Protected admin message view
router.get('/', requireAuth, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, name, email, project_type, message, status, created_at
       FROM contact_messages
       ORDER BY created_at DESC`
    );
    res.json({ messages: result.rows });
  } catch (err) {
    console.error('Fetch contact messages error:', err);
    res.status(500).json({ error: 'Failed to retrieve contact messages' });
  }
});

// PATCH /api/contact/:id/status - Update message status (e.g. read/unread)
router.patch('/:id/status', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const result = await db.query(
      `UPDATE contact_messages SET status = $1 WHERE id = $2 RETURNING *`,
      [status || 'read', id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json({ message: 'Status updated', data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update message status' });
  }
});

// DELETE /api/contact/:id - Delete inquiry
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM contact_messages WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json({ message: 'Message deleted successfully', id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

module.exports = router;


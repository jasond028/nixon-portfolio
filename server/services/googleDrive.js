const { google } = require('googleapis');
const fs = require('fs');

function getOAuth2Client() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/oauth2callback';
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret) {
    throw new Error('Google OAuth credentials not configured in environment variables');
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  if (refreshToken) {
    oauth2Client.setCredentials({ refresh_token: refreshToken });
  }

  return oauth2Client;
}

function getDrive() {
  const auth = getOAuth2Client();
  return google.drive({ version: 'v3', auth });
}

/**
 * Uploads a video file to Google Drive and sets public read permission
 */
async function uploadVideoToDrive(filePath, fileName, mimeType) {
  const drive = getDrive();
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  const fileMetadata = {
    name: fileName,
    parents: folderId ? [folderId] : undefined,
  };

  const media = {
    mimeType: mimeType,
    body: fs.createReadStream(filePath),
  };

  const response = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id, name, webViewLink, webContentLink',
  });

  const fileId = response.data.id;

  // Set file permission to anyone with link can view
  try {
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });
  } catch (permErr) {
    console.warn(`Warning: Could not set public permission on Google Drive file ${fileId}:`, permErr.message);
  }

  return {
    fileId: fileId,
    webViewLink: response.data.webViewLink,
    webContentLink: response.data.webContentLink,
    directUrl: `https://drive.google.com/uc?export=download&id=${fileId}`,
  };
}

/**
 * Deletes a file from Google Drive
 */
async function deleteVideoFromDrive(fileId) {
  const drive = getDrive();
  await drive.files.delete({
    fileId: fileId,
  });
}

/**
 * Gets a video stream from Google Drive with optional Range header support
 */
async function streamVideoFromDrive(fileId, headers = {}) {
  const drive = getDrive();
  return await drive.files.get(
    {
      fileId: fileId,
      alt: 'media',
    },
    {
      responseType: 'stream',
      headers: headers,
    }
  );
}

module.exports = {
  uploadVideoToDrive,
  deleteVideoFromDrive,
  streamVideoFromDrive,
  getOAuth2Client,
};


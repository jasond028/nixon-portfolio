const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const http = require('http');
const url = require('url');
const { google } = require('googleapis');

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/oauth2callback';

if (!clientId || !clientSecret) {
  console.error('Error: Please configure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env first.');
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

const scopes = [
  'https://www.googleapis.com/auth/drive',
];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
  prompt: 'consent',
});

console.log('\n=== Google OAuth2 Refresh Token Generator ===');
console.log('1. Open this URL in your browser:\n');
console.log(authUrl);
console.log('\n2. Sign in with your Google account and grant Drive access.');
console.log('3. Listening for the callback on http://localhost:5000/oauth2callback ...\n');

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  if (parsedUrl.pathname === '/oauth2callback') {
    const code = parsedUrl.query.code;
    if (code) {
      try {
        const { tokens } = await oauth2Client.getToken(code);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h2>Google Drive Authorization Successful!</h2><p>You can close this tab now and check your terminal.</p>');
        console.log('\n Successfully acquired tokens!\n');
        console.log('Add this to your .env file:');
        console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}\n`);
        server.close();
        process.exit(0);
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Error retrieving tokens: ${e.message}`);
        console.error('Error retrieving tokens:', e);
        server.close();
        process.exit(1);
      }
    }
  }
});

server.listen(5000);


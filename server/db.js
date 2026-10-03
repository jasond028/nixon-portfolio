const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
// Load .env from server dir or root dir
if (fs.existsSync(path.join(__dirname, '.env'))) {
  require('dotenv').config({ path: path.join(__dirname, '.env') });
} else {
  require('dotenv').config({ path: path.join(__dirname, '../.env') });
}

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'portfolio',
  user: process.env.DB_USER || 'postgres',
  password: String(process.env.DB_PASSWORD || ''),
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err);
});

// Auto-run schema to ensure tables exist
async function initDb() {
  try {
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await pool.query(schemaSql);
      console.log('Database tables verified / initialized successfully.');
    }
  } catch (err) {
    console.error('Error initializing database tables:', err.message);
  }
}

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
  initDb,
};


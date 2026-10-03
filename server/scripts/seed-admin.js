const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const bcrypt = require('bcryptjs');
const db = require('../db');

async function seedAdmin() {
  const email = process.argv[2] || 'admin@nixonportfolio.com';
  const password = process.argv[3] || 'Admin1234!';

  try {
    console.log(`Hashing password and creating admin: ${email}...`);
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const query = `
      INSERT INTO admins (email, password_hash)
      VALUES ($1, $2)
      ON CONFLICT (email) 
      DO UPDATE SET password_hash = EXCLUDED.password_hash
      RETURNING id, email, created_at;
    `;

    const res = await db.query(query, [email.toLowerCase(), hash]);
    console.log('Admin account created / updated successfully:');
    console.log(res.rows[0]);
    console.log(`\nCredentials:\nEmail: ${email}\nPassword: ${password}\n`);
    process.exit(0);
  } catch (err) {
    console.error('Failed to seed admin:', err.message);
    process.exit(1);
  }
}

seedAdmin();


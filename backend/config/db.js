const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  database: process.env.DB_NAME,
  connectionTimeoutMillis: 10000,
});

pool.on('error', (err) => {
  console.error('❌ שגיאה בלתי צפויה בחיבור פנוי:', err.message);
});

const waitForDb = async (retries = 5, delay = 3000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await pool.query('SELECT NOW()');
      console.log('✅ בסיס הנתונים מוכן');
      return true;
    } catch (err) {
      if (i < retries - 1) {
        console.log(`⏳ ממתין לבסיס הנתונים... (ניסיון ${i + 1}/${retries})`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw err;
      }
    }
  }
};

module.exports = { pool, waitForDb };

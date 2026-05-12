const { Pool } = require('pg');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

// In production (Render), use DATABASE_URL; locally use individual vars
const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: isProduction ? { rejectUnauthorized: false } : false,
      connectionTimeoutMillis: 10000,
    }
  : {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      connectionTimeoutMillis: 10000,
    };

console.log(`📡 DB mode: ${process.env.DATABASE_URL ? 'DATABASE_URL (cloud)' : 'individual vars (local)'}`);

const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client:', err.message);
});

pool.on('connect', () => {
  console.log('✅ Successfully connected to PostgreSQL');
});

// Retry logic: wait for DB to be ready (useful on Render cold starts)
const waitForDb = async (retries = 12, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await pool.query('SELECT NOW()');
      console.log('✅ Database is ready');
      return true;
    } catch (err) {
      if (i < retries - 1) {
        console.log(`⏳ Database not ready yet, retrying in ${delay / 1000}s (attempt ${i + 1}/${retries})...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        console.error('❌ Failed to connect to database after retries');
        throw err;
      }
    }
  }
};

module.exports = { pool, waitForDb };

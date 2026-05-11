const { Pool } = require('pg');
require('dotenv').config();

console.log('📡 Database Configuration:');
console.log(`   Host: ${process.env.DB_HOST}`);
console.log(`   Port: ${process.env.DB_PORT}`);
console.log(`   Database: ${process.env.DB_NAME}`);
console.log(`   User: ${process.env.DB_USER}`);

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client:', err.message);
});

pool.on('connect', () => {
  console.log('✅ Successfully connected to PostgreSQL');
});

// Retry logic: Wait for database to be ready
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

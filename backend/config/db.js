const { Pool } = require('pg');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

// בסביבת ייצור (Render) משתמשים ב-DATABASE_URL; בפיתוח מקומי — משתנים נפרדים
const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: isProduction ? { rejectUnauthorized: false } : false,
      connectionTimeoutMillis: 10000,
    }
  : {
      user:     process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host:     process.env.DB_HOST,
      port:     process.env.DB_PORT,
      database: process.env.DB_NAME,
      connectionTimeoutMillis: 10000,
    };

console.log(`📡 מצב DB: ${process.env.DATABASE_URL ? 'DATABASE_URL (ענן)' : 'משתנים נפרדים (מקומי)'}`);

// יצירת מאגר חיבורים ל-PostgreSQL
const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('❌ שגיאה בלתי צפויה בחיבור פנוי:', err.message);
});

pool.on('connect', () => {
  console.log('✅ חיבור ל-PostgreSQL הצליח');
});

// לוגיקת ניסיון חוזר — שימושי ב-Render שבו ה-DB מתעורר לאט
const waitForDb = async (retries = 12, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await pool.query('SELECT NOW()');
      console.log('✅ בסיס הנתונים מוכן');
      return true;
    } catch (err) {
      if (i < retries - 1) {
        console.log(`⏳ בסיס הנתונים עדיין לא מוכן, מנסה שוב בעוד ${delay / 1000}ש (ניסיון ${i + 1}/${retries})...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        console.error('❌ חיבור לבסיס הנתונים נכשל לאחר כל הניסיונות');
        throw err;
      }
    }
  }
};

module.exports = { pool, waitForDb };

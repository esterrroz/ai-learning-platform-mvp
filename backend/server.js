require('dotenv').config();

// בדיקת משתני סביבה חובה לפני הפעלת השרת
const REQUIRED_ENV = [
  { key: 'OPENAI_API_KEY', hint: 'קבל מ-https://platform.openai.com/api-keys' },
  { key: 'JWT_SECRET',     hint: 'הגדר מחרוזת אקראית ארוכה (למשל: openssl rand -hex 32)' },
];

// בדיקה שיש הגדרות חיבור לבסיס הנתונים
if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_NAME) {
  console.error('❌ חסרות הגדרות DB: הגדר DB_HOST/DB_USER/DB_NAME/DB_PASSWORD/DB_PORT');
  process.exit(1);
}

const missingVars = REQUIRED_ENV.filter(({ key }) => !process.env[key]);
if (missingVars.length > 0) {
  missingVars.forEach(({ key, hint }) =>
    console.error(`❌ משתנה סביבה חסר: ${key} — ${hint}`)
  );
  process.exit(1);
}

const express    = require('express');
const cors       = require('cors');
const swaggerUi  = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const { pool, waitForDb } = require('./config/db');
const initDb     = require('./models/initDb');

// ייבוא נתיבי ה-API
const materialRoutes = require('./routes/materialRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes     = require('./routes/userRoutes');
const authRoutes     = require('./routes/authRoutes');
const { authMiddleware } = require('./middleware/auth');

const app  = express();
const PORT = process.env.PORT || 5000;

// הגדרת CORS — מאפשר בקשות מכל מקור (פיתוח מקומי וענן)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// פרסור JSON בגוף הבקשה
app.use(express.json());

// תיעוד API אינטראקטיבי — זמין ב-/api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// הגדרת נתיבים
app.use('/api/auth',       authRoutes);                        // התחברות + JWT
app.use('/api/materials',  authMiddleware, materialRoutes);    // חומרי לימוד (מוגן)
app.use('/api/categories', categoryRoutes);                    // קטגוריות (פתוח)
app.use('/api/users',      userRoutes);                        // משתמשים

// בדיקת תקינות השרת ובסיס הנתונים
app.get('/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.status(200).json({
      status: 'OK',
      message: 'השרת פועל ומחובר לבסיס הנתונים',
      timestamp: result.rows[0].now,
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'חיבור לבסיס הנתונים נכשל',
      error: error.message,
    });
  }
});

// הפעלת השרת — ממתין לבסיס הנתונים ואז מאתחל את הסכמה
const startServer = async () => {
  try {
    console.log('🚀 מפעיל שרת...');
    console.log('⏳ ממתין לבסיס הנתונים...');
    await waitForDb();
    console.log('📝 מאתחל סכמת בסיס הנתונים...');
    await initDb();
    app.listen(PORT, () => {
      console.log(`✅ השרת פועל על פורט ${PORT}`);
      console.log(`📚 תיעוד API זמין ב-http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('❌ הפעלת השרת נכשלה:', error.message);
    process.exit(1);
  }
};

startServer();

require('dotenv').config();

// ── Environment validation ────────────────────────────────────────────────────
const REQUIRED_ENV = [
  { key: 'OPENAI_API_KEY', hint: 'Get it from https://platform.openai.com/api-keys' },
  { key: 'JWT_SECRET',     hint: 'Set a long random string (e.g. openssl rand -hex 32)' },
];

const hasDbUrl  = !!process.env.DATABASE_URL;
const hasDbVars = process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME;
if (!hasDbUrl && !hasDbVars) {
  console.error('❌ Missing database config: set DATABASE_URL (production) or DB_HOST/DB_USER/DB_NAME/DB_PASSWORD/DB_PORT (local)');
  process.exit(1);
}

const missingVars = REQUIRED_ENV.filter(({ key }) => !process.env[key]);
if (missingVars.length > 0) {
  missingVars.forEach(({ key, hint }) =>
    console.error(`❌ Missing env var: ${key} — ${hint}`)
  );
  process.exit(1);
}
// ─────────────────────────────────────────────────────────────────────────────

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const { pool, waitForDb } = require('./config/db');
const initDb = require('./models/initDb');
const materialRoutes = require('./routes/materialRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes     = require('./routes/userRoutes');
const authRoutes     = require('./routes/authRoutes');
const { authMiddleware } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. הגדרת CORS מפורטת - מבטיח חיבור תקין מהענן
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. הגדרת JSON Middleware
app.use(express.json());

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
});

// הפיכת ה-upload לזמין ב-Routes
app.use((req, res, next) => {
  req.uploadPDF = upload.single('pdf');
  next();
});

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth',       authRoutes);
app.use('/api/materials',  authMiddleware, materialRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users',       userRoutes);

// Health check route
app.get('/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.status(200).json({
      status: 'OK',
      message: 'Server is running and connected to database',
      timestamp: result.rows[0].now,
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Database connection failed',
      error: error.message,
    });
  }
});

// Start server and initialize database
const startServer = async () => {
  try {
    console.log('🚀 Starting server...');
    console.log('⏳ Waiting for database to be ready...');
    await waitForDb();
    console.log('📝 Initializing database schema...');
    await initDb();
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`📚 API Docs available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
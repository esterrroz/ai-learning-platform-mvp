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

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Only accept PDF files
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Make upload middleware available to routes
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
app.use('/api/users',      userRoutes);

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
    console.error('Error details:', error);
    process.exit(1);
  }
};

startServer();

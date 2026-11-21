require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const cron = require('node-cron');
const mongoose = require('mongoose');

// Import Route Handlers
const authRoutes = require('./routes/authRoutes');
const internRoutes = require('./routes/internRoutes');
const companyRoutes = require('./routes/companyRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { triggerScheduledReallocation } = require('./controllers/adminController');

const app = express();

// 1. Establish Database Connection
connectDB();

// 2. Global Security & Utility Middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow images/PDFs across ports
  })
);

const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Dev convenience
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// 3. Static Upload Directory Serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 4. Rate Limiting on Authentication Endpoints (10 req/min)
const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20, // 20 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 1 minute.',
  },
});
app.use('/api/v1/auth', authLimiter);

// 5. Mount API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/intern', internRoutes);
app.use('/api/v1/company', companyRoutes);
app.use('/api/v1/admin', adminRoutes);

// Health Check Probe
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Allocation AI Engine Server',
  });
});

// 404 Catch-all Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Resource endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(`[Server Exception] ${err.stack || err.message}`);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`[Server] Allocation AI Core API running on port ${PORT}`);
  console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);

  // Scheduled automatic re-allocation of freed capacity (node-cron).
  // Runs hourly at default; disable via ENABLE_AUTO_REALLOC=false
  if (process.env.ENABLE_AUTO_REALLOC !== 'false') {
    const schedule = process.env.REALLOC_CRON || '0 * * * *';
    cron.schedule(schedule, async () => {
      try {
        const result = await triggerScheduledReallocation();
        console.log(`[Cron] Auto re-allocation ${result.success ? 'started' : 'skipped'} (${result.message || 'OK'})`);
      } catch (err) {
        console.error(`[Cron] Auto re-allocation failed: ${err.message}`);
      }
    });
    console.log(`[Cron] Auto re-allocation scheduled: ${schedule}`);
  }
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('[Server] SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('[Server] Process terminated.');
  });
});

module.exports = app;

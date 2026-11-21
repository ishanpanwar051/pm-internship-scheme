require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const cron = require('node-cron');
const mongoose = require('mongoose');

// Require JWT_SECRET and fail fast if missing
if (!process.env.JWT_SECRET) {
  console.error('[Security] FATAL: JWT_SECRET environment variable is missing.');
  process.exit(1);
}

// Import Route Handlers
const authRoutes = require('./routes/authRoutes');
const internRoutes = require('./routes/internRoutes');
const companyRoutes = require('./routes/companyRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { triggerScheduledReallocation } = require('./controllers/adminController');

const { protect } = require('./middleware/auth');
const InternProfile = require('./models/InternProfile');
const CompanyProfile = require('./models/CompanyProfile');
const Allocation = require('./models/Allocation');

const app = express();

// 1. Establish Database Connection
connectDB();

// 2. Global Security & Utility Middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:3000',
  process.env.VITE_CLIENT_URL,
  'https://ishanpanwar051.github.io',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith('.trycloudflare.com') ||
        origin.endsWith('.github.io') ||
        allowedOrigins.some((o) => origin.startsWith(o))
      ) {
        return callback(null, true);
      }
      return callback(new Error('Blocked by CORS policy'));
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

// 3. Protected Upload Directory Serving
app.get('/uploads/:filename', protect, async (req, res) => {
  try {
    const { filename } = req.params;
    const safeFilename = path.basename(filename);
    const filePath = path.join(__dirname, 'uploads', safeFilename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'File not found.' });
    }

    // Admin has access to all files
    if (req.user.role === 'admin') {
      return res.sendFile(filePath);
    }

    // Intern can access their own resume
    if (req.user.role === 'intern') {
      const profile = await InternProfile.findOne({ userId: req.user._id });
      if (profile && profile.resumeUrl && profile.resumeUrl.includes(safeFilename)) {
        return res.sendFile(filePath);
      }
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    // Company can access resumes of interns allocated/matched to their slots
    if (req.user.role === 'company') {
      const compProfile = await CompanyProfile.findOne({ userId: req.user._id });
      if (compProfile) {
        const allocations = await Allocation.find({ companyId: compProfile._id }).populate({
          path: 'internId',
          select: 'resumeUrl',
        });
        const hasAccess = allocations.some((a) => a.internId?.resumeUrl?.includes(safeFilename));
        if (hasAccess) {
          return res.sendFile(filePath);
        }
      }
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    return res.status(403).json({ success: false, message: 'Access denied.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Unable to retrieve file.' });
  }
});

// 4. Rate Limiting on Authentication Endpoints
const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again after 1 minute.',
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
    service: 'PM Internship Portal API Server',
  });
});

// 404 Catch-all Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Resource endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler (never leaks internal stack traces)
app.use((err, req, res, next) => {
  console.error(`[Server Exception] ${err.message}`);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'An unexpected error occurred. Please try again.',
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`[Server] PM Internship Portal API Server running on port ${PORT}`);
  console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);

  // Scheduled automatic re-allocation of freed capacity
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

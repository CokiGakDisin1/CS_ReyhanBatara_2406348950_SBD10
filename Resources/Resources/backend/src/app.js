const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Import routes
const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const reportRoutes = require('./routes/reportRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Security headers
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: true, // Allow all origins for production simplicity
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting (Increased for testing)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // Increased to 100 to avoid blocking you
  message: {
    success: false,
    message: 'Too many requests, please try again later',
    payload: null
  }
});

// Support for /api prefix on Vercel
const router = express.Router();
app.use('/api', router);

// Mount all routes to both root and /api for compatibility
[app, router].forEach(base => {
  base.use('/auth', authLimiter, authRoutes);
  base.use('/user', userRoutes);
  base.use('/items', itemRoutes);
  base.use('/transaction', transactionRoutes);
  base.use('/reports', reportRoutes);
});
// Duplicate routes removed

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    payload: null,
  });
});

// Simple error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error_details: process.env.NODE_ENV === 'production' ? err.toString() : null, // Show details for debugging
    payload: null,
  });
});

module.exports = app;
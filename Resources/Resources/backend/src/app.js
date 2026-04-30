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
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting untuk autentikasi
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 5, // Limit tiap IP maksimal 5 request
  message: {
    success: false,
    message: 'Too many login attempts from this IP, please try again after 15 minutes',
    payload: null
  }
});

// API routes
// Gunakan authLimiter di route login/auth
app.use('/auth', authLimiter, authRoutes);
// Jika mau limit register juga, pasang di /user/register, namun soal bilang "pada endpoint autentikasi (login, register)".
// Akan kita tempelkan re-limit di route router.post('/register', authLimiter, ...) atau di app.use khusus jika dipisah.
// Karena register di /user/register, kita wrap /user/register dengan limiter.
app.use('/user/register', authLimiter);
app.use('/user', userRoutes);
app.use('/items', itemRoutes);
app.use('/transaction', transactionRoutes);
app.use('/reports', reportRoutes);

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
    payload: null,
  });
});

module.exports = app;
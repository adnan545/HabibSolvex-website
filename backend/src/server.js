const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const path = require('path');

dotenv.config();

const connectDB = require('./config/database');

const app = express();

// ===== CORS CONFIGURATION =====
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://habib-solvex-website.vercel.app',
  'https://habib-solvex-website-37l5bi748.vercel.app',
  'https://*.vercel.app',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    if (origin && origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    console.log('❌ Blocked origin:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Accept', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie'],
}));

app.options('*', cors());

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ===== ROOT ROUTES =====
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Habib Solvex Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      root: '/',
      api: '/api',
      health: '/api/health',
      auth: '/api/auth',
      contact: '/api/contact',
      events: '/api/events'
    }
  });
});

// ✅ ADD THIS - API root route
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Habib Solvex API is running',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      contact: '/api/contact',
      events: '/api/events'
    },
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    cors: 'enabled',
    mongodb: 'connected'
  });
});

// ===== ROUTES =====
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contact');
const eventRoutes = require('./routes/events');

app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/events', eventRoutes);

// ===== 404 Handler =====
app.use((req, res) => {
  console.log(`❌ 404: ${req.method} ${req.url}`);
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.url,
    method: req.method
  });
});

// ===== Error Handler =====
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ===== Start Server =====
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Client URL: ${process.env.CLIENT_URL || 'not set'}`);
  console.log(`✅ CORS enabled`);
});
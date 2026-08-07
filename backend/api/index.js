// This is the entry point for Vercel serverless functions
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
const authRoutes = require('../src/routes/auth');
const contactRoutes = require('../src/routes/contact');
const eventRoutes = require('../src/routes/events');

app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/events', eventRoutes);

// Backward-compatible aliases for clients still calling non-/api routes.
app.use('/auth', authRoutes);
app.use('/contact', contactRoutes);
app.use('/events', eventRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running!' });
});

module.exports = app;
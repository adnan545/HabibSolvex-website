const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
// Import from index instead of directly
const { User } = require('../models');
const { verifyToken, isAdmin } = require('../middleware/auth');

// ============================================
// REGISTER - Always creates user with role 'user'
// ============================================
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required').trim(),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { name, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ 
          success: false, 
          message: 'User with this email already exists.' 
        });
      }

      // Create new user - ALWAYS role: 'user'
      // To make someone admin, update role in MongoDB manually
      const user = await User.create({ 
        name, 
        email, 
        password, 
        role: 'user'  // Explicitly set to 'user'
      });

      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.status(201).json({
        success: true,
        message: 'Registration successful! You are registered as a user.',
        data: { 
          user, 
          token,
          note: 'To get admin access, contact the administrator to update your role in the database.'
        }
      });

    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ success: false, message: 'Registration failed. Please try again.' });
    }
  }
);

// ============================================
// LOGIN
// ============================================
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      if (!user.isActive) {
        return res.status(401).json({ success: false, message: 'Account is deactivated. Please contact admin.' });
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }

      user.lastLogin = new Date();
      await user.save();

      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.json({
        success: true,
        message: 'Login successful!',
        data: { user, token }
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
    }
  }
);

// ============================================
// LOGOUT
// ============================================
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully.' });
});

// ============================================
// GET CURRENT USER
// ============================================
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, data: { user } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get user data.' });
  }
});

// ============================================
// CHECK ADMIN STATUS
// ============================================
router.get('/check-admin', verifyToken, isAdmin, (req, res) => {
  res.json({ 
    success: true, 
    data: { 
      isAdmin: true, 
      role: req.user.role 
    } 
  });
});

// ============================================
// UPDATE USER ROLE (Admin only)
// ============================================
router.patch(
  '/:id/role',
  verifyToken,
  isAdmin,
  [
    body('role').isIn(['user', 'admin']).withMessage('Invalid role. Must be "user" or "admin"')
  ],
  async (req, res) => {
    try {
      const { id } = req.params;
      const { role } = req.body;

      // Prevent self-demotion
      if (id === req.user._id.toString() && role === 'user') {
        return res.status(400).json({
          success: false,
          message: 'You cannot demote yourself from admin to user.'
        });
      }

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      user.role = role;
      await user.save();

      res.json({
        success: true,
        message: `User role updated to "${role}" successfully.`,
        data: { user }
      });

    } catch (error) {
      console.error('Role update error:', error);
      res.status(500).json({ success: false, message: 'Failed to update user role.' });
    }
  }
);

// ============================================
// GET ALL USERS (Admin only)
// ============================================
router.get('/users', verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: { users } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users.' });
  }
});

// ============================================
// TOGGLE USER STATUS (Admin only)
// ============================================
router.patch('/:id/toggle-status', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot deactivate yourself.'
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully.`,
      data: { user }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to toggle user status.' });
  }
});

module.exports = router;
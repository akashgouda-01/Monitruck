// controllers/auth.controller.js
const FleetManager = require('../models/FleetManager');
const jwt = require('jsonwebtoken');
require('dotenv').config(); 
const bcrypt = require('bcryptjs');
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'monitruck-secret', {
    expiresIn: '7d',
  });
};

// @desc    Login fleet manager
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  const { email, password } = req.body;

  console.log('🔐 Login attempt:', email);

  try {
    // Find manager by email
    const manager = await FleetManager.findOne({ email });
    if (!manager) {
      console.log('❌ User not found:', email);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Match password
    const isMatch = await manager.matchPassword(password);
    if (!isMatch) {
      console.log('❌ Password mismatch for:', email);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(manager._id);

    console.log('✅ Login successful:', manager.email);

    // Send response
    res.json({
      success: true,
      token,
      manager: {
        id: manager._id,
        name: manager.name,
        email: manager.email,
        role: manager.role,
      },
    });
  } catch (err) {
    console.error('❌ Error in login:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get logged-in manager profile
// @route   GET /api/auth/me
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const manager = await FleetManager.findById(req.manager.id).select('-password');
    if (!manager) {
      return res.status(404).json({ success: false, message: 'Manager not found' });
    }

    res.json({ success: true, data: manager });
  } catch (err) {
    console.error('❌ Error in getProfile:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};
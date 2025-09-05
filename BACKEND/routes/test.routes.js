// routes/test.routes.js
const express = require('express');
const router = express.Router();
const FleetManager = require('../models/FleetManager');
const bcrypt = require('bcryptjs');

// routes/test.routes.js
const jwt = require('jsonwebtoken');

// Temporary route: Get a test login token
router.get('/login-as-test-manager', (req, res) => {
  const payload = {
    id: 'test-manager-id-123', // fake user ID
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET || 'monitruck-secret', {
    expiresIn: '7d',
  });

  res.json({
    success: true,
    token,
    manager: {
      id: 'test-manager-id-123',
      name: 'Test Manager',
      email: 'test@monitruck.com',
      role: 'manager',
    },
  });
});

router.post('/seed', async (req, res) => {
  try {
    const existing = await FleetManager.findOne({ email: "monitruck2025@gmail.com" });
    if (existing) {
      return res.json({ success: true, message: "User already exists!" });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash("password123", salt);

    const manager = new FleetManager({
      name: "Test Manager",
      email: "monitruck2025@gmail.com",
      password: hashedPassword,
      role: "manager"
    });

    await manager.save();
    res.json({ success: true, message: "Fleet manager saved!" });
  } catch (err) {
    console.error('❌ Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
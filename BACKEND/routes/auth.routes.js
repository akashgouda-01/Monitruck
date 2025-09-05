const express = require('express');
const router = express.Router();
const { login, getProfile } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/login', login);
router.get('/me', protect, getProfile); 

module.exports = router;
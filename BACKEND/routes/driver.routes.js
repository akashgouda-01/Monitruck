const express = require('express');
const router = express.Router();
const { updateDriverStatus, getDriverStatus } = require('../controllers/driver.controller');

router.post('/status', updateDriverStatus);
router.get('/:driverId', getDriverStatus);

module.exports = router;
const express = require('express');
const router = express.Router();
const { updateFuelLevel, getFuelStats } = require('../controllers/fuel.controller');

router.post('/update', updateFuelLevel);
router.get('/:truckId', getFuelStats);

module.exports = router;
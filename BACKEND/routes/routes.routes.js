// routes/trucks.routes.js
const express = require('express');
const router = express.Router();
const { createTruck, getTruck } = require('../controllers/trucks.controller');

router.post('/create', createTruck);
router.get('/:truckId', getTruck);

module.exports = router;
const express = require('express');
const router = express.Router();
const { createTruck } = require('../controllers/trucks.controller');

router.post('/create', createTruck);
module.exports = router;
const express = require('express');
const router = express.Router();
const { createAlert, getAlerts } = require('../controllers/alerts.controller');

router.post('/create', createAlert);
router.get('/', getAlerts);

module.exports = router;
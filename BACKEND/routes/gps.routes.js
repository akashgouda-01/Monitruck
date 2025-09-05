const express = require('express');
const router = express.Router();
const { updateLocation, getLatestLocation, getAllLocations } = require('../controllers/gps.controller');

console.log('✅ GPS Routes loaded');
console.log('🎯 getAllLocations function:', getAllLocations);

router.post('/update', updateLocation);
router.get('/:truckId', getLatestLocation);
router.get('/all', getAllLocations);

module.exports = router;
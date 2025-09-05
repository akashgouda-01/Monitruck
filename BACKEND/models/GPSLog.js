const mongoose = require('mongoose');

const gpsLogSchema = new mongoose.Schema({
  truckId: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  speed: { type: Number }, 
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('GPSLog', gpsLogSchema);
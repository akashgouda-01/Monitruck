const mongoose = require('mongoose');

const fuelLogSchema = new mongoose.Schema({
  truckId: { type: String, required: true },
  level: { type: Number, required: true }, 
  timestamp: { type: Date, default: Date.now },
  leakDetected: { type: Boolean, default: false },
});

module.exports = mongoose.model('FuelLog', fuelLogSchema);
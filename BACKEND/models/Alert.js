const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  alertId: { type: String, required: true, unique: true },
  truckId: { type: String },
  driverId: { type: String },
  type: { 
    type: String, 
    enum: ['drowsy_driver', 'fuel_theft', 'accident', 'route_deviation'] 
  },
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  resolved: { type: Boolean, default: false },
});

module.exports = mongoose.model('Alert', alertSchema);
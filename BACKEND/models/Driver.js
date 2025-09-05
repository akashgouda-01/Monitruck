const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  driverId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  status: { type: String, enum: ['awake', 'drowsy', 'off-duty'], default: 'awake' },
  lastChecked: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Driver', driverSchema);
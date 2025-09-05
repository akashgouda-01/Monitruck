const mongoose = require('mongoose');

const truckSchema = new mongoose.Schema({
  truckId: { type: String, required: true, unique: true },
  driverId: { type: String, ref: 'Driver' },
  lastLocation: {
    lat: Number,
    lng: Number,
    timestamp: Date,
  },
  fuelLevel: { type: Number }, 
  status: { type: String, enum: ['active', 'inactive', 'maintenance'], default: 'active' },
}, { timestamps: true });

module.exports = mongoose.model('Truck', truckSchema);
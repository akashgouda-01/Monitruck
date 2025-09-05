const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  routeId: { type: String, required: true, unique: true },
  truckId: { type: String, required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  waypoints: [{ lat: Number, lng: Number }],
  status: { type: String, enum: ['pending', 'in-progress', 'completed', 'delayed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
});

module.exports = mongoose.model('Route', routeSchema);
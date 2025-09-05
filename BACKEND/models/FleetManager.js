const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const fleetManagerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed
  role: { type: String, enum: ['admin', 'manager'], default: 'manager' },
  createdAt: { type: Date, default: Date.now }
});

fleetManagerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

fleetManagerSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('FleetManager', fleetManagerSchema);
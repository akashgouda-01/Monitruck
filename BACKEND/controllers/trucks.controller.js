const Truck = require('../models/Truck');

// Create a new truck
exports.createTruck = async (req, res) => {
  const { truckId, driverId, status } = req.body;

  try {
    const truck = new Truck({
      truckId,
      driverId,
      status: status || 'active',
      fuelLevel: 100, // default
      lastLocation: null
    });

    await truck.save();
    res.status(201).json({ success: true, data: truck });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'Truck ID already exists' });
    }
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get truck by ID
exports.getTruck = async (req, res) => {
  const { truckId } = req.params;
  try {
    const truck = await Truck.findOne({ truckId });
    if (!truck) return res.status(404).json({ success: false, message: 'Truck not found' });
    res.json({ success: true, data: truck });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
const GPSLog = require('../models/GPSLog');
const Truck = require('../models/Truck');

exports.updateLocation = async (req, res) => {
  const { truckId, lat, lng, speed } = req.body;

  try {
    const log = new GPSLog({ truckId, lat, lng, speed });
    await log.save();

    await Truck.findOneAndUpdate(
      { truckId },
      { lastLocation: { lat, lng, timestamp: new Date() }, status: 'active' },
      { new: true }
    );

    res.status(201).json({ success: true, data: log });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getLatestLocation = async (req, res) => {
  const { truckId } = req.params;
  try {
    const log = await GPSLog.findOne({ truckId }).sort({ timestamp: -1 });
    if (!log) return res.status(404).json({ success: false, message: 'No GPS data found' });
    res.json({ success: true, data: log });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
exports.getAllLocations = async (req, res) => {
  try {
    const truckIds = await GPSLog.distinct('truckId');
    
    if (truckIds.length === 0) {
      return res.status(404).json({ success: false, message: 'No trucks found' });
    }

    const locations = await Promise.all(
      truckIds.map(async (truckId) => {
        return await GPSLog.findOne({ truckId }).sort({ timestamp: -1 });
      })
    );

    res.json({ success: true, data: locations });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};
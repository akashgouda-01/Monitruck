const Alert = require('../models/Alert');

exports.createAlert = async (req, res) => {
  const { truckId, driverId, type, severity, message } = req.body;

  try {
    const alert = new Alert({
      alertId: `ALERT-${Date.now()}`,
      truckId,
      driverId,
      type,
      severity,
      message,
    });
    await alert.save();
    res.status(201).json({ success: true, data: alert });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({}).sort({ timestamp: -1 });
    res.json({ success: true, data: alerts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
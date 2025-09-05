const Driver = require('../models/Driver');
const Alert = require('../models/Alert');
const axios = require('axios');
const { sendAlertEmail } = require('../utils/mailer');
require('dotenv').config();

const PYTHON_SERVICE = process.env.PYTHON_DROWSINESS_SERVICE;

const createAlert = async (truckId, driverId, type, severity, message) => {
  const alert = new Alert({
    alertId: `ALERT-${Date.now()}`,
    truckId,
    driverId,
    type,
    severity,
    message,
  });
  await alert.save();
};

exports.updateDriverStatus = async (req, res) => {
  const { driverId, image } = req.body; // image: base64 string

  try {
    const response = await axios.post(PYTHON_SERVICE, { image, driverId });
    const { status, confidence } = response.data;

    await Driver.findOneAndUpdate(
      { driverId },
      { status, lastChecked: new Date() },
      { new: true, upsert: true }
    );

    if (status === 'drowsy') {
      await createAlert(
        null,
        driverId,
        'drowsy_driver',
        'high',
        `⚠️ Driver ${driverId} is drowsy (confidence: ${confidence})`
      );
      await sendAlertEmail('Drowsy Driver Alert', `Driver ${driverId} is showing signs of drowsiness.`);
    }

    res.json({ success: true, data: { driverId, status, confidence } });
  } catch (err) {
    console.error('Drowsiness analysis failed:', err.message);
    res.status(500).json({ success: false, error: 'Failed to analyze driver' });
  }
};

exports.getDriverStatus = async (req, res) => {
  const { driverId } = req.params;
  try {
    const driver = await Driver.findOne({ driverId });
    if (!driver) return res.status(404).json({ success: false, message: 'Driver not found' });
    res.json({ success: true, data: driver });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
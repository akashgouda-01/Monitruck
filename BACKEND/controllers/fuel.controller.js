const FuelLog = require('../models/FuelLog');
const Truck = require('../models/Truck');
const { sendAlertEmail } = require('../utils/mailer');

exports.updateFuelLevel = async (req, res) => {
  const { truckId, level } = req.body;

  try {
    const previousLog = await FuelLog.findOne({ truckId }).sort({ timestamp: -1 });
    const leakDetected = previousLog && previousLog.level - level > 20; // sudden drop

    const fuelLog = new FuelLog({ truckId, level, leakDetected });
    await fuelLog.save();

    await Truck.findOneAndUpdate({ truckId }, { fuelLevel: level }, { new: true });

    if (leakDetected) {
      await createAlert(
        truckId,
        null,
        'fuel_theft',
        'critical',
        `🚨 Fuel theft detected on Truck ${truckId}! Sudden drop from ${previousLog.level}% to ${level}%`
      );
      await sendAlertEmail('Fuel Theft Alert', `Fuel theft suspected on Truck ${truckId}`);
    }

    res.status(201).json({ success: true, data: fuelLog });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getFuelStats = async (req, res) => {
  const { truckId } = req.params;
  try {
    const logs = await FuelLog.find({ truckId }).sort({ timestamp: -1 }).limit(10);
    if (!logs.length) return res.status(404).json({ success: false, message: 'No fuel data' });
    res.json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
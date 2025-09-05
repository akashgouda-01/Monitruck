const Truck = require('../models/Truck');
const GPSLog = require('../models/GPSLog');
const FuelLog = require('../models/FuelLog');

// Helper: Convert "7" → "TRK007", or keep "TRK007" as-is
const normalizeTruckId = (input) => {
  const trimmed = input.trim().toUpperCase();
  if (trimmed.startsWith('TRK')) return trimmed; // Already in TRK007 format
  const num = parseInt(trimmed, 10);
  if (isNaN(num)) return null;
  // Format as TRK + 3 digits (e.g., 7 → TRK007)
  return `TRK${num.toString().padStart(3, '0')}`;
};

exports.chat = async (req, res) => {
  const { message } = req.body;
  const lower = message.toLowerCase();

  try {
    if (lower.includes('where is truck')) {
      // Match any word after "truck"
      const match = lower.match(/truck\s+(\w+)/i);
      if (!match) {
        return res.json({ reply: "I couldn't find a truck ID in your query." });
      }

      const rawId = match[1];
      const truckId = normalizeTruckId(rawId);

      if (!truckId) {
        return res.json({ reply: `Invalid truck ID: ${rawId}` });
      }

      // Check if truck exists
      const truck = await Truck.findOne({ truckId });
      if (!truck) {
        return res.json({ reply: `🚛 Truck ${truckId} is not registered in the system.` });
      }

      // Get latest GPS and fuel data
      const location = await GPSLog.findOne({ truckId }).sort({ timestamp: -1 });
      const fuel = await FuelLog.findOne({ truckId }).sort({ timestamp: -1 });

      if (location) {
        return res.json({
          reply: `📍 Truck ${truckId} is at:\n• Latitude: ${location.lat}\n• Longitude: ${location.lng}\n• Speed: ${location.speed} km/h\n• Fuel: ${fuel?.level ?? 'N/A'}%`
        });
      } else {
        return res.json({
          reply: `🚛 Truck ${truckId} has no recent GPS data. It may be offline.`
        });
      }
    }

    // Default fallback
    res.json({
      reply: "I can help with truck locations. Try asking: 'Where is Truck 7?' or 'Where is Truck TRK007?'"
    });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({
      reply: "Sorry, I couldn't process your request right now. Please try again."
    });
  }
};
const Route = require('../models/Route');

exports.createRoute = async (req, res) => {
  const { routeId, truckId, origin, destination, waypoints } = req.body;

  try {
    const route = new Route({ routeId, truckId, origin, destination, waypoints });
    await route.save();
    res.status(201).json({ success: true, data: route });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getRoutesByTruck = async (req, res) => {
  const { truckId } = req.params;
  try {
    const routes = await Route.find({ truckId });
    res.json({ success: true, data: routes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
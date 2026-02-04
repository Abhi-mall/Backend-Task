import Location from "../models/Location.js";
import { distanceKm } from "../utils/geo.js";

export async function createLocation(req, res) {
  const { name, code, state, region, latitude, longitude } = req.body;
  if (!name || !code || !state || !region || latitude == null || longitude == null) {
    return res.status(400).json({ message: "Missing fields" });
  }
  const loc = new Location({ name, code, state, region, latitude, longitude });
  await loc.save();
  res.status(201).json(loc);
}

export async function listLocations(req, res) {
  const user = req.user;
  let query = {};
  if (user.role === 'PROJECT_MANAGER') {
    query = {};
  } else if (user.role === 'STATE_MANAGER') {
    query = { state: user.state };
  } else if (user.role === 'REGION_MANAGER') {
    query = { region: user.region };
  } else if (user.role.startsWith('INSPECTOR')) {
    query = { region: user.region };
  }
  const locs = await Location.find(query);
  res.json(locs);
}

export async function getLocation(req, res) {
  res.json(req.location);
}

export async function nearbyLocations(req, res) {
  const { lat, lng, radiusKm } = req.query;
  if (!lat || !lng || !radiusKm) return res.status(400).json({ message: "lat, lng, radiusKm required" });
  const all = await Location.find({});
  const centerLat = parseFloat(lat);
  const centerLng = parseFloat(lng);
  const rKm = parseFloat(radiusKm);

  const results = all
    .map(loc => {
      const d = distanceKm(centerLat, centerLng, loc.latitude, loc.longitude);
      return { loc, distanceKm: d };
    })
    .filter(o => o.distanceKm <= rKm)
    .sort((a,b) => a.distanceKm - b.distanceKm)
    .map(o => ({ ...o.loc.toObject(), distanceKm: o.distanceKm }));

  res.json(results);
}

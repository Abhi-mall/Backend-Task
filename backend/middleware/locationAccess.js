import Location from "../models/Location.js";

export async function loadLocation(req, res, next) {
  const id = req.params.id || req.body.locationId;
  if (!id) return res.status(400).json({ message: "location id is required" });
  const loc = await Location.findById(id);
  if (!loc) return res.status(404).json({ message: "Location not found" });
  req.location = loc;
  next();
}

export function ensureLocationAccess() {
  return (req, res, next) => {
    const loc = req.location;
    const user = req.user;
    if (!loc || !user) return res.status(500).json({ message: "Missing context" });
    if (user.role === 'PROJECT_MANAGER') return next();
    if (user.role === 'STATE_MANAGER' && user.state === loc.state) return next();
    if (user.role === 'REGION_MANAGER' && user.region === loc.region) return next();
    if (user.role.startsWith('INSPECTOR') && user.region === loc.region) return next();

    return res.status(403).json({ message: "No access to this location" });
  };
}

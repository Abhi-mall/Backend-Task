import express from "express";
import { createLocation, listLocations, getLocation, nearbyLocations } from "../controllers/locationController.js";
import { authenticate } from "../middleware/auth.js";
import { allowRoles } from "../middleware/roles.js";
import { loadLocation, ensureLocationAccess } from "../middleware/locationAccess.js";

const locationsRoutes = express.Router();

locationsRoutes.post('/', authenticate, allowRoles('STATE_MANAGER'), createLocation);
locationsRoutes.get('/', authenticate, listLocations);
locationsRoutes.get('/nearby', authenticate, nearbyLocations);
locationsRoutes.get('/:id', authenticate, loadLocation, ensureLocationAccess(), getLocation);

export default locationsRoutes;

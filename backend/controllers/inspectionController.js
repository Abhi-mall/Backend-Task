import Inspection from "../models/Inspection.js";
import Location from "../models/Location.js";

const INSPECTION_ROLE_MAP = {
  TYPE_A: "INSPECTOR_TYPE_A",
  TYPE_B: "INSPECTOR_TYPE_B",
  TYPE_C: "INSPECTOR_TYPE_C",
};

export async function createInspection(req, res) {
  try {
    const { locationId, inspectionType, responses, geoMeta } = req.body;
    const inspector = req.user;

    const requiredRole = INSPECTION_ROLE_MAP[inspectionType];
    if (!requiredRole || inspector.role !== requiredRole) {
      return res.status(403).json({
        message: "inspector type mismatch",
      });
    }

    const location = await Location.findById(locationId);
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    if (location.region !== inspector.region) {
      return res.status(403).json({
        message: "location outside your region",
      });
    }

    const inspection = await Inspection.create({
      locationId,
      inspectorId: inspector._id,
      inspectionType,
      responses,
      geoMeta,
      submittedAt: new Date(),
    });

    return res.status(201).json(inspection);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function listInspections(req, res) {
  try {
    const user = req.user;
    const { locationId } = req.query;
    let query = {};

    if (locationId) query.locationId = locationId;

    if (user.role === "PROJECT_MANAGER") {
    } 
    else if (user.role === "STATE_MANAGER") {
      const locations = await Location.find(
        { state: user.state },
        "_id"
      );
      query.locationId = { $in: locations.map(l => l._id) };
    } 
    else if (
      user.role === "REGION_MANAGER" ||
      user.role.startsWith("INSPECTOR")
    ) {
      const locations = await Location.find(
        { region: user.region },
        "_id"
      );
      query.locationId = { $in: locations.map(l => l._id) };
    } 
    else {
      return res.status(403).json({ message: "Forbidden" });
    }

    const inspections = await Inspection.find(query)
      .populate("locationId")
      .populate("inspectorId", "-password -refreshToken");

    return res.json(inspections);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}

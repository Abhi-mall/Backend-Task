import express from "express";
import { createInspection, listInspections } from "../controllers/inspectionController.js";
import { authenticate } from "../middleware/auth.js";

const inspectionsRoutes = express.Router();

inspectionsRoutes.post('/', authenticate, createInspection);
inspectionsRoutes.get('/', authenticate, listInspections);

export default inspectionsRoutes;

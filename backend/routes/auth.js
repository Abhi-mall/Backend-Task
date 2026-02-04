import express from "express";
import { login, me } from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";

const authRoutes = express.Router();

authRoutes.post('/login', login);
authRoutes.get('/me', authenticate, me);

export default authRoutes;

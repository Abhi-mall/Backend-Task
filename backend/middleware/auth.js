import { verifyAccessToken } from "../utils/jwt.js";
import User from "../models/User.js";

export async function authenticate(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) return res.status(401).json({ message: "No token" });
    const token = auth.split(" ")[1];
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.id).select("-password -refreshToken");
    if (!user) return res.status(401).json({ message: "User not found" });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token", detail: err.message });
  }
}

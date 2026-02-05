import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { signAccessToken, signRefreshToken } from "../utils/jwt.js";

const refreshCookieOptions = (req) => ({
  httpOnly: true,
  secure: true,
});

export async function register(req, res) {
  try {
    const { name, email, password, role, state, region } = req.body;

    if (!name || !email || !password || !role || !state || !region) {
      return res.status(400).json({ message: "name, email, password, role, state and region are required" });
    }

    const allowedRoles = [
      "PROJECT_MANAGER",
      "STATE_MANAGER",
      "REGION_MANAGER",
      "INSPECTOR_TYPE_A",
      "INSPECTOR_TYPE_B",
      "INSPECTOR_TYPE_C",
    ];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashed,
      role,
      state,
      region
    });

    const payload = { id: user._id, role: user.role, state: user.state, region: user.region };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken({ id: user._id });

    user.refreshToken = refreshToken;
    await user.save();

    res
      .cookie("refreshToken", refreshToken, refreshCookieOptions(req))
      .cookie("accessToken", accessToken, refreshCookieOptions(req))
      .status(201)
      .json({
        accessToken,
        user: {
          id: user._id,
          name: user.name,
          role: user.role,
          state: user.state,
          region: user.region
        }
      });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}


export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) 
    return res.status(400).json({ message: "email and password required" });

  const user = await User.findOne({ email });

  if (!user) 
    return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password);

  if (!ok) 
    return res.status(401).json({ message: "Invalid credentials" });

  const payload = { id: user._id, role: user.role, state: user.state, region: user.region };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken({ id: user._id });

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("refreshToken", refreshToken, refreshCookieOptions(req)).cookie("accessToken", accessToken, refreshCookieOptions(req));
  res.json({
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      role: user.role,
      state: user.state,
      region: user.region
    }
  });
}

export async function me(req, res) {
  const u = req.user;
  res.json({
    id: u._id,
    name: u.name,
    role: u.role,
    state: u.state,
    region: u.region
  });
}


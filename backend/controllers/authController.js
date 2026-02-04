import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { signAccessToken, signRefreshToken } from "../utils/jwt.js";

const refreshCookieOptions = (req) => ({
  httpOnly: true,
  secure: true,
});

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "email and password required" });
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

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


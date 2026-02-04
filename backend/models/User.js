import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  role: { 
    type: String, 
    enum: ["PROJECT_MANAGER","STATE_MANAGER","REGION_MANAGER","INSPECTOR_TYPE_A","INSPECTOR_TYPE_B","INSPECTOR_TYPE_C"],
    required: true
  },
  state: { type: String, required: true },
  region: { type: String, required: true },
  refreshToken: { type: String } 
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;

import mongoose from "mongoose";

const siteUserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: false },
    name: { type: String, required: true },
    authProvider: {
      type: String,
      enum: ["local"],
      default: "local",
    },
    avatar: { type: String, default: "" },
    isVerified: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },
    verificationToken: String,
    verificationTokenExpiresAt: Date,
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    lastLogin: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const SiteUser = mongoose.model("SiteUser", siteUserSchema);
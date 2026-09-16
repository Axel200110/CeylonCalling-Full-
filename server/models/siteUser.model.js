import mongoose from "mongoose";

const siteUserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
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
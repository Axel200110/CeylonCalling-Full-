import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    userRegistration: {
      type: Boolean,
      default: true,
    },
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    systemVersion: {
      type: String,
      default: "2.1.0",
    },
  },
  { timestamps: true }
);

export const Settings = mongoose.model("Settings", settingsSchema);

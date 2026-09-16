import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["system", "security", "shop", "user", "listing"],
      default: "system",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Log = mongoose.model("Log", logSchema);

import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    tag: {
      type: String,
      enum: ["general", "special_event", "holiday", "temporary_closure", "new_menu"],
      default: "general",
    },
    image: {
      type: String,
      default: "",
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

export const Announcement = mongoose.models.Announcement || mongoose.model("Announcement", announcementSchema);

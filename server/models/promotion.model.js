import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema(
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
    description: {
      type: String,
      default: "",
      trim: true,
    },
    type: {
      type: String,
      enum: ["promotion", "offer"],
      default: "promotion",
      index: true,
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed", "deal"],
      default: "percentage",
    },
    discountValue: {
      type: Number,
      default: 0,
      min: 0,
    },
    code: {
      type: String,
      trim: true,
      default: "",
    },
    bannerImage: {
      type: String,
      default: "",
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    applicableCategory: {
      type: String,
      default: "All",
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

export const Promotion = mongoose.models.Promotion || mongoose.model("Promotion", promotionSchema);

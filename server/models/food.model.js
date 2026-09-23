import mongoose from "mongoose";

const foodItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    price: { type: Number, required: true, min: 0 },
    picture: { type: String, trim: true },
    description: { type: String, trim: true, default: "" },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
      index: true,
    },
    availability: {
      type: String,
      enum: ["available", "sold_out", "temporarily_unavailable"],
      default: "available",
      index: true,
    },
    tag: {
      type: String,
      enum: ["standard", "trending", "new", "chef_special", "recommended"],
      default: "standard",
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

foodItemSchema.index({ shop: 1, availability: 1 });

const FoodItem = mongoose.models.FoodItem || mongoose.model("FoodItem", foodItemSchema);

export default FoodItem;

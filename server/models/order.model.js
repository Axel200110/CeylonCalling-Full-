import mongoose from "mongoose";
import crypto from "crypto";

const orderItemSchema = new mongoose.Schema({
  food: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FoodItem",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderReference: {
      type: String,
      unique: true,
      index: true,
      trim: true,
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
      index: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SiteUser",
      required: false,
      index: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerContact: {
      type: String,
      required: true,
      trim: true,
    },
    customerEmail: {
      type: String,
      default: "",
      trim: true,
    },
    serviceType: {
      type: String,
      enum: ["dine_in", "takeaway", "delivery"],
      default: "takeaway",
    },
    deliveryAddress: {
      type: String,
      default: "",
      trim: true,
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "preparing", "ready", "completed", "cancelled"],
      default: "pending",
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cash_on_delivery", "card_counter", "online"],
      default: "cash_on_delivery",
    },
    specialNotes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

// Compound indexes for optimal query performance
orderSchema.index({ shop: 1, status: 1, createdAt: -1 });
orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });

// Helper to generate professional collision-resistant order reference: CC-YYYYMMDD-XXXXX
export const generateOrderReference = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const dateStr = `${year}${month}${day}`;
  const randomSuffix = crypto.randomBytes(3).toString("hex").toUpperCase().slice(0, 5);
  return `CC-${dateStr}-${randomSuffix}`;
};

// Auto generate human readable order reference before saving
orderSchema.pre("save", async function (next) {
  if (!this.orderReference) {
    let unique = false;
    let ref = "";
    let attempts = 0;
    while (!unique && attempts < 5) {
      ref = generateOrderReference();
      const existing = await mongoose.models.Order?.findOne({ orderReference: ref });
      if (!existing) {
        unique = true;
      }
      attempts++;
    }
    this.orderReference = ref;
  }
  next();
});

export const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

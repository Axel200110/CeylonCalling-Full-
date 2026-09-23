import mongoose from "mongoose";

const roomBookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      unique: true,
      index: true,
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
      index: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
      index: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SiteUser",
      required: false,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    customerPhone: {
      type: String,
      required: true,
      trim: true,
    },
    checkInDate: {
      type: Date,
      required: true,
    },
    checkOutDate: {
      type: Date,
      required: true,
    },
    guestsCount: {
      type: Number,
      default: 1,
      min: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "checked_in", "completed", "cancelled"],
      default: "pending",
      index: true,
    },
    specialRequests: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

// Auto-generate human-friendly booking reference
roomBookingSchema.pre("save", async function (next) {
  if (!this.bookingReference) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    this.bookingReference = `CC-STAY-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}${randomSuffix}`;
  }
  next();
});

export const RoomBooking = mongoose.models.RoomBooking || mongoose.model("RoomBooking", roomBookingSchema);

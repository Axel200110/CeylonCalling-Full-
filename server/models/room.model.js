import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    roomType: {
      type: String,
      enum: [
        "Single",
        "Double",
        "Deluxe",
        "Suite",
        "Family Room",
        "Villa Entire",
        "Bungalow",
        "Cottage",
        "Standard",
        "Dormitory",
      ],
      default: "Double",
    },
    description: {
      type: String,
      default: "",
    },
    pricePerNight: {
      type: Number,
      required: true,
      min: 0,
    },
    capacityGuests: {
      type: Number,
      default: 2,
      min: 1,
    },
    bedType: {
      type: String,
      default: "1 Queen Bed",
    },
    totalUnits: {
      type: Number,
      default: 1,
      min: 1,
    },
    availableUnits: {
      type: Number,
      default: 1,
      min: 0,
    },
    photos: [
      {
        type: String,
      },
    ],
    facilities: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ["available", "booked", "maintenance"],
      default: "available",
      index: true,
    },
  },
  { timestamps: true }
);

export const Room = mongoose.models.Room || mongoose.model("Room", roomSchema);
export default Room;

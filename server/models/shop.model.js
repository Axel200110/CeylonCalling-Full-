import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true 
    },
    activeTime: { 
      type: String, 
      trim: true 
    },
    description: { 
      type: String, 
      trim: true 
    },
    // Structured North Central Location Data (GeoJSON Point & address details)
    location: {
      province: {
        type: String,
        default: "North Central Province",
        trim: true,
      },
      district: {
        type: String,
        enum: ["Anuradhapura", "Polonnaruwa"],
        default: "Anuradhapura",
        index: true,
      },
      city: {
        type: String,
        trim: true,
        default: "Anuradhapura Town",
        index: true,
      },
      address: {
        type: String,
        trim: true,
        default: "",
      },
      coordinates: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          default: [80.4037, 8.3114],
        },
      },
    },
    // Backward compatibility for existing code paths
    addressDetails: {
      province: {
        type: String,
        default: "North Central Province",
        trim: true,
      },
      district: {
        type: String,
        default: "Anuradhapura",
      },
      city: {
        type: String,
        trim: true,
        default: "Anuradhapura Town",
      },
      streetAddress: {
        type: String,
        trim: true,
        default: "",
      },
      postalCode: {
        type: String,
        trim: true,
        default: "",
      },
      coordinates: {
        lat: { type: Number, default: 8.3114 },
        lng: { type: Number, default: 80.4037 },
      },
    },
    photo: { 
      type: String 
    },
    photos: [{
      type: String
    }],
    categories: [{
      type: String
    }],
    services: [{
      type: String
    }],
    businessDescription: {
      type: String,
      trim: true
    },
    priceRange: { 
      type: String, 
      trim: true 
    },
    shopType: { 
      type: String, 
      enum: ['restaurant', 'small_food_shop', 'hotel', 'villa', 'guesthouse'], 
      required: true 
    },
    // Business Operating Status
    operationalStatus: {
      type: String,
      enum: ['open', 'closed', 'temporarily_closed'],
      default: 'open',
      index: true
    },
    // Business Capabilities
    capabilities: {
      hasFood: { type: Boolean, default: true },
      hasAccommodation: { type: Boolean, default: false },
      hasOnlineOrdering: { type: Boolean, default: true },
      hasDineIn: { type: Boolean, default: true },
      hasTakeaway: { type: Boolean, default: true },
      hasDelivery: { type: Boolean, default: false },
      hasReservations: { type: Boolean, default: false },
      hasRoomBooking: { type: Boolean, default: false }
    },
    // Initial Accommodation Snapshot (during application/review)
    accommodationSnapshot: {
      totalUnits: { type: Number, default: 0 },
      startingPricePerNight: { type: Number, default: 0 },
      roomTypes: [{ type: String }],
      mainAmenities: [{ type: String }]
    },
    openingHours: {
      monday: { open: { type: String, default: "08:00" }, close: { type: String, default: "22:00" }, isOpen: { type: Boolean, default: true } },
      tuesday: { open: { type: String, default: "08:00" }, close: { type: String, default: "22:00" }, isOpen: { type: Boolean, default: true } },
      wednesday: { open: { type: String, default: "08:00" }, close: { type: String, default: "22:00" }, isOpen: { type: Boolean, default: true } },
      thursday: { open: { type: String, default: "08:00" }, close: { type: String, default: "22:00" }, isOpen: { type: Boolean, default: true } },
      friday: { open: { type: String, default: "08:00" }, close: { type: String, default: "22:00" }, isOpen: { type: Boolean, default: true } },
      saturday: { open: { type: String, default: "08:00" }, close: { type: String, default: "23:00" }, isOpen: { type: Boolean, default: true } },
      sunday: { open: { type: String, default: "08:00" }, close: { type: String, default: "23:00" }, isOpen: { type: Boolean, default: true } },
    },
    status: {
      type: String,
      enum: ['pending', 'under_review', 'changes_requested', 'approved', 'suspended', 'rejected', 'deactivated'],
      default: 'pending',
      index: true
    },
    // Administrator Review Notes & Feedback
    adminNotes: {
      internalNotes: { type: String, default: "" },
      feedbackForOwner: { type: String, default: "" },
      actionRequired: [{ type: String }],
      updatedAt: { type: Date }
    },
    contact: { 
      type: String, 
      required: true, 
      trim: true 
    },
    owner: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true,
      index: true
    },
    rejectionReason: {
      type: String,
      default: ""
    },
    verifiedAt: {
      type: Date
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    statusHistory: [
      {
        status: String,
        reason: String,
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        changedAt: { type: Date, default: Date.now }
      }
    ],
    reviews: [
      {
        name: String,
        rating: Number,
        comment: String,
      }
    ],
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "SiteUser"
    }],
    likeCount: {
      type: Number,
      default: 0
    },
    // Aggregate customer rating, recalculated by the review routes whenever a
    // review is added/removed. (Those routes were already writing to
    // shop.rating, but there was no schema field for it, so Mongoose's
    // strict mode silently dropped the value on every save.)
    rating: {
      type: Number,
      default: 5.0,
      min: 0,
      max: 5
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Geospatial 2dsphere index for location.coordinates ([longitude, latitude])
shopSchema.index({ "location.coordinates": "2dsphere" });
shopSchema.index({ status: 1, "location.district": 1, shopType: 1 });
shopSchema.index({ "location.city": 1, status: 1 });

shopSchema.index({ likes: 1 });
shopSchema.index({ status: 1, shopType: 1 });
shopSchema.index({ status: 1, "addressDetails.district": 1, shopType: 1 });
shopSchema.index({ "addressDetails.city": 1, status: 1 });

shopSchema.pre("save", function (next) {
  if (this.location) {
    // Normalize district
    if (this.location.district) {
      const lower = String(this.location.district).toLowerCase();
      this.location.district = lower.includes("polonnaruwa") ? "Polonnaruwa" : "Anuradhapura";
    }
    // Sync addressDetails for backward compatibility
    const coords = this.location.coordinates?.coordinates || [80.4037, 8.3114];
    const lng = Number(coords[0]) || 80.4037;
    const lat = Number(coords[1]) || 8.3114;
    this.addressDetails = {
      province: this.location.province || "North Central Province",
      district: this.location.district || "Anuradhapura",
      city: this.location.city || "Anuradhapura Town",
      streetAddress: this.location.address || "",
      postalCode: this.location.district === "Polonnaruwa" ? "51000" : "50000",
      coordinates: { lat, lng },
    };
  }
  next();
});

const Shop = mongoose.models.Shop || mongoose.model("Shop", shopSchema);
export default Shop;

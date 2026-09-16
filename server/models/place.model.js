import mongoose from "mongoose";

const placeSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100 
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  images: [{
    type: String,
  }],
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "SiteUser", 
    required: true 
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "PlaceCategory"
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "SiteUser"
  }],
  likeCount: {
    type: Number,
    default: 0
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  }
}, { 
  toJSON: { virtuals: true },
  toObject: { virtuals: true } 
});

// Add index for better performance on likes queries
placeSchema.index({ likes: 1 });

export default mongoose.model("Place", placeSchema);
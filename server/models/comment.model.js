import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    message: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "SiteUser", required: true },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true, index: true },
    status: {
      type: String,
      enum: ["visible", "flagged", "hidden"],
      default: "visible",
      index: true,
    },
    moderatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    moderationReason: {
      type: String,
      default: "",
    },
    moderatedAt: {
      type: Date,
    },
    // Shop Owner Response Field
    ownerReply: {
      message: { type: String, trim: true },
      repliedAt: { type: Date },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Comment || mongoose.model("Comment", commentSchema);

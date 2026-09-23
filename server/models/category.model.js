import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 50 },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
  },
  { timestamps: true }
);

categorySchema.index({ name: 1, shop: 1 }, { unique: true });

const Category = mongoose.model("Category", categorySchema);
export default Category;
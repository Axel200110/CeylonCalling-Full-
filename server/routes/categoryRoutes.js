import express from "express";
import Category from "../models/category.model.js";
import Shop from "../models/shop.model.js";
import { sessionAuth } from "../middlewares/sessionAuth.js";

const router = express.Router();

// PUBLIC: Get all categories for a specific shop
router.get("/shop/:shopId", async (req, res) => {
  try {
    const categories = await Category.find({ shop: req.params.shopId });
    res.json(categories);
  } catch (error) {
    res.status(500).json([]);
  }
});


// PUBLIC: Get all categories in the system
router.get("/all", async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    res.status(500).json([]);
  }
});

// PRIVATE: Get all categories for current user's shop
router.get("/my-shop", sessionAuth, async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.session.userId });
    if (!shop) return res.status(404).json([]);
    const categories = await Category.find({ shop: shop._id });
    res.json(categories);
  } catch (error) {
    res.status(500).json([]);
  }
});

// PRIVATE: Create category for current user's shop
router.post("/", sessionAuth, async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.session.userId });
    if (!shop) return res.status(403).json({ error: "No shop for user" });

    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Category name is required." });
    }
    const existing = await Category.findOne({ name: name.trim(), shop: shop._id });
    if (existing) return res.status(409).json({ error: "Category already exists." });

    const category = new Category({ name: name.trim(), shop: shop._id });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PRIVATE: Update category for current user's shop
router.put("/:id", sessionAuth, async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.session.userId });
    if (!shop) return res.status(403).json({ error: "No shop for user" });

    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Category name is required." });
    }

    const updated = await Category.findOneAndUpdate(
      { _id: req.params.id, shop: shop._id },
      { name: name.trim() },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Category not found." });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PRIVATE: Remove a category by ID
router.delete("/:id", sessionAuth, async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.session.userId });
    if (!shop) return res.status(403).json({ error: "No shop for user" });

    const deleted = await Category.findOneAndDelete({ _id: req.params.id, shop: shop._id });
    if (!deleted) return res.status(404).json({ error: "Category not found." });
    res.json({ message: "Category deleted." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
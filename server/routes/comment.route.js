import express from "express";
import { sessionAuth as userAuth } from "../middlewares/sessionAuth.js";
import { sessionAuth } from "../middlewares/siteUserAuth.js";
import Comment from "../models/comment.model.js";
import Shop from "../models/Shop.js";
const router = express.Router();

// PUBLIC: Get all comments for a specific shop
router.get("/shop/:shopId", async (req, res) => {
  try {
    const comments = await Comment.find({ shop: req.params.shopId })
      .populate("user", "email name");
    res.json(comments);
  } catch (error) {
    res.status(500).json([]);
  }
});

// PRIVATE: Get all comments made by the logged-in user
router.get("/my-comments", sessionAuth, async (req, res) => {
  try {
    const comments = await Comment.find({ user: req.session.siteuserId })
      .populate("shop", "name");
    res.json(comments);
  } catch (error) {
    res.status(500).json([]);
  }
});

// PRIVATE: Add a comment to a shop
router.post("/", sessionAuth, async (req, res) => {
  try {
    const { shopId, message, rating } = req.body;
    if (!message || !shopId || !rating) {
      return res.status(400).json({ error: "Message, rating, and shopId are required." });
    }
    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5." });
    }

    const shop = await Shop.findById(shopId);
    if (!shop) return res.status(404).json({ error: "Shop not found." });

    const comment = new Comment({
      message,
      rating,
      user: req.session.siteuserId,
      shop: shop._id,
    });

    await comment.save();
    await comment.populate("user", "email name");
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PRIVATE: Delete a comment only for the shop 
// PRIVATE: Only shop owners can delete comments on their shops
router.delete("/:id", userAuth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id).populate("shop");

    if (!comment) return res.status(404).json({ error: "Comment not found." });

    const shop = comment.shop;

    // Check if the current logged-in user is the owner of the shop
    if (String(shop.owner) !== String(req.session.userId)) {
      return res.status(403).json({ error: "Unauthorized to delete this comment." });
    }

    await Comment.findByIdAndDelete(comment._id);

    res.json({ message: "Comment deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// PRIVATE: Delete a comment made by the current user



export default router;
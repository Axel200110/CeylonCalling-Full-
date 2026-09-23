import express from "express";
import Comment from "../models/placecomm.model.js";

import Place from "../models/place.model.js";
import { sessionAuth } from "../middlewares/siteUserAuth.js";
const router = express.Router();

// PUBLIC: Get all comments for a specific place
router.get("/place/:placeId", async (req, res) => {
  try {
    const comments = await Comment.find({ place: req.params.placeId })
      .populate("user", "email name")
      .sort({ createdAt: -1 }); // Newest first
    res.json(comments);
  } catch (error) {
    res.status(500).json([]);
  }
});

// PRIVATE: Get all comments made by the logged-in user
router.get("/my-comments", sessionAuth, async (req, res) => {
  try {
    const comments = await Comment.find({ user: req.session.siteuserId })
      .populate("place", "name");
    res.json(comments);
  } catch (error) {
    res.status(500).json([]);
  }
});

router.post("/", sessionAuth, async (req, res) => {
  try {
    const { place, message, rating } = req.body; // Changed from placeId to place
    
    // Validation
    if (!message || !place || !rating) {
      return res.status(400).json({ error: "Message, rating, and place are required." });
    }
    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5." });
    }

    const placeExists = await Place.findById(place);
    if (!placeExists) {
      return res.status(404).json({ error: "Place not found." });
    }

    const comment = new Comment({
      message,
      rating,
      user: req.session.siteuserId,
      place,
    });

    await comment.save();
    await comment.populate("user", "email name");

    // Recalculate average rating for the place
    const allPlaceComments = await Comment.find({ place: placeExists._id });
    if (allPlaceComments.length > 0) {
      const avg = allPlaceComments.reduce((sum, c) => sum + (c.rating || 5), 0) / allPlaceComments.length;
      placeExists.rating = parseFloat(avg.toFixed(1));
      await placeExists.save();
    }

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// PRIVATE: Delete a comment made by the current user
router.delete("/:id", sessionAuth, async (req, res) => {
  try {
    const comment = await Comment.findOneAndDelete({
      _id: req.params.id,
      user: req.session.siteuserId,
    });

    if (!comment) return res.status(404).json({ error: "Comment not found." });

    // Recalculate average rating for the place
    const remainingComments = await Comment.find({ place: comment.place });
    const place = await Place.findById(comment.place);
    if (place) {
      if (remainingComments.length > 0) {
        const avg = remainingComments.reduce((sum, c) => sum + (c.rating || 5), 0) / remainingComments.length;
        place.rating = parseFloat(avg.toFixed(1));
      } else {
        place.rating = 4.5;
      }
      await place.save();
    }

    res.json({ message: "Comment deleted." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import Shop from "../models/Shop.js";
import { sessionAuth } from "../middlewares/sessionAuth.js";
import { sessionAuth as siteuser } from "../middlewares/siteUserAuth.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads/")),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// --- NEW PUBLIC ENDPOINT ---
router.get("/all", async (req, res) => {
  try {
    const shops = await Shop.find({ status: "approved" }).select("-owner -reviews"); // Exclude sensitive info if needed
    res.json({ shops });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch shops" });
  }
});

// GET: Get a single approved shop by ID (PUBLIC)
router.get("/:id", async (req, res) => {
  try {
    const shop = await Shop.findOne({ _id: req.params.id, status: "approved" }).select("-owner -reviews");
    if (!shop) {
      return res.status(404).json({ error: "Shop not found or not approved" });
    }
    res.json({ shop });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// GET: Get the current user's shop (PRIVATE)
router.get("/my-shop", sessionAuth, async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.session.userId });
    if (!shop) return res.status(404).json({ shop: null });
    res.json({ shop });
  } catch (error) {
    res.status(500).json({ shop: null });
  }
});

// POST: Create new shop (PRIVATE)
router.post("/", sessionAuth, upload.single("photo"), async (req, res) => {
  try {
    const shopData = req.body;
    shopData.owner = req.session.userId;
    if (req.file) {
      shopData.photo = `/uploads/${req.file.filename}`;
    }
    // Prevent duplicate shop per user (optional)
    const existingShop = await Shop.findOne({ owner: req.session.userId });
    if (existingShop) {
      return res.status(400).json({ error: "User already owns a shop." });
    }
    const newShop = new Shop(shopData);
    const savedShop = await newShop.save();
    res.status(201).json(savedShop);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT: Update shop by ID (PRIVATE)
router.put("/:id", sessionAuth, upload.single("photo"), async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) return res.status(404).json({ error: "Shop not found" });
    if (!shop.owner.equals(req.session.userId)) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    const updateData = req.body;
    if (req.file) {
      updateData.photo = `/uploads/${req.file.filename}`;
    }
    const updatedShop = await Shop.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });
    res.status(200).json(updatedShop);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE: Delete shop by ID (PRIVATE)
router.delete("/:id", sessionAuth, async (req, res) => {
  try {
    // Find the shop and verify ownership
    const shop = await Shop.findOne({
      _id: req.params.id,
      owner: req.session.userId
    });

    if (!shop) {
      return res.status(404).json({ 
        success: false,
        error: "Shop not found or not authorized" 
      });
    }

    // Delete the shop
    await Shop.findByIdAndDelete(req.params.id);

    // TODO: Add any additional cleanup here
    // For example: delete associated images, menu items, etc.

    res.json({ 
      success: true,
      message: "Shop deleted successfully" 
    });
  } catch (error) {
    console.error("Delete shop error:", error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});






















// GET: Get total likes count for a shop (public)
router.get("/:id/likes/count", async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id).select("likeCount");
    if (!shop) {
      return res.status(404).json({ success: false, error: "Shop not found" });
    }

    res.json({
      success: true,
      data: {
        likeCount: shop.likeCount,
      },
    });
  } catch (error) {
    console.error("Get likes count error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET: Get detailed likes list (only shop owner)
router.get("/:id/likes", sessionAuth, async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id)
      .populate({
        path: "likes",
        select: "username profilePicture",
        options: { limit: 20 },
      })
      .select("likes likeCount owner");

    if (!shop) {
      return res.status(404).json({ success: false, error: "Shop not found" });
    }

    // Authorization: only the shop owner can view the likes list
    if (!shop.owner.equals(req.session.userId)) {
      return res.status(403).json({ success: false, error: "Unauthorized" });
    }

    res.json({
      success: true,
      data: {
        likes: shop.likes,
        likeCount: shop.likeCount,
      },
    });
  } catch (error) {
    console.error("Get likes list error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

//Siteuser routes 
/// Like a shop for the siteuser - Updated version
router.post("/:id/like", siteuser, async (req, res) => {
  try {
    const place = await Shop.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ 
        success: false,
        error: "Place not found" 
      });
    }

    const userId = req.session.siteuserId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Not authenticated"
      });
    }

    const likeIndex = place.likes.findIndex(id => id.equals(userId));

    if (likeIndex === -1) {
      // Add like
      place.likes.push(userId);
      place.likeCount += 1;
    } else {
      // Remove like
      place.likes.pull(userId);
      place.likeCount = Math.max(0, place.likeCount - 1);
    }

    await place.save();

    res.json({ 
      success: true,
      data: {
        liked: likeIndex === -1,
        likeCount: place.likeCount,
        likes: place.likes // Return updated likes array
      }
    });
  } catch (error) {
    console.error("Like error:", error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Get likes for a shop for the siteuser - Updated version
router.get("/:id/likes", async (req, res) => {
  try {
    const place = await Shop.findById(req.params.id)
      .populate({
        path: "likes",
        select: "username profilePicture",
        options: { limit: 20 } // Limit for performance
      })
      .select("likes likeCount");

    if (!place) {
      return res.status(404).json({ 
        success: false,
        error: "Place not found" 
      });
    }

    res.json({ 
      success: true,
      data: {
        likes: place.likes,
        likeCount: place.likeCount
      }
    });
  } catch (error) {
    console.error("Get likes error:", error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});








export default router;
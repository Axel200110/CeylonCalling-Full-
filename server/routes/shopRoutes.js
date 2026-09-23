import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import Shop from "../models/shop.model.js";
import { Promotion } from "../models/promotion.model.js";
import { Announcement } from "../models/announcement.model.js";
import { Room } from "../models/room.model.js";
import FoodItem from "../models/food.model.js";
import Category from "../models/category.model.js";
import Comment from "../models/comment.model.js";
import { Warning } from "../models/warning.model.js";
import { sessionAuth } from "../middlewares/sessionAuth.js";
import { sessionAuth as siteuser } from "../middlewares/siteUserAuth.js";

import mongoose from "mongoose";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads/")),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Helper: Haversine distance in kilometers
const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in KM
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
};

// Business type priority:
// 1. restaurant / small_food_shop (priority 1)
// 2. hotel (priority 2)
// 3. villa (priority 3)
// 4. guesthouse (priority 4)
const getBusinessTypePriority = (shopType) => {
  const norm = String(shopType || "").toLowerCase();
  if (norm === "restaurant" || norm === "small_food_shop") return 1;
  if (norm === "hotel") return 2;
  if (norm === "villa") return 3;
  if (norm === "guesthouse") return 4;
  return 5;
};

// --- PUBLIC: List all approved shops with filtering and priority ---
router.get("/all", async (req, res) => {
  try {
    const { district, city, type, search, sort, lat, lng } = req.query;
    const query = { status: "approved" };

    // 1. District Filtering (Applies to ALL business types)
    if (district && district !== "all") {
      const normalizedDistrict = district.toLowerCase().includes("polonnaruwa")
        ? "Polonnaruwa"
        : "Anuradhapura";
      const districtRegex = new RegExp(`^${normalizedDistrict}$`, "i");

      query.$or = [
        { "location.district": districtRegex },
        { "addressDetails.district": districtRegex },
      ];
    }

    // 2. City Filtering
    if (city && city !== "all") {
      const cityRegex = new RegExp(city.trim(), "i");
      const cityCondition = [
        { "location.city": cityRegex },
        { "addressDetails.city": cityRegex },
      ];
      if (query.$or) {
        query.$and = [{ $or: query.$or }, { $or: cityCondition }];
        delete query.$or;
      } else {
        query.$or = cityCondition;
      }
    }

    // 3. Business Type Filtering
    if (type && type !== "all") {
      const normalizedType = type.toLowerCase();
      if (normalizedType === "restaurant") {
        query.shopType = { $in: ["restaurant", "small_food_shop"] };
      } else {
        query.shopType = normalizedType;
      }
    }

    // 4. Search Filter
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      const searchConditions = [
        { name: searchRegex },
        { "location.city": searchRegex },
        { "location.address": searchRegex },
        { "addressDetails.city": searchRegex },
        { "addressDetails.streetAddress": searchRegex },
        { description: searchRegex },
        { businessDescription: searchRegex },
        { categories: searchRegex },
      ];
      if (query.$and) {
        query.$and.push({ $or: searchConditions });
      } else if (query.$or) {
        query.$and = [{ $or: query.$or }, { $or: searchConditions }];
        delete query.$or;
      } else {
        query.$or = searchConditions;
      }
    }

    let shops = await Shop.find(query)
      .select("-owner -reviews -adminNotes -statusHistory -likes")
      .lean();

    // 5. Default Business Type Priority Ordering vs Custom Sorting
    shops.sort((a, b) => {
      // If customer requested sort by rating
      if (sort === "rating") {
        return (Number(b.rating) || 5.0) - (Number(a.rating) || 5.0);
      }

      // If customer requested sort by likes
      if (sort === "likes") {
        return (b.likeCount || 0) - (a.likeCount || 0);
      }

      // If customer requested alphabetical
      if (sort === "name_asc") {
        return (a.name || "").localeCompare(b.name || "");
      }
      if (sort === "name_desc") {
        return (b.name || "").localeCompare(a.name || "");
      }

      // DEFAULT: If no explicit shop type was selected, apply Business Type Priority:
      // Restaurants first, then Hotels, then Villas, then Guest Houses
      if (!type || type === "all") {
        const priorityA = getBusinessTypePriority(a.shopType);
        const priorityB = getBusinessTypePriority(b.shopType);
        if (priorityA !== priorityB) {
          return priorityA - priorityB;
        }
      }

      // Secondary default sort: higher rating, then newest
      const ratingDiff = (Number(b.rating) || 5.0) - (Number(a.rating) || 5.0);
      if (ratingDiff !== 0) return ratingDiff;

      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    const total = shops.length;

    // Optional server-side pagination if limit or page query param provided
    if (req.query.limit || req.query.page) {
      const pageNum = Math.max(1, parseInt(req.query.page, 10) || 1);
      const limitNum = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 12));
      const startIndex = (pageNum - 1) * limitNum;
      const paginatedShops = shops.slice(startIndex, startIndex + limitNum);

      return res.json({
        shops: paginatedShops,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum) || 1,
        },
      });
    }

    res.json({ shops, total });
  } catch (error) {
    console.error("GET /api/shops/all error:", error);
    res.status(500).json({ error: "Failed to fetch shops" });
  }
});


// --- PRIVATE: Get the logged-in owner's shop ---
router.get("/my-shop", sessionAuth, async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.session.userId });
    if (!shop) return res.status(404).json({ shop: null });
    res.json({ shop });
  } catch (error) {
    res.status(500).json({ shop: null });
  }
});

// --- PUBLIC: Active promotions & offers for a shop ---
router.get("/:id/promotions", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.json([]);
    const promotions = await Promotion.find({
      shop: req.params.id,
      isActive: true,
      endDate: { $gte: new Date() },
    }).sort({ createdAt: -1 });
    res.json(promotions);
  } catch (error) {
    res.status(500).json([]);
  }
});

// --- PUBLIC: Active announcements for a shop ---
router.get("/:id/announcements", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.json([]);
    const announcements = await Announcement.find({
      shop: req.params.id,
      isActive: true,
    }).sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json([]);
  }
});

// --- PUBLIC: Accommodation rooms for a hotel / villa / guest house ---
router.get("/:id/rooms", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.json([]);
    const rooms = await Room.find({
      shop: req.params.id,
      status: { $ne: "maintenance" },
    }).sort({ pricePerNight: 1 });
    res.json(rooms);
  } catch (error) {
    res.status(500).json([]);
  }
});

// --- PUBLIC: Get a single approved shop by ID ---
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ error: "Invalid shop ID" });
    }
    const shop = await Shop.findOne({ _id: req.params.id, status: "approved" }).select("-owner -reviews");
    if (!shop) {
      return res.status(404).json({ error: "Shop not found or not approved" });
    }
    res.json({ shop });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    const updateData = { ...req.body };

    // Mass-assignment protection: prevent tampering with admin/system protected fields
    const protectedFields = [
      "status",
      "owner",
      "verifiedBy",
      "verifiedAt",
      "rejectionReason",
      "statusHistory",
      "adminNotes",
      "likes",
      "likeCount",
      "rating",
    ];
    protectedFields.forEach((field) => delete updateData[field]);

    if (req.file) {
      updateData.photo = `/uploads/${req.file.filename}`;
    }

    // Process and normalize location fields if provided
    if (
      updateData.district ||
      updateData.city ||
      updateData.streetAddress ||
      updateData.address ||
      updateData.latitude !== undefined ||
      updateData.longitude !== undefined ||
      updateData.location
    ) {
      const existingLoc = shop.location || {};
      const targetDistrict =
        updateData.district ||
        updateData.location?.district ||
        existingLoc.district ||
        "Anuradhapura";
      const normDistrict = String(targetDistrict).toLowerCase().includes("polonnaruwa")
        ? "Polonnaruwa"
        : "Anuradhapura";

      const targetCity = String(
        updateData.city ||
          updateData.location?.city ||
          existingLoc.city ||
          (normDistrict === "Polonnaruwa" ? "Polonnaruwa Heritage City" : "Anuradhapura Town")
      ).trim();

      const targetAddress = String(
        updateData.address ||
          updateData.streetAddress ||
          updateData.location?.address ||
          existingLoc.address ||
          ""
      ).trim();

      let lng = existingLoc.coordinates?.coordinates?.[0] || (normDistrict === "Polonnaruwa" ? 81.0188 : 80.4037);
      let lat = existingLoc.coordinates?.coordinates?.[1] || (normDistrict === "Polonnaruwa" ? 7.9403 : 8.3114);

      if (updateData.longitude !== undefined && !isNaN(parseFloat(updateData.longitude))) {
        lng = parseFloat(updateData.longitude);
      } else if (updateData.location?.coordinates?.coordinates?.[0] !== undefined) {
        lng = parseFloat(updateData.location.coordinates.coordinates[0]);
      }

      if (updateData.latitude !== undefined && !isNaN(parseFloat(updateData.latitude))) {
        lat = parseFloat(updateData.latitude);
      } else if (updateData.location?.coordinates?.coordinates?.[1] !== undefined) {
        lat = parseFloat(updateData.location.coordinates.coordinates[1]);
      }

      updateData.location = {
        province: "North Central Province",
        district: normDistrict,
        city: targetCity,
        address: targetAddress,
        coordinates: {
          type: "Point",
          coordinates: [lng, lat],
        },
      };

      updateData.addressDetails = {
        province: "North Central Province",
        district: normDistrict,
        city: targetCity,
        streetAddress: targetAddress,
        postalCode: normDistrict === "Polonnaruwa" ? "51000" : "50000",
        coordinates: { lat, lng },
      };
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

    // Clean up records that only exist in relation to this shop (mirrors the
    // cleanup admin.controller.js's deleteShop already does, which this
    // owner-facing route was missing entirely).
    await Promise.all([
      FoodItem.deleteMany({ shop: req.params.id }),
      Category.deleteMany({ shop: req.params.id }),
      Comment.deleteMany({ shop: req.params.id }),
      Warning.deleteMany({ shop: req.params.id }),
      Room.deleteMany({ shop: req.params.id }),
      Promotion.deleteMany({ shop: req.params.id }),
      Announcement.deleteMany({ shop: req.params.id }),
    ]);

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
        select: "name avatar", // SiteUser has no "username"/"profilePicture" fields
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
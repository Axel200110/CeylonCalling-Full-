import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { sessionAuth } from "../middlewares/sessionAuth.js";
import { Promotion } from "../models/promotion.model.js";
import { Announcement } from "../models/announcement.model.js";
import { Room } from "../models/room.model.js";
import { RoomBooking } from "../models/booking.model.js";
import { Order } from "../models/order.model.js";
import Comment from "../models/comment.model.js";
import FoodItem from "../models/food.model.js";
import Category from "../models/category.model.js";
import Shop from "../models/shop.model.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads/")),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "room-" + uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per file
});
const uploadRoomPhotos = upload.array("photos", 5);

// Helper to check user owns the shop
const getOwnerShop = async (userId) => {
  return await Shop.findOne({ owner: userId });
};

// ==========================================
// 1. PROMOTIONS & OFFERS MANAGEMENT
// ==========================================

// GET: All promotions and offers for owner's shop
router.get("/promotions", sessionAuth, async (req, res) => {
  try {
    const shop = await getOwnerShop(req.session.userId);
    if (!shop) return res.status(403).json({ error: "No shop found for owner" });

    const promotions = await Promotion.find({ shop: shop._id }).sort({ createdAt: -1 });
    res.json(promotions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST: Create promotion / offer
router.post("/promotions", sessionAuth, async (req, res) => {
  try {
    const shop = await getOwnerShop(req.session.userId);
    if (!shop) return res.status(403).json({ error: "No shop found for owner" });

    const { title, description, type, discountType, discountValue, code, startDate, endDate, applicableCategory } = req.body;

    if (!title || !endDate) {
      return res.status(400).json({ error: "Title and End Date are required." });
    }

    const promotion = new Promotion({
      shop: shop._id,
      title: title.trim(),
      description: description ? description.trim() : "",
      type: type || "promotion",
      discountType: discountType || "percentage",
      discountValue: discountValue ? Number(discountValue) : 0,
      code: code ? code.trim() : "",
      startDate: startDate || new Date(),
      endDate: new Date(endDate),
      applicableCategory: applicableCategory || "All",
      isActive: true,
    });

    await promotion.save();
    res.status(201).json(promotion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT: Update promotion
router.put("/promotions/:id", sessionAuth, async (req, res) => {
  try {
    const shop = await getOwnerShop(req.session.userId);
    if (!shop) return res.status(403).json({ error: "No shop found for owner" });

    const updated = await Promotion.findOneAndUpdate(
      { _id: req.params.id, shop: shop._id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Promotion not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE: Remove promotion
router.delete("/promotions/:id", sessionAuth, async (req, res) => {
  try {
    const shop = await getOwnerShop(req.session.userId);
    if (!shop) return res.status(403).json({ error: "No shop found for owner" });

    const deleted = await Promotion.findOneAndDelete({ _id: req.params.id, shop: shop._id });
    if (!deleted) return res.status(404).json({ error: "Promotion not found" });
    res.json({ message: "Promotion removed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ==========================================
// 2. SHOP ANNOUNCEMENTS
// ==========================================

// GET: All announcements for owner's shop
router.get("/announcements", sessionAuth, async (req, res) => {
  try {
    const shop = await getOwnerShop(req.session.userId);
    if (!shop) return res.status(403).json({ error: "No shop found for owner" });

    const announcements = await Announcement.find({ shop: shop._id }).sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST: Create announcement
router.post("/announcements", sessionAuth, async (req, res) => {
  try {
    const shop = await getOwnerShop(req.session.userId);
    if (!shop) return res.status(403).json({ error: "No shop found for owner" });

    const { title, message, tag, startDate, endDate } = req.body;
    if (!title || !message) {
      return res.status(400).json({ error: "Title and message are required." });
    }

    const announcement = new Announcement({
      shop: shop._id,
      title: title.trim(),
      message: message.trim(),
      tag: tag || "general",
      startDate: startDate || new Date(),
      endDate: endDate ? new Date(endDate) : undefined,
      isActive: true,
    });

    await announcement.save();
    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE: Remove announcement
router.delete("/announcements/:id", sessionAuth, async (req, res) => {
  try {
    const shop = await getOwnerShop(req.session.userId);
    if (!shop) return res.status(403).json({ error: "No shop found for owner" });

    const deleted = await Announcement.findOneAndDelete({ _id: req.params.id, shop: shop._id });
    if (!deleted) return res.status(404).json({ error: "Announcement not found" });
    res.json({ message: "Announcement removed" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ==========================================
// 3. REVIEWS & OWNER REPLIES
// ==========================================

// GET: Reviews for owner's shop
router.get("/reviews", sessionAuth, async (req, res) => {
  try {
    const shop = await getOwnerShop(req.session.userId);
    if (!shop) return res.status(403).json({ error: "No shop found for owner" });

    const reviews = await Comment.find({ shop: shop._id })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST: Reply to customer review
router.post("/reviews/:id/reply", sessionAuth, async (req, res) => {
  try {
    const shop = await getOwnerShop(req.session.userId);
    if (!shop) return res.status(403).json({ error: "No shop found for owner" });

    const { replyMessage } = req.body;
    if (!replyMessage || !replyMessage.trim()) {
      return res.status(400).json({ error: "Reply message cannot be empty." });
    }

    const review = await Comment.findOne({ _id: req.params.id, shop: shop._id });
    if (!review) return res.status(404).json({ error: "Review not found on your shop" });

    review.ownerReply = {
      message: replyMessage.trim(),
      repliedAt: new Date(),
    };

    await review.save();
    res.json({ message: "Reply published successfully", review });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ==========================================
// 4. ROOMS / ACCOMMODATION (FOR HOTELS/VILLAS/GUEST HOUSES)
// ==========================================

// Helper: Synchronize shop accommodation snapshot
const syncShopAccommodationSnapshot = async (shopId) => {
  try {
    const allRooms = await Room.find({ shop: shopId });
    const totalUnits = allRooms.reduce((acc, r) => acc + (Number(r.totalUnits) || 1), 0);
    const prices = allRooms.map((r) => Number(r.pricePerNight)).filter((p) => p > 0);
    const startingPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const roomTypes = [...new Set(allRooms.map((r) => r.roomType).filter(Boolean))];

    await Shop.findByIdAndUpdate(shopId, {
      "capabilities.hasAccommodation": allRooms.length > 0,
      accommodationSnapshot: {
        totalUnits,
        startingPricePerNight: startingPrice,
        roomTypes,
      },
    });
  } catch (err) {
    console.error("Failed to sync shop accommodation snapshot:", err);
  }
};

// GET: All rooms for owner's shop
router.get("/rooms", sessionAuth, async (req, res) => {
  try {
    const shop = await getOwnerShop(req.session.userId);
    if (!shop) return res.status(403).json({ error: "No shop found for owner" });

    const rooms = await Room.find({ shop: shop._id }).sort({ createdAt: -1 });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST: Add room with up to 5 photos
router.post("/rooms", sessionAuth, uploadRoomPhotos, async (req, res) => {
  try {
    const shop = await getOwnerShop(req.session.userId);
    if (!shop) return res.status(403).json({ error: "No shop found for owner" });

    const {
      name,
      roomType,
      description,
      pricePerNight,
      capacityGuests,
      bedType,
      facilities: rawFacilities,
      status,
      totalUnits,
      availableUnits,
      existingPhotos: rawExisting,
    } = req.body;

    if (!name || !pricePerNight) {
      return res.status(400).json({ error: "Room name and Price per night are required." });
    }

    // Parse facilities
    let parsedFacilities = [];
    if (rawFacilities) {
      if (Array.isArray(rawFacilities)) {
        parsedFacilities = rawFacilities.map((f) => String(f).trim()).filter(Boolean);
      } else if (typeof rawFacilities === "string") {
        try {
          const parsed = JSON.parse(rawFacilities);
          parsedFacilities = Array.isArray(parsed)
            ? parsed.map((f) => String(f).trim()).filter(Boolean)
            : rawFacilities.split(",").map((f) => f.trim()).filter(Boolean);
        } catch {
          parsedFacilities = rawFacilities.split(",").map((f) => f.trim()).filter(Boolean);
        }
      }
    }

    // Collect uploaded photos (up to 5)
    let uploadedPhotos = [];
    if (req.files && req.files.length > 0) {
      uploadedPhotos = req.files.map((file) => `/uploads/${file.filename}`);
    }

    // Combine with any existing photos
    let existingPhotos = [];
    if (rawExisting) {
      try {
        existingPhotos = Array.isArray(rawExisting) ? rawExisting : JSON.parse(rawExisting);
      } catch {
        existingPhotos = [rawExisting];
      }
    }

    const finalPhotos = [...existingPhotos, ...uploadedPhotos].slice(0, 5);

    const totalCount = Number(totalUnits) > 0 ? Number(totalUnits) : 1;
    const availCount = availableUnits !== undefined && availableUnits !== ""
      ? Math.max(0, Math.min(Number(availableUnits), totalCount))
      : status === "booked" ? 0 : totalCount;

    const initialStatus = status || (availCount === 0 ? "booked" : "available");

    const room = new Room({
      shop: shop._id,
      name: name.trim(),
      roomType: roomType || "Double",
      description: description ? description.trim() : "",
      pricePerNight: Number(pricePerNight),
      capacityGuests: capacityGuests ? Number(capacityGuests) : 2,
      bedType: bedType || "1 Queen Bed",
      totalUnits: totalCount,
      availableUnits: availCount,
      facilities: parsedFacilities,
      photos: finalPhotos,
      status: initialStatus,
    });

    await room.save();
    await syncShopAccommodationSnapshot(shop._id);

    res.status(201).json(room);
  } catch (error) {
    console.error("Add room error:", error);
    res.status(500).json({ error: error.message });
  }
});

// PUT: Update room details, photos, and availability
router.put("/rooms/:id", sessionAuth, uploadRoomPhotos, async (req, res) => {
  try {
    const shop = await getOwnerShop(req.session.userId);
    if (!shop) return res.status(403).json({ error: "No shop found for owner" });

    const room = await Room.findOne({ _id: req.params.id, shop: shop._id });
    if (!room) return res.status(404).json({ error: "Room not found" });

    const {
      name,
      roomType,
      description,
      pricePerNight,
      capacityGuests,
      bedType,
      facilities: rawFacilities,
      status,
      totalUnits,
      availableUnits,
      existingPhotos: rawExisting,
    } = req.body;

    if (name) room.name = name.trim();
    if (roomType) room.roomType = roomType;
    if (description !== undefined) room.description = description.trim();
    if (pricePerNight !== undefined) room.pricePerNight = Number(pricePerNight);
    if (capacityGuests !== undefined) room.capacityGuests = Number(capacityGuests);
    if (bedType !== undefined) room.bedType = bedType.trim();

    if (totalUnits !== undefined) {
      room.totalUnits = Math.max(1, Number(totalUnits));
    }

    if (availableUnits !== undefined) {
      room.availableUnits = Math.max(0, Math.min(Number(availableUnits), room.totalUnits));
    }

    if (status) {
      room.status = status;
      if (status === "booked") {
        room.availableUnits = 0;
      } else if (status === "available" && room.availableUnits === 0) {
        room.availableUnits = room.totalUnits;
      }
    }

    // Facilities parsing
    if (rawFacilities !== undefined) {
      if (Array.isArray(rawFacilities)) {
        room.facilities = rawFacilities.map((f) => String(f).trim()).filter(Boolean);
      } else if (typeof rawFacilities === "string") {
        try {
          const parsed = JSON.parse(rawFacilities);
          room.facilities = Array.isArray(parsed)
            ? parsed.map((f) => String(f).trim()).filter(Boolean)
            : rawFacilities.split(",").map((f) => f.trim()).filter(Boolean);
        } catch {
          room.facilities = rawFacilities.split(",").map((f) => f.trim()).filter(Boolean);
        }
      }
    }

    // Photos management (retain existing, append new, max 5)
    let retainedPhotos = room.photos || [];
    if (rawExisting !== undefined) {
      try {
        retainedPhotos = Array.isArray(rawExisting) ? rawExisting : JSON.parse(rawExisting);
      } catch {
        retainedPhotos = typeof rawExisting === "string" && rawExisting ? [rawExisting] : [];
      }
    }

    let newUploadedPhotos = [];
    if (req.files && req.files.length > 0) {
      newUploadedPhotos = req.files.map((file) => `/uploads/${file.filename}`);
    }

    room.photos = [...retainedPhotos, ...newUploadedPhotos].slice(0, 5);

    await room.save();
    await syncShopAccommodationSnapshot(shop._id);

    res.json(room);
  } catch (error) {
    console.error("Update room error:", error);
    res.status(500).json({ error: error.message });
  }
});

// PATCH: Quick availability status toggle
router.patch("/rooms/:id/availability", sessionAuth, async (req, res) => {
  try {
    const shop = await getOwnerShop(req.session.userId);
    if (!shop) return res.status(403).json({ error: "No shop found for owner" });

    const { status, availableUnits } = req.body;
    const validStatuses = ["available", "booked", "maintenance"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid room status" });
    }

    const room = await Room.findOne({ _id: req.params.id, shop: shop._id });
    if (!room) return res.status(404).json({ error: "Room not found" });

    if (status) {
      room.status = status;
      if (status === "booked") room.availableUnits = 0;
      if (status === "available" && room.availableUnits === 0) room.availableUnits = room.totalUnits;
    }

    if (availableUnits !== undefined) {
      room.availableUnits = Math.max(0, Math.min(Number(availableUnits), room.totalUnits));
      if (room.availableUnits === 0 && room.status === "available") {
        room.status = "booked";
      } else if (room.availableUnits > 0 && room.status === "booked") {
        room.status = "available";
      }
    }

    await room.save();
    await syncShopAccommodationSnapshot(shop._id);

    res.json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE: Remove room
router.delete("/rooms/:id", sessionAuth, async (req, res) => {
  try {
    const shop = await getOwnerShop(req.session.userId);
    if (!shop) return res.status(403).json({ error: "No shop found for owner" });

    const deleted = await Room.findOneAndDelete({ _id: req.params.id, shop: shop._id });
    if (!deleted) return res.status(404).json({ error: "Room not found" });

    await syncShopAccommodationSnapshot(shop._id);
    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});





// ==========================================
// 6. SHOP CAPABILITIES & OPERATING STATUS
// ==========================================

// PUT: Update operational status & opening hours & capabilities
router.put("/settings/operational", sessionAuth, async (req, res) => {
  try {
    const shop = await getOwnerShop(req.session.userId);
    if (!shop) return res.status(403).json({ error: "No shop found for owner" });

    const { operationalStatus, capabilities, openingHours } = req.body;

    if (operationalStatus) shop.operationalStatus = operationalStatus;
    if (capabilities) shop.capabilities = { ...shop.capabilities, ...capabilities };
    if (openingHours) shop.openingHours = { ...shop.openingHours, ...openingHours };

    await shop.save();
    res.json({ message: "Business operational settings saved", shop });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT: Update physical business location (District, City, Address, Coordinates)
router.put("/location", sessionAuth, async (req, res) => {
  try {
    const shop = await getOwnerShop(req.session.userId);
    if (!shop) return res.status(403).json({ error: "No shop found for owner" });

    const { district, city, address, streetAddress, latitude, longitude } = req.body;

    if (!district || !city) {
      return res.status(400).json({ error: "District and Town/City are required." });
    }

    const normDistrict = String(district).toLowerCase().includes("polonnaruwa")
      ? "Polonnaruwa"
      : "Anuradhapura";

    const cleanCity = String(city).trim();
    if (!cleanCity) {
      return res.status(400).json({ error: "Please provide a valid town or city name." });
    }

    const cleanAddress = String(address || streetAddress || "").trim();

    let lat = parseFloat(latitude);
    let lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      if (normDistrict === "Polonnaruwa") {
        lat = 7.9403;
        lng = 81.0188;
      } else {
        lat = 8.3114;
        lng = 80.4037;
      }
    }

    shop.location = {
      province: "North Central Province",
      district: normDistrict,
      city: cleanCity,
      address: cleanAddress,
      coordinates: {
        type: "Point",
        coordinates: [lng, lat],
      },
    };

    shop.addressDetails = {
      province: "North Central Province",
      district: normDistrict,
      city: cleanCity,
      streetAddress: cleanAddress,
      postalCode: normDistrict === "Polonnaruwa" ? "51000" : "50000",
      coordinates: { lat, lng },
    };

    await shop.save();

    res.json({
      success: true,
      message: "Business location updated successfully",
      location: shop.location,
      addressDetails: shop.addressDetails,
    });
  } catch (error) {
    console.error("Update shop location error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 7. REAL DASHBOARD BUSINESS METRICS (AGGREGATED FROM DB)
// ==========================================
router.get("/dashboard-stats", sessionAuth, async (req, res) => {
  try {
    const shop = await getOwnerShop(req.session.userId);
    if (!shop) return res.status(403).json({ error: "No shop found for owner" });

    // 1. Food catalog stats
    const totalFoods = await FoodItem.countDocuments({ shop: shop._id });
    const availableFoods = await FoodItem.countDocuments({ shop: shop._id, availability: "available" });
    const soldOutFoods = await FoodItem.countDocuments({ shop: shop._id, availability: "sold_out" });
    const totalCategories = await Category.countDocuments({ shop: shop._id });

    // 2. Promotions & Announcements
    const activePromotions = await Promotion.countDocuments({ shop: shop._id, isActive: true, endDate: { $gte: new Date() } });
    const activeAnnouncements = await Announcement.countDocuments({ shop: shop._id, isActive: true });

    // 3. Reviews & Ratings
    const comments = await Comment.find({ shop: shop._id }).select("rating message createdAt ownerReply");
    const totalReviews = comments.length;
    const avgRating = totalReviews > 0
      ? (comments.reduce((acc, c) => acc + (c.rating || 5), 0) / totalReviews).toFixed(1)
      : "5.0";
    const unrepliedReviewsCount = comments.filter((c) => !c.ownerReply || !c.ownerReply.message).length;

    // 4. Orders stats
    const totalOrders = await Order.countDocuments({ shop: shop._id });
    const pendingOrders = await Order.countDocuments({ shop: shop._id, status: "pending" });
    const preparingOrders = await Order.countDocuments({ shop: shop._id, status: { $in: ["confirmed", "preparing", "ready"] } });
    const completedOrders = await Order.countDocuments({ shop: shop._id, status: "completed" });

    const completedOrdersList = await Order.find({ shop: shop._id, status: "completed" }).select("totalAmount");
    const totalRevenue = completedOrdersList.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    // 5. Accommodation stats (if applicable)
    const isAccommodation = shop.capabilities?.hasAccommodation || ["hotel", "villa", "guesthouse"].includes(shop.shopType);
    let roomStats = null;

    if (isAccommodation) {
      const totalRooms = await Room.countDocuments({ shop: shop._id });
      const availableRooms = await Room.countDocuments({ shop: shop._id, status: "available" });
      const totalBookings = await RoomBooking.countDocuments({ shop: shop._id });
      const pendingBookings = await RoomBooking.countDocuments({ shop: shop._id, status: "pending" });
      const activeStays = await RoomBooking.countDocuments({ shop: shop._id, status: { $in: ["confirmed", "checked_in"] } });

      roomStats = {
        totalRooms,
        availableRooms,
        totalBookings,
        pendingBookings,
        activeStays,
      };
    }

    // 6. Recent activity
    const recentOrders = await Order.find({ shop: shop._id }).sort({ createdAt: -1 }).limit(5);
    const recentReviews = await Comment.find({ shop: shop._id }).populate("user", "name email").sort({ createdAt: -1 }).limit(5);

    res.json({
      shop: {
        _id: shop._id,
        name: shop.name,
        shopType: shop.shopType,
        photo: shop.photo,
        location: shop.location,
        contact: shop.contact,
        operationalStatus: shop.operationalStatus || "open",
        capabilities: shop.capabilities,
        likeCount: shop.likeCount || 0,
      },
      food: {
        total: totalFoods,
        available: availableFoods,
        soldOut: soldOutFoods,
        categoriesCount: totalCategories,
      },
      promotions: {
        active: activePromotions,
      },
      announcements: {
        active: activeAnnouncements,
      },
      reviews: {
        total: totalReviews,
        avgRating: Number(avgRating),
        unrepliedCount: unrepliedReviewsCount,
      },
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        preparing: preparingOrders,
        completed: completedOrders,
        revenue: totalRevenue,
      },
      accommodation: roomStats,
      recentOrders,
      recentReviews,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ error: error.message });
  }
});


// ==========================================
// 8. ACCOMMODATION BOOKINGS MANAGEMENT
// ==========================================

// GET: All bookings for owner's shop
router.get("/bookings", sessionAuth, async (req, res) => {
  try {
    const shop = await getOwnerShop(req.session.userId);
    if (!shop) return res.status(403).json({ error: "No shop found for owner" });

    const bookings = await RoomBooking.find({ shop: shop._id })
      .populate("room", "name roomType pricePerNight photos")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT: Update booking status (pending -> confirmed -> checked_in -> completed / cancelled)
router.put("/bookings/:id/status", sessionAuth, async (req, res) => {
  try {
    const shop = await getOwnerShop(req.session.userId);
    if (!shop) return res.status(403).json({ error: "No shop found for owner" });

    const { status } = req.body;
    const validStatuses = ["pending", "confirmed", "checked_in", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid booking status" });
    }

    const booking = await RoomBooking.findOneAndUpdate(
      { _id: req.params.id, shop: shop._id },
      { status },
      { new: true }
    ).populate("room", "name roomType pricePerNight");

    if (!booking) return res.status(404).json({ error: "Booking not found" });

    res.json({ message: `Booking status updated to ${status}`, booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 9. SHOP OWNER ORDER QUEUE MANAGEMENT
// ==========================================

// Valid state transitions for order fulfillment
const VALID_ORDER_TRANSITIONS = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["preparing", "cancelled"],
  preparing: ["ready", "cancelled"],
  ready: ["completed", "cancelled"],
  completed: [], // Terminal state
  cancelled: [], // Terminal state
};

// GET: Orders belonging strictly to the owner's shop
router.get("/orders", sessionAuth, async (req, res) => {
  try {
    const shop = await getOwnerShop(req.session.userId);
    if (!shop) return res.status(403).json({ error: "No shop found for owner." });

    const { status, page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const query = { shop: shop._id };
    if (status && status !== "all") {
      query.status = status;
    }

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate("customer", "name email phone")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Order.countDocuments(query),
    ]);

    // Enhance response with guest vs authenticated indicators
    const formattedOrders = orders.map((o) => ({
      ...o,
      isGuest: !o.customer,
      displayName: o.customer?.name || o.customerName || "Guest Customer",
      customerContact: o.customer?.phone || o.customerContact,
    }));

    res.json({
      orders: formattedOrders,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error) {
    console.error("Fetch owner orders error:", error);
    res.status(500).json({ error: "Failed to retrieve order queue." });
  }
});

// PUT: Advance or cancel order status with state machine enforcement
router.put("/orders/:id/status", sessionAuth, async (req, res) => {
  try {
    const shop = await getOwnerShop(req.session.userId);
    if (!shop) return res.status(403).json({ error: "No shop found for owner." });

    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: "New status is required." });
    }

    // Anti-IDOR: Find order matching ID AND owner's shop
    const order = await Order.findOne({ _id: req.params.id, shop: shop._id });
    if (!order) {
      return res.status(404).json({ error: "Order not found in your business queue." });
    }

    const currentStatus = order.status;
    const allowedNext = VALID_ORDER_TRANSITIONS[currentStatus] || [];

    if (!allowedNext.includes(status)) {
      return res.status(400).json({
        error: `Cannot transition order status from '${currentStatus}' to '${status}'. Allowed transitions: ${
          allowedNext.length > 0 ? allowedNext.join(", ") : "none (order is finalized)"
        }.`,
      });
    }

    order.status = status;
    await order.save();

    res.json({
      success: true,
      message: `Order ${order.orderReference} updated to ${status.toUpperCase()}.`,
      order,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ error: "Failed to update order status." });
  }
});

export default router;


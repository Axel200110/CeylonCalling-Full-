import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcryptjs from "bcryptjs";
import mongoose from "mongoose";

import FoodItem from "../models/food.model.js";
import Category from "../models/category.model.js";
import Comment from "../models/comment.model.js";
import { Log } from "../models/log.model.js";
import { AuditLog } from "../models/auditLog.model.js";
import { Warning } from "../models/warning.model.js";
import Place from "../models/place.model.js";
import PlaceComment from "../models/placecomm.model.js";
import { Settings } from "../models/settings.model.js";
import Shop from "../models/shop.model.js";
import { Room } from "../models/room.model.js";
import { Promotion } from "../models/promotion.model.js";
import { Announcement } from "../models/announcement.model.js";
import { SiteUser } from "../models/siteUser.model.js";
import { User } from "../models/user.model.js";
import Message from "../models/message.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BACKUPS_DIR = path.join(__dirname, "../backups");

if (!fs.existsSync(BACKUPS_DIR)) {
  fs.mkdirSync(BACKUPS_DIR, { recursive: true });
}

const recordAuditLog = async ({ req, action, targetType, targetId = null, targetName = "", description, reason = "", metadata = {} }) => {
  try {
    const admin = req.user || (req.session?.userId ? await User.findById(req.session.userId) : null);
    await AuditLog.create({
      admin: admin?._id || null,
      adminEmail: admin?.email || "system",
      action,
      targetType,
      targetId: targetId ? String(targetId) : null,
      targetName,
      description,
      reason,
      metadata,
      ipAddress: req.ip || req.connection?.remoteAddress || "",
      userAgent: req.headers["user-agent"] || "",
    });

    await Log.create({
      text: description,
      type: targetType === "auth" ? "security" : (targetType === "shop" ? "shop" : "system"),
    });
  } catch (err) {
    console.error("Failed to write audit log:", err);
  }
};

// ============================
// ADMIN AUTH CONTROLLERS
// ============================

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    // Seed default admin if requested credentials match and no admin exists
    let admin = await User.findOne({ email: "admin@ceyloncalling.com" });
    if (!admin && email === "admin@ceyloncalling.com") {
      const hashedPassword = await bcryptjs.hash("admin123", 10);
      admin = await User.create({
        email: "admin@ceyloncalling.com",
        password: hashedPassword,
        name: "System Admin",
        role: "admin",
        isVerified: true
      });
    }

    const user = await User.findOne({ email });
    if (!user || user.role !== "admin") {
      return res.status(401).json({ success: false, message: "Invalid administrator credentials" });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid administrator credentials" });
    }

    // Establish express-session
    req.session.userId = user._id;
    req.session.isVerified = user.isVerified;
    await new Promise((resolve, reject) => req.session.save(err => err ? reject(err) : resolve()));

    // Create security audit log
    await Log.create({
      text: `Admin logged in from IP ${req.ip}`,
      type: "security"
    });

    res.status(200).json({
      success: true,
      message: "Admin authenticated successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ success: false, message: "Logout failed" });
    res.clearCookie("connect.sid", { path: "/", httpOnly: true, sameSite: "lax" });
    res.status(200).json({ success: true, message: "Logged out successfully" });
  });
};

export const checkAuth = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    const user = await User.findById(req.session.userId).select("-password");
    if (!user || user.role !== "admin") {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Current and new passwords are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(req.user._id);
    const isMatch = await bcryptjs.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Current password does not match" });
    }

    user.password = await bcryptjs.hash(newPassword, 10);
    await user.save();

    await recordAuditLog({
      req,
      action: "ADMIN_PASSWORD_CHANGED",
      targetType: "auth",
      targetId: user._id,
      targetName: user.name,
      description: "Admin password updated securely",
    });

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================
// DASHBOARD & REAL ANALYTICS
// ============================

export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalShops,
      pendingShops,
      approvedShops,
      suspendedShops,
      rejectedShops,
      totalPlaces,
      totalComments,
      totalPlaceComments,
      warningsCount,
    ] = await Promise.all([
      SiteUser.countDocuments(),
      Shop.countDocuments(),
      Shop.countDocuments({ status: "pending" }),
      Shop.countDocuments({ status: "approved" }),
      Shop.countDocuments({ status: "suspended" }),
      Shop.countDocuments({ status: "rejected" }),
      Place.countDocuments(),
      Comment.countDocuments(),
      PlaceComment.countDocuments(),
      Warning.countDocuments({ status: "open" }),
    ]);

    const shopTypeBreakdown = await Shop.aggregate([
      { $group: { _id: "$shopType", count: { $sum: 1 } } },
    ]);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const userGrowthAgg = await SiteUser.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const monthlyLabels = [];
    const monthlyData = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mName = monthNames[d.getMonth()];
      monthlyLabels.push(mName);
      const found = userGrowthAgg.find((g) => g._id.month === d.getMonth() + 1 && g._id.year === d.getFullYear());
      monthlyData.push(found ? found.count : 0);
    }

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalShops,
        pendingShops,
        approvedShops,
        suspendedShops,
        rejectedShops,
        totalPlaces,
        totalReviews: totalComments + totalPlaceComments,
        openWarnings: warningsCount,
        shopTypeBreakdown,
        monthlyRegistrations: {
          categories: monthlyLabels,
          data: monthlyData,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================
// SHOPS MANAGEMENT
// ============================

export const getShops = async (req, res) => {
  try {
    const { status, type, search, district, city } = req.query;
    const query = {};

    if (status && status !== "all") {
      query.status = status;
    }
    if (type && type !== "all") {
      query.shopType = type;
    }
    if (district && district !== "all") {
      const districtRegex = new RegExp(`^${district}$`, "i");
      query.$or = [
        { "location.district": districtRegex },
        { "addressDetails.district": districtRegex },
      ];
    }
    if (city && city !== "all") {
      query["location.city"] = new RegExp(city, "i");
    }
    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { name: searchRegex },
        { "location.address": searchRegex },
        { "location.city": searchRegex },
        { "location.district": searchRegex },
        { "addressDetails.city": searchRegex },
        { "addressDetails.district": searchRegex },
        { contact: searchRegex },
      ];
    }

    const shops = await Shop.find(query).populate("owner", "name email contact").sort({ createdAt: -1 });

    const formattedShops = shops.map((shop) => {
      const photosArray = shop.photos && shop.photos.length > 0 ? shop.photos : shop.photo ? [shop.photo] : [];
      const districtDisplay = shop.location?.district || shop.addressDetails?.district || (typeof shop.location === "string" && shop.location.toLowerCase().includes("polonnaruwa") ? "Polonnaruwa" : "Anuradhapura");
      const cityDisplay = shop.location?.city || shop.addressDetails?.city || (typeof shop.location === "string" ? shop.location : "Anuradhapura Town");
      const addressDisplay = shop.location?.address || shop.addressDetails?.streetAddress || "";

      const rawCoords = shop.location?.coordinates?.coordinates;
      let lng = Array.isArray(rawCoords) && Number.isFinite(rawCoords[0]) ? Number(rawCoords[0]) : null;
      let lat = Array.isArray(rawCoords) && Number.isFinite(rawCoords[1]) ? Number(rawCoords[1]) : null;

      if (lat === null || lng === null) {
        if (shop.addressDetails?.coordinates?.lat && shop.addressDetails?.coordinates?.lng) {
          lat = Number(shop.addressDetails.coordinates.lat);
          lng = Number(shop.addressDetails.coordinates.lng);
        }
      }

      const hasCoordinates = Number.isFinite(lat) && Number.isFinite(lng);
      const googleMapsUrl = hasCoordinates ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}` : null;

      return {
        id: shop._id,
        name: shop.name,
        businessName: shop.name,
        ownerName: shop.owner ? shop.owner.name : "N/A",
        email: shop.owner ? shop.owner.email : "N/A",
        ownerId: shop.owner ? shop.owner._id : null,
        phone: shop.contact || "",
        contact: shop.contact || "",
        category: shop.shopType,
        establishmentType: shop.shopType,
        categories: shop.categories || [],
        services: shop.services || [],
        description: shop.description || shop.businessDescription || "",
        businessDescription: shop.businessDescription || shop.description || "",
        priceRange: shop.priceRange || "",
        activeTime: shop.activeTime || "",
        status: shop.status,
        rating: shop.rating || 5.0,
        image:
          shop.photo ||
          (photosArray.length > 0 ? photosArray[0] : "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&auto=format&fit=crop&q=60"),
        photos: photosArray,
        location: shop.location,
        locationDisplay: `${cityDisplay}, ${districtDisplay}`,
        district: districtDisplay,
        city: cityDisplay,
        address: addressDisplay,
        latitude: lat,
        longitude: lng,
        hasCoordinates,
        googleMapsUrl,
        addressDetails: shop.addressDetails || {
          province: "North Central Province",
          district: districtDisplay,
          city: cityDisplay,
          streetAddress: addressDisplay,
          coordinates: { lat, lng },
        },
        capabilities: shop.capabilities || {
          hasFood: true,
          hasAccommodation: ["hotel", "villa", "guesthouse"].includes(shop.shopType)
        },
        accommodationSnapshot: shop.accommodationSnapshot || {},
        adminNotes: shop.adminNotes || {},
        rejectionReason: shop.rejectionReason || "",
        statusHistory: shop.statusHistory || [],
        createdAt: shop.createdAt,
      };
    });

    res.status(200).json({ success: true, shops: formattedShops });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getShopDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const shop = await Shop.findById(id).populate("owner", "name email role isVerified createdAt");
    if (!shop) {
      return res.status(404).json({ success: false, message: "Shop not found" });
    }

    const [foodItems, categories, comments, warnings, rooms] = await Promise.all([
      FoodItem.find({ shop: id }).populate("category", "name"),
      Category.find({ shop: id }),
      Comment.find({ shop: id }).populate("user", "name email").sort({ createdAt: -1 }),
      Warning.find({ shop: id }).populate("issuedBy", "name email").sort({ createdAt: -1 }),
      Room.find({ shop: id }).sort({ createdAt: -1 }),
    ]);

    res.status(200).json({
      success: true,
      shop,
      foodItems,
      categories,
      reviews: comments,
      warnings,
      rooms: rooms || [],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createShop = async (req, res) => {
  try {
    const {
      businessName,
      name,
      ownerName,
      email,
      phone,
      contact,
      location,
      district,
      establishmentType,
      shopType,
      businessDescription,
      description,
      status,
      categories: rawCategories,
      services: rawServices,
    } = req.body;

    const finalName = businessName || name;
    const finalPhone = phone || contact;
    const finalLocation = location || district || "Anuradhapura";
    const finalShopType = establishmentType || shopType || "restaurant";
    const finalDesc = businessDescription || description || "";

    if (!finalName || !finalPhone || !email) {
      return res.status(400).json({ success: false, message: "Business name, owner email, and contact phone are required." });
    }

    let user = await User.findOne({ email });
    if (!user) {
      const hashedPassword = await bcryptjs.hash("Partner@123", 10);
      user = await User.create({
        email,
        password: hashedPassword,
        name: ownerName || finalName,
        isVerified: true,
        role: "partner",
      });
    } else {
      if (ownerName) user.name = ownerName;
      if (user.role !== "admin") user.role = "partner";
      user.isVerified = true;
      await user.save();
    }

    let uploadedPhotos = [];
    if (req.files && req.files.length > 0) {
      uploadedPhotos = req.files.map((file) => `/uploads/${file.filename}`);
    }
    const primaryPhoto = uploadedPhotos.length > 0 ? uploadedPhotos[0] : "";

    let parsedCategories = [];
    if (rawCategories) {
      try {
        parsedCategories = typeof rawCategories === "string" ? JSON.parse(rawCategories) : rawCategories;
      } catch (e) {
        parsedCategories = Array.isArray(rawCategories) ? rawCategories : [rawCategories];
      }
    }

    let parsedServices = [];
    if (rawServices) {
      try {
        parsedServices = typeof rawServices === "string" ? JSON.parse(rawServices) : rawServices;
      } catch (e) {
        parsedServices = Array.isArray(rawServices) ? rawServices : [rawServices];
      }
    }

    const targetDistrict = String(district || location || "Anuradhapura").toLowerCase().includes("polonnaruwa")
      ? "Polonnaruwa"
      : "Anuradhapura";
    const targetCity = String(req.body.city || "").trim() || (targetDistrict === "Polonnaruwa" ? "Polonnaruwa Heritage City" : "Anuradhapura Town");
    const targetAddress = String(req.body.address || req.body.streetAddress || "").trim();

    const inputLat = Number(req.body.latitude !== undefined ? req.body.latitude : req.body.lat);
    const inputLng = Number(req.body.longitude !== undefined ? req.body.longitude : req.body.lng);
    const defaultCoords = targetDistrict === "Polonnaruwa" ? { lat: 7.9403, lng: 81.0188 } : { lat: 8.3114, lng: 80.4037 };
    const finalCoords = Number.isFinite(inputLat) && Number.isFinite(inputLng) && inputLat >= -90 && inputLat <= 90 && inputLng >= -180 && inputLng <= 180
      ? { lat: inputLat, lng: inputLng }
      : defaultCoords;

    const initialStatus = status || "approved";

    const shop = new Shop({
      name: finalName,
      owner: user._id,
      contact: finalPhone,
      location: {
        province: "North Central Province",
        district: targetDistrict,
        city: targetCity,
        address: targetAddress,
        coordinates: {
          type: "Point",
          coordinates: [finalCoords.lng, finalCoords.lat],
        },
      },
      addressDetails: {
        province: "North Central Province",
        district: targetDistrict,
        city: targetCity,
        streetAddress: targetAddress,
        postalCode: targetDistrict === "Polonnaruwa" ? "51000" : "50000",
        coordinates: finalCoords,
      },
      description: finalDesc,
      businessDescription: finalDesc,
      shopType: finalShopType,
      photo: primaryPhoto,
      photos: uploadedPhotos,
      categories: parsedCategories,
      services: parsedServices,
      status: initialStatus,
      statusHistory: [
        {
          status: initialStatus,
          reason: "Created by administrator",
          changedBy: req.user._id,
          changedAt: new Date(),
        },
      ],
    });

    await shop.save();

    await recordAuditLog({
      req,
      action: "SHOP_CREATED",
      targetType: "shop",
      targetId: shop._id,
      targetName: shop.name,
      description: `Created new merchant profile '${shop.name}' (${shop.shopType})`,
      metadata: { ownerEmail: email },
    });

    res.status(201).json({ success: true, message: "Merchant created successfully", shop });
  } catch (error) {
    console.error("Create Shop Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateShop = async (req, res) => {
  const { id } = req.params;
  try {
    const shop = await Shop.findById(id);
    if (!shop) {
      return res.status(404).json({ success: false, message: "Shop not found" });
    }

    const {
      businessName,
      name,
      ownerName,
      email,
      phone,
      contact,
      location,
      district,
      establishmentType,
      shopType,
      businessDescription,
      description,
      status,
      categories: rawCategories,
      services: rawServices,
    } = req.body;

    if (name || businessName) shop.name = businessName || name;
    if (contact || phone) shop.contact = phone || contact;
    
    if (district || req.body.province || req.body.city || req.body.address || req.body.streetAddress || req.body.latitude !== undefined || req.body.lat !== undefined) {
      if (!shop.location || typeof shop.location === "string") {
        shop.location = {
          province: "North Central Province",
          district: "Anuradhapura",
          city: "Anuradhapura Town",
          address: "",
          coordinates: { type: "Point", coordinates: [80.4037, 8.3114] },
        };
      }
      if (district) {
        shop.location.district = String(district).toLowerCase().includes("polonnaruwa") ? "Polonnaruwa" : "Anuradhapura";
      }
      if (req.body.city) shop.location.city = String(req.body.city).trim();
      if (req.body.address || req.body.streetAddress) {
        shop.location.address = String(req.body.address || req.body.streetAddress).trim();
      }
      const inLat = Number(req.body.latitude !== undefined ? req.body.latitude : req.body.lat);
      const inLng = Number(req.body.longitude !== undefined ? req.body.longitude : req.body.lng);
      if (Number.isFinite(inLat) && Number.isFinite(inLng) && inLat >= -90 && inLat <= 90 && inLng >= -180 && inLng <= 180) {
        shop.location.coordinates = {
          type: "Point",
          coordinates: [inLng, inLat],
        };
      }
    } else if (typeof location === "string" && location.trim()) {
      if (!shop.location || typeof shop.location === "string") {
        const isPol = location.toLowerCase().includes("polonnaruwa");
        shop.location = {
          province: "North Central Province",
          district: isPol ? "Polonnaruwa" : "Anuradhapura",
          city: location.trim(),
          address: "",
          coordinates: {
            type: "Point",
            coordinates: isPol ? [81.0188, 7.9403] : [80.4037, 8.3114],
          },
        };
      }
    }

    if (establishmentType || shopType) shop.shopType = establishmentType || shopType;
    if (businessDescription !== undefined || description !== undefined) {
      shop.businessDescription = businessDescription !== undefined ? businessDescription : description;
      shop.description = shop.businessDescription;
    }
    if (status && status !== shop.status) {
      shop.status = status;
      shop.statusHistory.push({
        status,
        reason: "Updated in shop settings",
        changedBy: req.user._id,
        changedAt: new Date(),
      });
    }

    if (rawCategories) {
      try {
        shop.categories = typeof rawCategories === "string" ? JSON.parse(rawCategories) : rawCategories;
      } catch (e) {
        shop.categories = Array.isArray(rawCategories) ? rawCategories : [rawCategories];
      }
    }

    if (rawServices) {
      try {
        shop.services = typeof rawServices === "string" ? JSON.parse(rawServices) : rawServices;
      } catch (e) {
        shop.services = Array.isArray(rawServices) ? rawServices : [rawServices];
      }
    }

    if (req.files && req.files.length > 0) {
      const newPhotos = req.files.map((file) => `/uploads/${file.filename}`);
      shop.photos = [...(shop.photos || []), ...newPhotos];
      if (!shop.photo) shop.photo = newPhotos[0];
    }

    await shop.save();

    if (shop.owner) {
      const ownerUser = await User.findById(shop.owner);
      if (ownerUser) {
        if (ownerName) ownerUser.name = ownerName;
        if (email) ownerUser.email = email;
        await ownerUser.save();
      }
    }

    await recordAuditLog({
      req,
      action: "SHOP_UPDATED",
      targetType: "shop",
      targetId: shop._id,
      targetName: shop.name,
      description: `Updated business details for '${shop.name}'`,
    });

    res.status(200).json({ success: true, message: "Merchant updated successfully", shop });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateShopStatus = async (req, res) => {
  const { id } = req.params;
  const {
    status,
    reason = "",
    feedbackForOwner = "",
    actionRequired = "",
    internalNotes = ""
  } = req.body;

  const validStatuses = [
    "pending",
    "approved",
    "suspended",
    "rejected",
    "under_review",
    "deactivated",
    "changes_requested"
  ];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status transition" });
  }

  if ((status === "rejected" || status === "suspended" || status === "changes_requested") && !reason.trim() && !feedbackForOwner.trim()) {
    return res.status(400).json({
      success: false,
      message: "Please provide a reason or specific feedback explaining the decision to the merchant."
    });
  }

  try {
    const shop = await Shop.findById(id);
    if (!shop) {
      return res.status(404).json({ success: false, message: "Shop not found" });
    }

    const previousStatus = shop.status;
    shop.status = status;
    const finalReason = reason || feedbackForOwner || `Status changed from ${previousStatus} to ${status}`;

    if (status === "rejected") {
      shop.rejectionReason = finalReason;
    } else if (status === "approved") {
      shop.verifiedAt = new Date();
      shop.verifiedBy = req.user._id;
      shop.rejectionReason = "";
    }

    if (feedbackForOwner || actionRequired || internalNotes) {
      shop.adminNotes = {
        internalNotes: internalNotes || shop.adminNotes?.internalNotes || "",
        feedbackForOwner: feedbackForOwner || reason || shop.adminNotes?.feedbackForOwner || "",
        actionRequired: actionRequired || shop.adminNotes?.actionRequired || "",
        updatedAt: new Date()
      };
    }

    shop.statusHistory.push({
      status,
      reason: finalReason,
      changedBy: req.user._id,
      changedAt: new Date(),
    });

    await shop.save();

    if (status === "approved" && shop.owner) {
      await User.findByIdAndUpdate(shop.owner, { isVerified: true });
    }

    if (shop.owner) {
      let notifyContent = `Your business listing '${shop.name}' status has been updated to: ${status.toUpperCase().replace('_', ' ')}.`;
      if (feedbackForOwner || reason) {
        notifyContent += `\n\nAdministrator Feedback: ${feedbackForOwner || reason}`;
      }
      if (actionRequired) {
        notifyContent += `\n\nAction Required: ${actionRequired}`;
      }
      await Message.create({
        sender: req.user._id,
        receiver: shop.owner,
        content: notifyContent,
      });
    }

    await recordAuditLog({
      req,
      action: `SHOP_STATUS_${status.toUpperCase()}`,
      targetType: "shop",
      targetId: shop._id,
      targetName: shop.name,
      description: `Changed '${shop.name}' status from ${previousStatus} to ${status}`,
      reason: finalReason,
      metadata: { previousStatus, newStatus: status, actionRequired },
    });

    res.status(200).json({ success: true, shop, message: `Shop status successfully updated to ${status}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteShop = async (req, res) => {
  const { id } = req.params;
  try {
    const shop = await Shop.findByIdAndDelete(id);
    if (!shop) {
      return res.status(404).json({ success: false, message: "Shop not found" });
    }

    await Promise.all([
      FoodItem.deleteMany({ shop: id }),
      Category.deleteMany({ shop: id }),
      Comment.deleteMany({ shop: id }),
      Warning.deleteMany({ shop: id }),
      Room.deleteMany({ shop: id }),
      Promotion.deleteMany({ shop: id }),
      Announcement.deleteMany({ shop: id }),
    ]);

    await recordAuditLog({
      req,
      action: "SHOP_DELETED",
      targetType: "shop",
      targetId: id,
      targetName: shop.name,
      description: `Permanently removed merchant listing '${shop.name}' and associated records`,
    });

    res.status(200).json({ success: true, message: "Shop deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getShopFood = async (req, res) => {
  try {
    const food = await FoodItem.find({ shop: req.params.id }).populate("category", "name");
    res.status(200).json({ success: true, food });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getShopCategories = async (req, res) => {
  try {
    const categories = await Category.find({ shop: req.params.id });
    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================
// WARNING SYSTEM
// ============================

export const issueWarning = async (req, res) => {
  try {
    const { shopId, reason, message, severity } = req.body;
    if (!shopId || !reason || !message) {
      return res.status(400).json({ success: false, message: "Shop ID, reason, and warning message are required." });
    }

    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ success: false, message: "Shop not found" });
    }

    const warning = await Warning.create({
      shop: shopId,
      owner: shop.owner,
      issuedBy: req.user._id,
      reason,
      message,
      severity: severity || "medium",
      status: "open",
    });

    await Message.create({
      sender: req.user._id,
      receiver: shop.owner,
      content: `⚠️ OFFICIAL WARNING [Severity: ${severity?.toUpperCase() || "MEDIUM"}]\nReason: ${reason}\n\n${message}\n\nPlease take corrective action immediately.`,
    });

    await recordAuditLog({
      req,
      action: "WARNING_ISSUED",
      targetType: "warning",
      targetId: warning._id,
      targetName: shop.name,
      description: `Issued ${severity || "medium"} severity warning to '${shop.name}': ${reason}`,
      metadata: { shopId, reason, severity },
    });

    res.status(201).json({ success: true, message: "Warning issued and dispatched to owner.", warning });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resolveWarning = async (req, res) => {
  try {
    const { id } = req.params;
    const { resolutionNotes } = req.body;

    const warning = await Warning.findByIdAndUpdate(
      id,
      { status: "resolved", resolutionNotes: resolutionNotes || "Resolved by administrator" },
      { new: true }
    );

    if (!warning) {
      return res.status(404).json({ success: false, message: "Warning not found" });
    }

    await recordAuditLog({
      req,
      action: "WARNING_RESOLVED",
      targetType: "warning",
      targetId: warning._id,
      description: `Warning resolved: ${resolutionNotes || "No notes"}`,
    });

    res.status(200).json({ success: true, message: "Warning marked as resolved", warning });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================
// REVIEW & FEEDBACK MODERATION
// ============================

export const getReviews = async (req, res) => {
  try {
    const { type = "shop", status = "all" } = req.query;

    if (type === "place") {
      const filter = status !== "all" ? { status } : {};
      const reviews = await PlaceComment.find(filter)
        .populate("user", "name email")
        .populate("place", "title location")
        .sort({ createdAt: -1 });

      const formatted = reviews.map((r) => ({
        id: r._id,
        targetType: "place",
        targetTitle: r.place?.title || "Unknown Destination",
        targetId: r.place?._id,
        userName: r.user?.name || "Anonymous",
        userEmail: r.user?.email || "N/A",
        message: r.message,
        rating: r.rating,
        status: r.status || "visible",
        moderationReason: r.moderationReason || "",
        createdAt: r.createdAt,
      }));

      return res.status(200).json({ success: true, reviews: formatted });
    }

    const filter = status !== "all" ? { status } : {};
    const reviews = await Comment.find(filter)
      .populate("user", "name email")
      .populate("shop", "name location")
      .sort({ createdAt: -1 });

    const formatted = reviews.map((r) => ({
      id: r._id,
      targetType: "shop",
      targetTitle: r.shop?.name || "Unknown Merchant",
      targetId: r.shop?._id,
      userName: r.user?.name || "Customer",
      userEmail: r.user?.email || "N/A",
      message: r.message,
      rating: r.rating,
      status: r.status || "visible",
      moderationReason: r.moderationReason || "",
      createdAt: r.createdAt,
    }));

    res.status(200).json({ success: true, reviews: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const moderateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { targetType = "shop", status, reason = "" } = req.body;

    if (!["visible", "flagged", "hidden"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid moderation status" });
    }

    let review;
    if (targetType === "place") {
      review = await PlaceComment.findByIdAndUpdate(
        id,
        {
          status,
          moderationReason: reason,
          moderatedBy: req.user._id,
          moderatedAt: new Date(),
        },
        { new: true }
      );
    } else {
      review = await Comment.findByIdAndUpdate(
        id,
        {
          status,
          moderationReason: reason,
          moderatedBy: req.user._id,
          moderatedAt: new Date(),
        },
        { new: true }
      );
    }

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    await recordAuditLog({
      req,
      action: `REVIEW_${status.toUpperCase()}`,
      targetType: "review",
      targetId: review._id,
      description: `Moderated review status to '${status}' (Reason: ${reason || "None"})`,
      reason,
    });

    res.status(200).json({ success: true, message: `Review status changed to ${status}`, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { targetType = "shop" } = req.query;

    if (targetType === "place") {
      await PlaceComment.findByIdAndDelete(id);
    } else {
      await Comment.findByIdAndDelete(id);
    }

    await recordAuditLog({
      req,
      action: "REVIEW_DELETED",
      targetType: "review",
      targetId: id,
      description: `Permanently removed review #${id}`,
    });

    res.status(200).json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================
// SITE USERS MANAGEMENT
// ============================

export const getUsers = async (req, res) => {
  try {
    const users = await SiteUser.find().select("-password").sort({ createdAt: -1 });
    const formattedUsers = users.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      status: user.status || "active",
      joinDate: user.createdAt ? new Date(user.createdAt).toISOString().split("T")[0] : "N/A",
      lastLogin: user.lastLogin ? new Date(user.lastLogin).toISOString().split("T")[0] : "N/A",
    }));
    res.status(200).json({ success: true, users: formattedUsers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const user = await SiteUser.findByIdAndUpdate(id, { status }, { new: true });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    await recordAuditLog({
      req,
      action: "USER_STATUS_UPDATED",
      targetType: "siteuser",
      targetId: user._id,
      targetName: user.name,
      description: `Updated customer '${user.name}' status to '${status}'`,
    });
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await SiteUser.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    await recordAuditLog({
      req,
      action: "USER_DELETED",
      targetType: "siteuser",
      targetId: id,
      targetName: user.name,
      description: `Removed customer account '${user.name}'`,
    });
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================
// LISTINGS MANAGEMENT
// ============================

export const getListings = async (req, res) => {
  try {
    const places = await Place.find().populate("categories", "name").sort({ createdAt: -1 });
    const formattedListings = places.map((place) => ({
      id: place._id,
      name: place.title,
      category: place.categories && place.categories.length > 0 ? place.categories[0].name : "Heritage",
      location: place.location,
      rating: place.rating || 4.5,
      status: place.status || "active",
      reviewsCount: place.likes ? place.likes.length : 0,
      image:
        place.images && place.images.length > 0
          ? place.images[0]
          : "https://images.unsplash.com/photo-1588598126483-2476d5318fb4?w=500&auto=format&fit=crop&q=60",
    }));
    res.status(200).json({ success: true, listings: formattedListings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateListingStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const place = await Place.findByIdAndUpdate(id, { status }, { new: true });
    if (!place) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }
    await recordAuditLog({
      req,
      action: "LISTING_STATUS_UPDATED",
      targetType: "listing",
      targetId: place._id,
      targetName: place.title,
      description: `Listing '${place.title}' status set to '${status}'`,
    });
    res.status(200).json({ success: true, listing: place });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteListing = async (req, res) => {
  const { id } = req.params;
  try {
    const place = await Place.findByIdAndDelete(id);
    if (!place) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }
    await recordAuditLog({
      req,
      action: "LISTING_DELETED",
      targetType: "listing",
      targetId: id,
      targetName: place.title,
      description: `Deleted destination listing '${place.title}'`,
    });
    res.status(200).json({ success: true, message: "Listing deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================
// AUDIT LOGS
// ============================

export const getAuditLogs = async (req, res) => {
  try {
    const { action, targetType, limit = 100 } = req.query;
    const query = {};
    if (action) query.action = action;
    if (targetType) query.targetType = targetType;

    const logs = await AuditLog.find(query).sort({ createdAt: -1 }).limit(Number(limit));
    res.status(200).json({ success: true, logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLogs = async (req, res) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 }).limit(100);
    res.status(200).json({ success: true, logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================
// SYSTEM BACKUP & RECOVERY
// ============================

export const createDatabaseBackup = async (req, res) => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `ceyloncalling_backup_${timestamp}.json`;
    const filePath = path.join(BACKUPS_DIR, filename);

    const [shops, categories, food, users, siteUsers, places, comments, placeComments, settings] = await Promise.all([
      Shop.find().lean(),
      Category.find().lean(),
      FoodItem.find().lean(),
      User.find().select("-password -resetPasswordToken -verificationToken").lean(),
      SiteUser.find().select("-password -resetPasswordToken -verificationToken").lean(),
      Place.find().lean(),
      Comment.find().lean(),
      PlaceComment.find().lean(),
      Settings.find().lean(),
    ]);

    const backupData = {
      version: "2.1.0",
      createdAt: new Date().toISOString(),
      createdByUser: req.user?.email || "system",
      collections: {
        shops,
        categories,
        food,
        users,
        siteUsers,
        places,
        comments,
        placeComments,
        settings,
      },
      stats: {
        totalShops: shops.length,
        totalFood: food.length,
        totalUsers: users.length,
        totalSiteUsers: siteUsers.length,
        totalPlaces: places.length,
        totalComments: comments.length + placeComments.length,
      },
    };

    fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2), "utf8");
    const stats = fs.statSync(filePath);

    await recordAuditLog({
      req,
      action: "BACKUP_CREATED",
      targetType: "backup",
      targetName: filename,
      description: `Generated database snapshot ${filename} (${(stats.size / 1024).toFixed(1)} KB)`,
      metadata: backupData.stats,
    });

    res.status(201).json({
      success: true,
      message: "Database snapshot archive created successfully",
      backup: {
        filename,
        sizeBytes: stats.size,
        sizeFormatted: `${(stats.size / 1024).toFixed(1)} KB`,
        createdAt: backupData.createdAt,
        stats: backupData.stats,
      },
    });
  } catch (error) {
    console.error("Backup Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const listDatabaseBackups = async (req, res) => {
  try {
    if (!fs.existsSync(BACKUPS_DIR)) {
      return res.status(200).json({ success: true, backups: [] });
    }

    const files = fs.readdirSync(BACKUPS_DIR).filter((f) => f.endsWith(".json"));
    const backups = files.map((filename) => {
      const filePath = path.join(BACKUPS_DIR, filename);
      const stat = fs.statSync(filePath);
      return {
        filename,
        sizeBytes: stat.size,
        sizeFormatted: `${(stat.size / 1024).toFixed(1)} KB`,
        createdAt: stat.birthtime,
      };
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({ success: true, backups });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const downloadDatabaseBackup = async (req, res) => {
  try {
    const { filename } = req.params;
    const safeFilename = path.basename(filename);
    const filePath = path.join(BACKUPS_DIR, safeFilename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: "Backup archive not found" });
    }

    await recordAuditLog({
      req,
      action: "BACKUP_DOWNLOADED",
      targetType: "backup",
      targetName: safeFilename,
      description: `Administrator downloaded snapshot ${safeFilename}`,
    });

    res.download(filePath, safeFilename);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================
// SYSTEM HEALTH & SETTINGS
// ============================

export const getSystemHealth = async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const dbStatus = dbState === 1 ? "Healthy (Connected)" : "Degraded / Disconnected";
    const memUsage = process.memoryUsage();

    res.status(200).json({
      success: true,
      health: {
        server: "Online",
        uptimeSeconds: Math.floor(process.uptime()),
        database: dbStatus,
        environment: process.env.NODE_ENV || "development",
        memoryHeapUsedMB: (memUsage.heapUsed / 1024 / 1024).toFixed(1),
        memoryHeapTotalMB: (memUsage.heapTotal / 1024 / 1024).toFixed(1),
        nodeVersion: process.version,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        maintenanceMode: false,
        userRegistration: true,
        emailNotifications: true,
        systemVersion: "2.1.0",
      });
    }
    res.status(200).json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSettings = async (req, res) => {
  const { maintenanceMode, userRegistration, emailNotifications } = req.body;
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({});
    }
    settings.maintenanceMode = maintenanceMode !== undefined ? maintenanceMode : settings.maintenanceMode;
    settings.userRegistration = userRegistration !== undefined ? userRegistration : settings.userRegistration;
    settings.emailNotifications = emailNotifications !== undefined ? emailNotifications : settings.emailNotifications;

    await settings.save();

    await recordAuditLog({
      req,
      action: "SETTINGS_UPDATED",
      targetType: "system",
      description: "Platform system configuration flags updated",
      metadata: { maintenanceMode, userRegistration, emailNotifications },
    });

    res.status(200).json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

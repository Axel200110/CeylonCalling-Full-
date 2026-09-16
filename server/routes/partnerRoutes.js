import bcryptjs from "bcryptjs";
import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import Shop from "../models/Shop.js";
import { User } from "../models/user.model.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads/")),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const imageFileFilter = (req, file, cb) => {
  const acceptedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (acceptedTypes.includes(file.mimetype)) {
    return cb(null, true);
  }
  return cb(new Error("Only image files (JPEG, PNG, WEBP, GIF) are allowed."), false);
};

const upload = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});

// POST /register - Onboard a new partner (User + Shop)
router.post("/register", upload.array("photos", 5), async (req, res) => {
  try {
    const {
      businessName,
      ownerName,
      email,
      phone,
      password,
      location,
      establishmentType,
      details,
      businessDescription,
      categories: rawCategories,
      services: rawServices
    } = req.body || {};

    const normalizedEmail = String(email || "").trim().toLowerCase();
    const normalizedBusinessName = String(businessName || "").trim();
    const normalizedOwnerName = String(ownerName || "").trim();
    const normalizedPhone = String(phone || "").trim();
    const normalizedPassword = String(password || "").trim();
    const normalizedEstablishmentType = String(establishmentType || "restaurant").trim().toLowerCase();
    const allowedShopTypes = ["restaurant", "hotel", "villa", "guesthouse"];
    const shopType = allowedShopTypes.includes(normalizedEstablishmentType) ? normalizedEstablishmentType : "restaurant";
    const descriptionText = String(businessDescription || details || "").trim();

    if (
      !normalizedEmail ||
      !normalizedPassword ||
      !normalizedOwnerName ||
      !normalizedBusinessName ||
      !normalizedPhone
    ) {
      return res.status(400).json({
        success: false,
        message: "Required partner fields are missing.",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered. Please use a different email address.",
      });
    }

    const hashedPassword = await bcryptjs.hash(normalizedPassword, 10);
    const newUser = new User({
      email: normalizedEmail,
      password: hashedPassword,
      name: normalizedOwnerName,
      role: "partner",
      isVerified: false,
    });
    const savedUser = await newUser.save();

    let uploadedPhotos = [];
    if (req.files && req.files.length > 0) {
      uploadedPhotos = req.files.map((file) => `/uploads/${file.filename}`);
    }
    const primaryPhoto = uploadedPhotos.length > 0 ? uploadedPhotos[0] : "";

    const parseArrayField = (fieldValue) => {
      if (!fieldValue) return [];
      if (Array.isArray(fieldValue)) {
        return fieldValue.map((item) => String(item).trim()).filter(Boolean);
      }
      if (typeof fieldValue === "string") {
        try {
          const parsed = JSON.parse(fieldValue);
          return Array.isArray(parsed)
            ? parsed.map((item) => String(item).trim()).filter(Boolean)
            : [fieldValue.trim()].filter(Boolean);
        } catch {
          return fieldValue
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
        }
      }
      return [];
    };

    const parsedCategories = parseArrayField(rawCategories);
    const parsedServices = parseArrayField(rawServices);

    const newShop = new Shop({
      name: normalizedBusinessName,
      owner: savedUser._id,
      contact: normalizedPhone,
      location: String(location || "Anuradhapura").trim(),
      description: descriptionText,
      businessDescription: descriptionText,
      shopType,
      photo: primaryPhoto,
      photos: uploadedPhotos,
      categories: parsedCategories,
      services: parsedServices,
      status: "pending",
    });

    await newShop.save();

    return res.status(201).json({
      success: true,
      message: "Partner registration request submitted successfully. Awaiting administrator verification.",
    });
  } catch (error) {
    console.error("Partner Registration Error:", error);
    if (error instanceof multer.MulterError) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Unable to process partner registration at this time.",
    });
  }
});

export default router;

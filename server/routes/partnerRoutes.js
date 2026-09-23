import bcryptjs from "bcryptjs";
import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import Shop from "../models/shop.model.js";
import { User } from "../models/user.model.js";
import { validateNorthCentralLocation, SRI_LANKA_REGIONS } from "../config/locationRegistry.js";

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

// POST /register - Onboard a new partner (User + Shop) with North Central scope validation
router.post("/register", upload.array("photos", 5), async (req, res) => {
  try {
    const {
      businessName,
      ownerName,
      email,
      phone,
      password,
      province,
      district,
      city,
      streetAddress,
      location,
      latitude,
      longitude,
      lat,
      lng,
      establishmentType,
      details,
      businessDescription,
      categories: rawCategories,
      services: rawServices,
      hasFood,
      hasAccommodation,
      hasDineIn,
      hasTakeaway,
      hasDelivery,
      totalUnits,
      startingPricePerNight,
      roomTypes: rawRoomTypes,
      mainAmenities: rawMainAmenities
    } = req.body || {};

    const normalizedEmail = String(email || "").trim().toLowerCase();
    const normalizedBusinessName = String(businessName || "").trim();
    const normalizedOwnerName = String(ownerName || "").trim();
    const normalizedPhone = String(phone || "").trim();
    const normalizedPassword = String(password || "").trim();
    const normalizedEstablishmentType = String(establishmentType || "restaurant").trim().toLowerCase();
    const allowedShopTypes = ["restaurant", "hotel", "villa", "guesthouse", "small_food_shop"];
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
        message: "Required partner credentials and business name are missing.",
      });
    }

    // --- NORTH CENTRAL PROVINCE SCOPE VALIDATION ---
    const targetDistrict = String(district || location || "Anuradhapura").trim();
    const locationCheck = validateNorthCentralLocation({
      province: province || "North Central Province",
      district: targetDistrict,
      city
    });

    if (!locationCheck.valid) {
      return res.status(422).json({
        success: false,
        message: locationCheck.error || "Ceylon Calling is strictly focused on the North Central Province (Anuradhapura & Polonnaruwa).",
      });
    }

    const formattedDistrict = targetDistrict.toLowerCase().includes("polonnaruwa")
      ? "Polonnaruwa"
      : "Anuradhapura";

    const formattedCity = String(city || "").trim() || (formattedDistrict === "Polonnaruwa" ? "Polonnaruwa Heritage City" : "Anuradhapura Town");
    const defaultCoords = formattedDistrict === "Polonnaruwa"
      ? { lat: 7.9403, lng: 81.0188 }
      : { lat: 8.3114, lng: 80.4037 };

    const inputLat = Number(latitude !== undefined ? latitude : lat);
    const inputLng = Number(longitude !== undefined ? longitude : lng);
    const hasValidInputCoords =
      Number.isFinite(inputLat) &&
      Number.isFinite(inputLng) &&
      inputLat >= -90 &&
      inputLat <= 90 &&
      inputLng >= -180 &&
      inputLng <= 180;

    const finalCoords = hasValidInputCoords
      ? { lat: inputLat, lng: inputLng }
      : defaultCoords;

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
    const parsedRoomTypes = parseArrayField(rawRoomTypes);
    const parsedMainAmenities = parseArrayField(rawMainAmenities);

    const isAccommodationType = ["hotel", "villa", "guesthouse"].includes(shopType);

    const capabilities = {
      hasFood: hasFood !== undefined ? Boolean(hasFood === "true" || hasFood === true) : true,
      hasAccommodation: hasAccommodation !== undefined ? Boolean(hasAccommodation === "true" || hasAccommodation === true) : isAccommodationType,
      hasOnlineOrdering: false, // Default off until approved and activated
      hasDineIn: hasDineIn !== undefined ? Boolean(hasDineIn === "true" || hasDineIn === true) : true,
      hasTakeaway: hasTakeaway !== undefined ? Boolean(hasTakeaway === "true" || hasTakeaway === true) : true,
      hasDelivery: hasDelivery !== undefined ? Boolean(hasDelivery === "true" || hasDelivery === true) : false,
      hasReservations: false,
      hasRoomBooking: isAccommodationType
    };

    const accommodationSnapshot = {
      totalUnits: Number(totalUnits) || (isAccommodationType ? 5 : 0),
      startingPricePerNight: Number(startingPricePerNight) || (isAccommodationType ? 5000 : 0),
      roomTypes: parsedRoomTypes,
      mainAmenities: parsedMainAmenities
    };

    const newShop = new Shop({
      name: normalizedBusinessName,
      owner: savedUser._id,
      contact: normalizedPhone,
      location: {
        province: "North Central Province",
        district: formattedDistrict,
        city: formattedCity,
        address: String(streetAddress || "").trim(),
        coordinates: {
          type: "Point",
          coordinates: [finalCoords.lng, finalCoords.lat],
        },
      },
      addressDetails: {
        province: "North Central Province",
        district: formattedDistrict,
        city: formattedCity,
        streetAddress: String(streetAddress || "").trim(),
        postalCode: formattedDistrict === "Polonnaruwa" ? "51000" : "50000",
        coordinates: finalCoords,
      },
      description: descriptionText,
      businessDescription: descriptionText,
      shopType,
      capabilities,
      accommodationSnapshot,
      photo: primaryPhoto,
      photos: uploadedPhotos,
      categories: parsedCategories,
      services: parsedServices,
      status: "pending",
      statusHistory: [
        {
          status: "pending",
          reason: "Submitted partner application",
          changedBy: savedUser._id,
          changedAt: new Date()
        }
      ]
    });

    await newShop.save();

    return res.status(201).json({
      success: true,
      message: "Partner registration request submitted successfully. Awaiting administrator verification.",
      shopId: newShop._id
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

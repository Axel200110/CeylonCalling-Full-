import bcryptjs from "bcryptjs";
import FoodItem from "../models/Addfood.js";
import Category from "../models/Category.js";
import { Log } from "../models/log.model.js";
import Place from "../models/place.model.js";
import { Settings } from "../models/settings.model.js";
import Shop from "../models/Shop.js";
import { SiteUser } from "../models/siteUser.model.js";
import { User } from "../models/user.model.js";

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

// ============================
// SHOPS MANAGEMENT
// ============================

export const getShops = async (req, res) => {
  try {
    const shops = await Shop.find().populate("owner", "name email");
    const formattedShops = shops.map(shop => {
      const photosArray = shop.photos && shop.photos.length > 0 
        ? shop.photos 
        : (shop.photo ? [shop.photo] : []);

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
        status: shop.status,
        rating: shop.rating || 5.0,
        image: shop.photo || (photosArray.length > 0 ? photosArray[0] : "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&auto=format&fit=crop&q=60"),
        photos: photosArray,
        location: shop.location || "",
        district: shop.location || "",
        createdAt: shop.createdAt
      };
    });
    res.status(200).json({ success: true, shops: formattedShops });
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
      services: rawServices
    } = req.body;

    const finalName = businessName || name;
    const finalPhone = phone || contact;
    const finalLocation = location || district || "Anuradhapura";
    const finalShopType = establishmentType || shopType || "restaurant";
    const finalDesc = businessDescription || description || "";

    if (!finalName || !finalPhone || !email) {
      return res.status(400).json({ success: false, message: "Business name, owner email, and contact phone are required." });
    }

    // Find or create owner user
    let user = await User.findOne({ email });
    if (!user) {
      const hashedPassword = await bcryptjs.hash("Partner@123", 10);
      user = await User.create({
        email,
        password: hashedPassword,
        name: ownerName || finalName,
        isVerified: true
      });
    } else {
      if (ownerName) user.name = ownerName;
      if (user.role !== "admin") user.role = "partner";
      user.isVerified = true;
      await user.save();
    }

    // Handle photo uploads
    let uploadedPhotos = [];
    if (req.files && req.files.length > 0) {
      uploadedPhotos = req.files.map(file => `/uploads/${file.filename}`);
    }
    const primaryPhoto = uploadedPhotos.length > 0 ? uploadedPhotos[0] : "";

    // Parse categories and services
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

    const shop = new Shop({
      name: finalName,
      owner: user._id,
      contact: finalPhone,
      location: finalLocation,
      description: finalDesc,
      businessDescription: finalDesc,
      shopType: finalShopType,
      photo: primaryPhoto,
      photos: uploadedPhotos,
      categories: parsedCategories,
      services: parsedServices,
      status: status || "approved",
    });

    await shop.save();

    await Log.create({
      text: `Admin created new shop/partner '${shop.name}'`,
      type: "shop"
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
      services: rawServices
    } = req.body;

    if (name || businessName) shop.name = businessName || name;
    if (contact || phone) shop.contact = phone || contact;
    if (location || district) shop.location = location || district;
    if (establishmentType || shopType) shop.shopType = establishmentType || shopType;
    if (businessDescription !== undefined || description !== undefined) {
      shop.businessDescription = businessDescription !== undefined ? businessDescription : description;
      shop.description = shop.businessDescription;
    }
    if (status) shop.status = status;

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

    // Handle new photos uploaded if any
    if (req.files && req.files.length > 0) {
      const newPhotos = req.files.map(file => `/uploads/${file.filename}`);
      shop.photos = [...(shop.photos || []), ...newPhotos];
      if (!shop.photo) shop.photo = newPhotos[0];
    }

    await shop.save();

    // Update linked user if ownerName or email changed
    if (shop.owner) {
      const ownerUser = await User.findById(shop.owner);
      if (ownerUser) {
        if (ownerName) ownerUser.name = ownerName;
        if (email) ownerUser.email = email;
        await ownerUser.save();
      }
    }

    await Log.create({
      text: `Admin updated shop/partner '${shop.name}' details`,
      type: "shop"
    });

    res.status(200).json({ success: true, message: "Merchant updated successfully", shop });
  } catch (error) {
    console.error("Update Shop Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateShopStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const shop = await Shop.findByIdAndUpdate(id, { status }, { new: true });
    if (!shop) {
      return res.status(404).json({ success: false, message: "Shop not found" });
    }
    if (status === "approved" && shop.owner) {
      await User.findByIdAndUpdate(shop.owner, { isVerified: true });
    }
    await Log.create({
      text: `Shop '${shop.name}' status updated to '${status}'`,
      type: "shop"
    });
    res.status(200).json({ success: true, shop });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getShopFood = async (req, res) => {
  try {
    const food = await FoodItem.find({ shop: req.params.id }).populate('category', 'name');
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

export const deleteShop = async (req, res) => {
  const { id } = req.params;
  try {
    const shop = await Shop.findByIdAndDelete(id);
    if (!shop) {
      return res.status(404).json({ success: false, message: "Shop not found" });
    }
    await Log.create({
      text: `Shop '${shop.name}' was deleted`,
      type: "shop"
    });
    res.status(200).json({ success: true, message: "Shop deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================
// SITE USERS MANAGEMENT
// ============================

export const getUsers = async (req, res) => {
  try {
    const users = await SiteUser.find().select("-password");
    const formattedUsers = users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      status: user.status || "active",
      joinDate: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      lastLogin: user.lastLogin ? new Date(user.lastLogin).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
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
    await Log.create({
      text: `User '${user.name}' status updated to '${status}'`,
      type: "user"
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
    await Log.create({
      text: `User '${user.name}' was removed from the database`,
      type: "user"
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
    const places = await Place.find().populate("categories", "name");
    const formattedListings = places.map(place => ({
      id: place._id,
      name: place.title,
      category: place.categories && place.categories.length > 0 ? place.categories[0].name : "Heritage",
      location: place.location,
      rating: 4.8,
      status: place.status || "active",
      reviewsCount: place.likes ? place.likes.length : 0,
      image: place.images && place.images.length > 0 ? place.images[0] : "https://images.unsplash.com/photo-1588598126483-2476d5318fb4?w=500&auto=format&fit=crop&q=60"
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
    await Log.create({
      text: `Listing '${place.title}' status set to '${status}'`,
      type: "listing"
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
    await Log.create({
      text: `Listing '${place.title}' was deleted`,
      type: "listing"
    });
    res.status(200).json({ success: true, message: "Listing deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================
// ACTIVITY LOGS
// ============================

export const getLogs = async (req, res) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 }).limit(100);
    res.status(200).json({ success: true, logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================
// SYSTEM CONFIGURATIONS
// ============================

export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        maintenanceMode: false,
        userRegistration: true,
        emailNotifications: true,
        systemVersion: "2.1.0"
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
    
    await Log.create({
      text: `System settings updated`,
      type: "system"
    });
    
    res.status(200).json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

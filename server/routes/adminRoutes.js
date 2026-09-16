import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import {
    checkAuth,
    createShop,
    deleteListing,
    deleteShop,
    deleteUser,
    getListings,
    getLogs,
    getSettings,
    getShopCategories,
    getShopFood,
    getShops,
    getUsers,
    login,
    logout,
    updateListingStatus,
    updateSettings,
    updateShop,
    updateShopStatus,
    updateUserStatus
} from "../controllers/admin.controller.js";
import { adminAuth } from "../middlewares/adminAuth.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer storage for admin uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads/")),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Public auth endpoints
router.post("/login", login);
router.post("/logout", logout);

// Admin-only endpoints guard
router.use(adminAuth);

router.get("/check-auth", checkAuth);

// Shops
router.get("/shops", getShops);
router.post("/shops", upload.array("photos", 5), createShop);
router.put("/shops/:id", upload.array("photos", 5), updateShop);
router.put("/shops/:id/status", updateShopStatus);
router.get("/shops/:id/food", getShopFood);
router.get("/shops/:id/categories", getShopCategories);
router.delete("/shops/:id", deleteShop);

// Site Users
router.get("/users", getUsers);
router.put("/users/:id/status", updateUserStatus);
router.delete("/users/:id", deleteUser);

// Listings
router.get("/listings", getListings);
router.put("/listings/:id/status", updateListingStatus);
router.delete("/listings/:id", deleteListing);

// Logs
router.get("/logs", getLogs);

// Settings
router.get("/settings", getSettings);
router.put("/settings", updateSettings);

export default router;

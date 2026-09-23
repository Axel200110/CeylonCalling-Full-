import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import {
  checkAuth,
  createDatabaseBackup,
  createShop,
  deleteListing,
  deleteReview,
  deleteShop,
  deleteUser,
  downloadDatabaseBackup,
  getAuditLogs,
  getDashboardStats,
  getListings,
  getLogs,
  getReviews,
  getSettings,
  getShopCategories,
  getShopDetails,
  getShopFood,
  getShops,
  getSystemHealth,
  getUsers,
  issueWarning,
  listDatabaseBackups,
  login,
  logout,
  moderateReview,
  resolveWarning,
  updateAdminPassword,
  updateListingStatus,
  updateSettings,
  updateShop,
  updateShopStatus,
  updateUserStatus,
} from "../controllers/admin.controller.js";
import { adminAuth } from "../middlewares/adminAuth.js";
import { adminLoginLimiter, adminActionLimiter } from "../middlewares/rateLimiter.js";
import { validateObjectIdParam } from "../middlewares/validateRequest.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads/")),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

// Public auth endpoints
router.post("/login", adminLoginLimiter, login);
router.post("/logout", logout);

// Admin-only endpoints guard
router.use(adminAuth);

router.get("/check-auth", checkAuth);
router.put("/password", updateAdminPassword);

// Analytics & Dashboard
router.get("/dashboard/stats", getDashboardStats);
router.get("/system-health", getSystemHealth);

// Shops & Merchants
router.get("/shops", getShops);
router.get("/shops/:id", validateObjectIdParam("id"), getShopDetails);
router.post("/shops", upload.array("photos", 5), createShop);
router.put("/shops/:id", validateObjectIdParam("id"), upload.array("photos", 5), updateShop);
router.put("/shops/:id/status", validateObjectIdParam("id"), adminActionLimiter, updateShopStatus);
router.get("/shops/:id/food", validateObjectIdParam("id"), getShopFood);
router.get("/shops/:id/categories", validateObjectIdParam("id"), getShopCategories);
router.delete("/shops/:id", validateObjectIdParam("id"), adminActionLimiter, deleteShop);

// Warnings System
router.post("/warnings", adminActionLimiter, issueWarning);
router.put("/warnings/:id/resolve", validateObjectIdParam("id"), resolveWarning);

// Review & Feedback Moderation
router.get("/reviews", getReviews);
router.put("/reviews/:id/moderate", validateObjectIdParam("id"), adminActionLimiter, moderateReview);
router.delete("/reviews/:id", validateObjectIdParam("id"), adminActionLimiter, deleteReview);

// Site Users (Customers)
router.get("/users", getUsers);
router.put("/users/:id/status", validateObjectIdParam("id"), updateUserStatus);
router.delete("/users/:id", validateObjectIdParam("id"), adminActionLimiter, deleteUser);

// Destination Listings
router.get("/listings", getListings);
router.put("/listings/:id/status", validateObjectIdParam("id"), updateListingStatus);
router.delete("/listings/:id", validateObjectIdParam("id"), adminActionLimiter, deleteListing);

// Logs & Audit Trail
router.get("/audit-logs", getAuditLogs);
router.get("/logs", getLogs);

// Database Backups & Recovery
router.post("/backups/create", adminActionLimiter, createDatabaseBackup);
router.get("/backups", listDatabaseBackups);
router.get("/backups/download/:filename", downloadDatabaseBackup);

// Global Platform Settings
router.get("/settings", getSettings);
router.put("/settings", updateSettings);

export default router;

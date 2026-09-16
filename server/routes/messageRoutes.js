import express from "express";
import {
  sendMessageToAdmin,
  getMessagesForShopOwner,
  sendMessageToShopOwner,
  getMessagesForAdmin,
  getConversationsForAdmin
} from "../controllers/message.controller.js";
import { sessionAuth } from "../middlewares/sessionAuth.js";
import { adminAuth } from "../middlewares/adminAuth.js";

const router = express.Router();

// Shop Owner message endpoints
router.post("/partner", sessionAuth, sendMessageToAdmin);
router.get("/partner", sessionAuth, getMessagesForShopOwner);

// Admin message endpoints
router.post("/admin", adminAuth, sendMessageToShopOwner);
router.get("/admin/conversations", adminAuth, getConversationsForAdmin);
router.get("/admin/:shopOwnerId", adminAuth, getMessagesForAdmin);

export default router;

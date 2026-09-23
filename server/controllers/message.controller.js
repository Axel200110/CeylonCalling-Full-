import Message from "../models/message.model.js";
import { User } from "../models/user.model.js";
import Shop from "../models/shop.model.js";

// Send message (Shop Owner to Admin)
export const sendMessageToAdmin = async (req, res) => {
  try {
    const senderId = req.session.userId;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: "Message content is required" });
    }

    // Find admin user
    const admin = await User.findOne({ role: "admin" });
    if (!admin) {
      return res.status(404).json({ success: false, message: "System administrator not found" });
    }

    const message = await Message.create({
      sender: senderId,
      receiver: admin._id,
      content: content.trim(),
    });

    res.status(201).json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get messages (Shop Owner <-> Admin thread)
export const getMessagesForShopOwner = async (req, res) => {
  try {
    const shopOwnerId = req.session.userId;

    const admin = await User.findOne({ role: "admin" });
    if (!admin) {
      return res.status(404).json({ success: false, message: "System administrator not found" });
    }

    // Fetch thread
    const messages = await Message.find({
      $or: [
        { sender: shopOwnerId, receiver: admin._id },
        { sender: admin._id, receiver: shopOwnerId },
      ],
    }).sort({ createdAt: 1 });

    // Mark admin messages as read
    await Message.updateMany(
      { sender: admin._id, receiver: shopOwnerId, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Send message (Admin to Shop Owner)
export const sendMessageToShopOwner = async (req, res) => {
  try {
    const adminId = req.session.userId;
    const { shopOwnerId, content } = req.body;

    if (!shopOwnerId || !content || !content.trim()) {
      return res.status(400).json({ success: false, message: "Shop Owner ID and message content are required" });
    }

    // Verify receiver exists
    const receiver = await User.findById(shopOwnerId);
    if (!receiver) {
      return res.status(404).json({ success: false, message: "Shop Owner user not found" });
    }

    const message = await Message.create({
      sender: adminId,
      receiver: shopOwnerId,
      content: content.trim(),
    });

    res.status(201).json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get messages (Admin <-> Shop Owner thread)
export const getMessagesForAdmin = async (req, res) => {
  try {
    const adminId = req.session.userId;
    const { shopOwnerId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: adminId, receiver: shopOwnerId },
        { sender: shopOwnerId, receiver: adminId },
      ],
    }).sort({ createdAt: 1 });

    // Mark shop owner messages as read
    await Message.updateMany(
      { sender: shopOwnerId, receiver: adminId, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get active conversations list (For Admin dashboard)
export const getConversationsForAdmin = async (req, res) => {
  try {
    const adminId = req.session.userId;

    // Find all users who are partners (shop owners)
    const partners = await User.find({ role: "partner" }).select("name email");

    // For each partner, check for any message and unread count
    const conversations = await Promise.all(
      partners.map(async (partner) => {
        const lastMessage = await Message.findOne({
          $or: [
            { sender: adminId, receiver: partner._id },
            { sender: partner._id, receiver: adminId },
          ],
        })
          .sort({ createdAt: -1 })
          .select("content createdAt sender");

        const unreadCount = await Message.countDocuments({
          sender: partner._id,
          receiver: adminId,
          isRead: false,
        });

        const shop = await Shop.findOne({ owner: partner._id }).select("name photo");

        return {
          shopOwnerId: partner._id,
          ownerName: partner.name,
          ownerEmail: partner.email,
          shopName: shop ? shop.name : "Unknown Shop",
          shopPhoto: shop ? shop.photo : null,
          lastMessage: lastMessage ? lastMessage.content : null,
          lastMessageTime: lastMessage ? lastMessage.createdAt : null,
          lastMessageSender: lastMessage ? lastMessage.sender : null,
          unreadCount,
        };
      })
    );

    // Sort conversations: put those with messages/most recent messages first
    conversations.sort((a, b) => {
      if (!a.lastMessageTime) return 1;
      if (!b.lastMessageTime) return -1;
      return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
    });

    res.status(200).json({ success: true, conversations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

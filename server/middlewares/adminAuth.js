import { User } from "../models/user.model.js";

export async function adminAuth(req, res, next) {
  if (req.session && req.session.userId) {
    try {
      const user = await User.findById(req.session.userId);
      if (user && user.role === "admin") {
        req.user = user;
        return next();
      }
    } catch (err) {
      return res.status(500).json({ success: false, message: "Server error during admin verification" });
    }
  }
  res.status(403).json({ success: false, message: "Forbidden: Admin access required" });
}

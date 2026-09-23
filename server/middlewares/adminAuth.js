import { User } from "../models/user.model.js";

export async function adminAuth(req, res, next) {
  if (req.session && req.session.userId) {
    try {
      const user = await User.findById(req.session.userId).select("-password");
      if (user && user.role === "admin") {
        req.user = user;
        req.adminId = user._id;
        return next();
      }
    } catch (err) {
      return res.status(500).json({ success: false, message: "Server error during admin verification" });
    }
  }
  return res.status(403).json({ success: false, message: "Forbidden: Administrator access required" });
}

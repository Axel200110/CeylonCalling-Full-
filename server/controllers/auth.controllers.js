import bcryptjs from "bcryptjs";
import crypto from "crypto";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendWelcomeEmail
} from "../mailtrap/emails.js";
import Shop from "../models/shop.model.js";
import { User } from "../models/user.model.js";

// ============================
// SIGNUP CONTROLLER
// ============================
export const signup = async (req, res) => {
  return res.status(403).json({
    success: false,
    message: "Shop owner accounts must be created by an administrator.",
  });
};

// ============================
// VERIFY EMAIL
// ============================
export const verifyEmail = async (req, res) => {
  const { code } = req.body;

  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    // Update session
    req.session.userId = user._id;
    req.session.isVerified = true;
    await new Promise((resolve, reject) => req.session.save(err => err ? reject(err) : resolve()));

    await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Error in verifyEmail:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ============================
// LOGIN
// ============================
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    if (user.role === "partner") {
      const shop = await Shop.findOne({ owner: user._id });
      if (!shop || shop.status !== "approved") {
        return res.status(401).json({
          success: false,
          message: "Your account is not approved yet. Please wait for administrator approval.",
        });
      }
    }

    user.lastLogin = new Date();
    await user.save();

    // Create session
    req.session.userId = user._id;
    req.session.isVerified = user.isVerified;
    await new Promise((resolve, reject) => req.session.save(err => err ? reject(err) : resolve()));

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Error in login:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// ============================
// LOGOUT
// ============================
export const logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Logout failed" });
    }

    res.clearCookie("connect.sid", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });

    res.status(200).json({ success: true, message: "Logged out successfully" });
  });
};

// ============================
// FORGOT PASSWORD
// ============================
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await sendPasswordResetEmail(user.email, resetLink);

    res.status(200).json({ success: true, message: "Password reset link sent to your email" });
  } catch (error) {
    console.log("Error in forgotPassword:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// ============================
// RESET PASSWORD
// ============================
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    await sendResetSuccessEmail(user.email);

    res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.log("Error in resetPassword:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// ============================
// CHECK AUTH (Protected)
// ============================
export const checkAuth = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const user = await User.findById(req.session.userId).select("-password");

    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in checkAuth:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// ============================
// CHANGE PASSWORD (Protected)
// ============================
export const changePassword = async (req, res) => {
  const userId = req.session.userId;
  const { currentPassword, newPassword } = req.body;

  try {
    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcryptjs.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Current password is incorrect" });
    }

    // Prevent setting the same password again
    const isSame = await bcryptjs.compare(newPassword, user.password);
    if (isSame) {
      return res.status(400).json({ success: false, message: "New password must be different from the current password" });
    }

    user.password = await bcryptjs.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.log("Error in changePassword:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// UPDATE PROFILE (Protected)
// ============================
export const updateProfile = async (req, res) => {
  const userId = req.session.userId;
  const { name, email } = req.body;

  try {
    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    if (!name || !email) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Check if email is already used by another user
    const existingUser = await User.findOne({ email, _id: { $ne: userId } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email is already taken" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.name = name;
    user.email = email;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Error in updateProfile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

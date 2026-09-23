import bcrypt from "bcryptjs";
import crypto from "crypto";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../mailtrap/emails.js";
import { SiteUser } from "../models/siteUser.model.js";

// SIGNUP
export const signup = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    if (!email || !password || !name) throw new Error("All fields are required");
    if (password.length < 6) throw new Error("Password must be at least 6 characters");

    const existingUser = await SiteUser.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Email verification is disabled — account is active immediately on signup.
    const user = await SiteUser.create({
      email,
      password: hashedPassword,
      name,
      isVerified: true,
    });

    // Set session with siteuserId key
    req.session.siteuserId = user._id;
    req.session.isVerified = user.isVerified;
    await new Promise((resolve, reject) => req.session.save(err => err ? reject(err) : resolve()));

    // Best-effort welcome email — never fail signup if the mail provider hiccups.
    sendWelcomeEmail(user.email, user.name).catch((err) =>
      console.error("sendWelcomeEmail failed (non-fatal):", err.message)
    );

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// VERIFY EMAIL
export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await SiteUser.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ success: false, message: "Invalid or expired verification code" });

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    req.session.siteuserId = user._id;
    req.session.isVerified = true;
    await new Promise((resolve, reject) => req.session.save(err => err ? reject(err) : resolve()));

    await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await SiteUser.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

    user.lastLogin = new Date();
    await user.save();

    req.session.siteuserId = user._id;
    req.session.isVerified = user.isVerified;
    await new Promise((resolve, reject) => req.session.save(err => err ? reject(err) : resolve()));

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// LOGOUT
export const logout = async (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ success: false, message: "Logout failed" });
    res.clearCookie("connect.sid", { path: "/", httpOnly: true, sameSite: "lax" });
    res.status(200).json({ success: true, message: "Logged out successfully" });
  });
};

// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await SiteUser.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "User not found" });

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await sendPasswordResetEmail(user.email, resetLink);

    res.status(200).json({ success: true, message: "Password reset link sent to your email" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const user = await SiteUser.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ success: false, message: "Invalid or expired reset token" });

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    await sendResetSuccessEmail(user.email);

    res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// CHECK AUTH (Protected)
export const checkAuth = async (req, res) => {
  try {
    if (!req.session.siteuserId) return res.status(401).json({ success: false, message: "Not authenticated" });

    const user = await SiteUser.findById(req.session.siteuserId).select("-password");
    if (!user) return res.status(400).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// CHANGE PASSWORD (Protected)
export const changePassword = async (req, res) => {
  const siteuserId = req.session.siteuserId;
  const { currentPassword, newPassword } = req.body;
  try {
    if (!siteuserId) return res.status(401).json({ success: false, message: "Not authenticated" });
    if (!currentPassword || !newPassword) return res.status(400).json({ success: false, message: "All fields are required" });
    if (newPassword.length < 6) return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });

    const user = await SiteUser.findById(siteuserId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Current password is incorrect" });

    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) return res.status(400).json({ success: false, message: "New password must be different from the current password" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// UPDATE PROFILE (Protected)
export const updateProfile = async (req, res) => {
  const siteuserId = req.session.siteuserId;
  const { name, email } = req.body;
  try {
    if (!siteuserId) return res.status(401).json({ success: false, message: "Not authenticated" });
    if (!name || !email) return res.status(400).json({ success: false, message: "All fields are required" });

    const existingUser = await SiteUser.findOne({ email, _id: { $ne: siteuserId } });
    if (existingUser) return res.status(400).json({ success: false, message: "Email is already taken" });

    const user = await SiteUser.findById(siteuserId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.name = name;
    user.email = email;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
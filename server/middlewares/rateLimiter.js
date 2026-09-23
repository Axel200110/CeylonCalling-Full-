import rateLimit from "express-rate-limit";

// Admin login rate limiter - 15 attempts per 15 minutes
export const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: {
    success: false,
    message: "Too many login attempts from this IP. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Admin sensitive action limiter (status changes, backups, warnings)
export const adminActionLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 120,
  message: {
    success: false,
    message: "Rate limit exceeded for administrative operations. Please slow down.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

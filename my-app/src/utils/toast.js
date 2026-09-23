import toast from "react-hot-toast";

/**
 * Professional, Minimal, Accessible Toast Notification System for Ceylon Calling.
 *
 * Rules:
 * - Clean modern styling (subtle borders, refined typography, responsive)
 * - Concise, clear messages
 * - No cartoon graphics or excessive animations
 * - Never expose raw backend stack traces or database errors to users
 */

const TOAST_STYLE = {
  background: "#0f172a",
  color: "#f8fafc",
  fontSize: "13px",
  fontWeight: "500",
  padding: "10px 16px",
  borderRadius: "12px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)",
  maxWidth: "420px",
  lineHeight: "1.4",
};

/**
 * Sanitizes technical or raw network/database errors into clean human copy.
 */
const sanitizeErrorMessage = (error, defaultMessage = "Something went wrong. Please try again.") => {
  if (!error) return defaultMessage;
  if (typeof error === "string") {
    // If it looks like a raw stack trace or Mongo error, mask it
    if (
      error.includes("Mongo") ||
      error.includes("E11000") ||
      error.includes("Cast to ObjectId") ||
      error.includes("SyntaxError") ||
      error.length > 120
    ) {
      return defaultMessage;
    }
    return error;
  }
  if (error.response?.data?.error && typeof error.response.data.error === "string") {
    return sanitizeErrorMessage(error.response.data.error, defaultMessage);
  }
  if (error.response?.data?.message && typeof error.response.data.message === "string") {
    return sanitizeErrorMessage(error.response.data.message, defaultMessage);
  }
  if (error.message && typeof error.message === "string") {
    if (error.message.includes("Network Error")) {
      return "Network connection issue. Please check your internet.";
    }
    return sanitizeErrorMessage(error.message, defaultMessage);
  }
  return defaultMessage;
};

export const notify = {
  success: (message, options = {}) => {
    return toast.success(message, {
      duration: 3500,
      style: {
        ...TOAST_STYLE,
        borderLeft: "3px solid #10b981",
      },
      iconTheme: {
        primary: "#10b981",
        secondary: "#0f172a",
      },
      ...options,
    });
  },

  error: (error, fallback = "Unable to complete request. Please try again.", options = {}) => {
    const cleanMessage = sanitizeErrorMessage(error, fallback);
    return toast.error(cleanMessage, {
      duration: 4000,
      style: {
        ...TOAST_STYLE,
        borderLeft: "3px solid #f43f5e",
      },
      iconTheme: {
        primary: "#f43f5e",
        secondary: "#0f172a",
      },
      ...options,
    });
  },

  warning: (message, options = {}) => {
    return toast(message, {
      duration: 3500,
      icon: "⚠️",
      style: {
        ...TOAST_STYLE,
        borderLeft: "3px solid #f59e0b",
      },
      ...options,
    });
  },

  info: (message, options = {}) => {
    return toast(message, {
      duration: 3500,
      icon: "ℹ️",
      style: {
        ...TOAST_STYLE,
        borderLeft: "3px solid #3b82f6",
      },
      ...options,
    });
  },
};

export default notify;

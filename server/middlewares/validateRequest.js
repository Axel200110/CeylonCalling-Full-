import mongoose from "mongoose";

// Validate MongoDB ObjectId
export const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Middleware to sanitize request params containing IDs
export const validateObjectIdParam = (paramName = "id") => {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (!id || !isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid identifier provided for ${paramName}`,
      });
    }
    next();
  };
};

// Filter allowed fields to prevent mass assignment
export const sanitizeFields = (obj, allowedFields) => {
  const sanitized = {};
  for (const field of allowedFields) {
    if (obj[field] !== undefined) {
      sanitized[field] = obj[field];
    }
  }
  return sanitized;
};

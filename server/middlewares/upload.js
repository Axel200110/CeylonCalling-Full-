// Shared multer disk-storage middleware for file uploads.
//
// This file previously imported a non-existent "./Shop.js" and defined an
// Express Router directly inside a middleware file — it would have crashed
// on import (module not found) had anything actually required it. It turned
// out nothing did: every route file (shopRoutes, foodRoutes, adminRoutes,
// partnerRoutes, shopOwnerRoutes, place.route) defines its own near-identical
// multer disk-storage config instead of importing this one. That duplication
// is left as-is to avoid touching working upload logic in six files at once,
// but this file is fixed so it is a correct, reusable middleware going
// forward (and so it no longer sits broken in the codebase).
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads/")),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

export default upload;
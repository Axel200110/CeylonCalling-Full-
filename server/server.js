import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import helmet from "helmet";
import zlib from "node:zlib";

import connectDB from "./config/connectToDb.js";
import shopRoutes from "./routes/shopRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";
import authRoutes from "./routes/auth.route.js";
import siteUserRoutes from "./routes/siteUser.routes.js";
import commentRoutes from "./routes/comment.route.js"
import placesRoutes from "./routes/place.route.js"
import placeCategory from "./routes/place.catego.route.js";
import Placecomm from "./routes/pcomment.route.js";
import partnerRoutes from "./routes/partnerRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import shopOwnerRoutes from "./routes/shopOwnerRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "config", ".env") });

if (!process.env.DB_URL) throw new Error("DB_URL is not set in .env!");
if (!process.env.SESSION_SECRET) throw new Error("SESSION_SECRET is not set in .env!");

const app = express();

// Security headers. "helmet" was already a package.json dependency but was
// never actually wired in anywhere, so the app was shipping with none of its
// protections (clickjacking, MIME sniffing, etc.).
// - contentSecurityPolicy is disabled: a default-locked-down CSP tends to
//   break things it wasn't tuned for (Cloudinary/Google avatar images, the
//   built Vite SPA's assets) and isn't safe to turn on blind.
// - crossOriginResourcePolicy is relaxed to "cross-origin" so images served
//   from /uploads can still be loaded by the frontend when it's on a
//   different origin (e.g. localhost:5173 in dev).
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

const allowedOrigins = [
  clientUrl,
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5000",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());

const isProduction = process.env.NODE_ENV === "production";

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL,
      collectionName: "sessions",
      ttl: 7 * 24 * 60 * 60,
    }),
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    },
  })
);

// Native HTTP Gzip Response Compression Middleware
app.use((req, res, next) => {
  const acceptEncoding = req.headers["accept-encoding"] || "";
  if (!acceptEncoding.includes("gzip") || req.method === "HEAD") {
    return next();
  }

  const originalSend = res.send;
  res.send = function (body) {
    if (res.headersSent || !body) return originalSend.call(this, body);
    const contentType = String(res.getHeader("content-type") || "");
    if (
      contentType.includes("json") ||
      contentType.includes("text") ||
      contentType.includes("javascript")
    ) {
      const buffer = Buffer.isBuffer(body)
        ? body
        : Buffer.from(typeof body === "string" ? body : JSON.stringify(body));

      if (buffer.length > 1024) {
        zlib.gzip(buffer, (err, compressed) => {
          if (err) return originalSend.call(this, body);
          res.setHeader("Content-Encoding", "gzip");
          res.setHeader("Content-Length", compressed.length);
          res.removeHeader("ETag");
          return originalSend.call(this, compressed);
        });
        return;
      }
    }
    return originalSend.call(this, body);
  };
  next();
});

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    maxAge: "7d",
    immutable: true,
  })
);

app.get("/", (req, res) => {
  res.json({
    status: "Server running",
    session: req.session,
    user: req.user,
  });
});

app.use("/api/shops", shopRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/siteuser", siteUserRoutes);
app.use("/api/comments",commentRoutes);
app.use("/api/place",placesRoutes);
app.use("/api/placecat",placeCategory);
app.use("/api/placecomment",Placecomm);
app.use("/api/partners", partnerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/shopowner", shopOwnerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/bookings", bookingRoutes);

// Production client serve
if (process.env.NODE_ENV === "production") {
  const clientDistPath = path.join(__dirname, "../my-app/dist");
  app.use(express.static(clientDistPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to DB:", err);
    process.exit(1);
  });
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";

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


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "config", ".env") });

if (!process.env.DB_URL) throw new Error("DB_URL is not set in .env!");
if (!process.env.SESSION_SECRET) throw new Error("SESSION_SECRET is not set in .env!");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());

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
      secure: false,
      sameSite: "lax",
    },
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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
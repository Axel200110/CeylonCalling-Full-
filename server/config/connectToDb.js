// db.js or connectToDb.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// These are needed because __dirname is not available in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env only if not in production
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.join(__dirname, ".env") });
}

async function connectToDb() {
  try {
    const conn = await mongoose.connect(process.env.DB_URL, {
      serverSelectionTimeoutMS: 15000, // fail with a clear error instead of hanging/retrying forever
      family: 4, // force IPv4 — avoids TLS handshake resets some Windows/IPv6 network paths cause against Atlas
    });
    console.log(
      `✅ MongoDB Connected: ${conn.connection.host} / ${conn.connection.name}`
    );
  } catch (err) {
    // Log the top-level message, then dig into the per-server details that
    // Node's console.log hides by default (it truncates nested error
    // objects), since that's where the ACTUAL reason for each failed
    // connection attempt lives.
    console.error("❌ MongoDB connection error:", err.message);
    const servers = err?.reason?.servers || err?.cause?.reason?.servers;
    if (servers && typeof servers.forEach === "function") {
      console.error("--- Per-server details ---");
      servers.forEach((desc, address) => {
        const inner = desc?.error;
        console.error(
          `  ${address}: ${inner?.name || "?"} - ${inner?.message || inner || "no error captured"}`
        );
        if (inner?.code) console.error(`    code: ${inner.code}`);
        if (inner?.cause?.message) console.error(`    cause: ${inner.cause.message}`);
      });
    }
    throw err; // let the caller (server.js) decide what to do — it already handles this
  }
}

export default connectToDb;

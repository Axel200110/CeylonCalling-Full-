import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../config/.env") });

const DB_URL = process.env.DB_URL;
if (!DB_URL) {
  console.error("❌ DB_URL not found in .env");
  process.exit(1);
}

async function migrate() {
  console.log("🔄 Connecting to MongoDB...");
  await mongoose.connect(DB_URL);
  console.log("✅ Connected.");

  const shopsCol = mongoose.connection.db.collection("shops");
  const shops = await shopsCol.find({}).toArray();

  console.log(`🔍 Found ${shops.length} shop records to inspect and migrate.`);

  for (const shop of shops) {
    const rawLoc = shop.location;
    const rawAddr = shop.addressDetails || {};

    // 1. Determine normalized district
    let district = "Anuradhapura";
    const districtCandidates = [
      typeof rawLoc === "string" ? rawLoc : "",
      typeof rawLoc === "object" ? rawLoc?.district : "",
      rawAddr.district || "",
      shop.district || ""
    ].join(" ").toLowerCase();

    if (districtCandidates.includes("polonnaruwa")) {
      district = "Polonnaruwa";
    }

    // 2. Determine city
    let city = rawAddr.city;
    if (!city && typeof rawLoc === "string" && rawLoc.trim()) {
      city = rawLoc.split(",")[0].trim();
    }
    if (!city) {
      city = district === "Polonnaruwa" ? "Polonnaruwa Heritage City" : "Anuradhapura Town";
    }

    // 3. Determine street address
    const streetAddress = (
      rawAddr.streetAddress ||
      (typeof rawLoc === "object" ? rawLoc?.address : "") ||
      rawAddr.address ||
      ""
    ).trim();

    // 4. Determine coordinates [longitude, latitude]
    let lng = 80.4037;
    let lat = 8.3114;
    if (district === "Polonnaruwa") {
      lng = 81.0188;
      lat = 7.9403;
    }

    // Extract from addressDetails.coordinates if valid
    if (rawAddr.coordinates?.lat && rawAddr.coordinates?.lng) {
      lat = Number(rawAddr.coordinates.lat);
      lng = Number(rawAddr.coordinates.lng);
    } else if (
      rawLoc?.coordinates?.type === "Point" &&
      Array.isArray(rawLoc.coordinates.coordinates) &&
      rawLoc.coordinates.coordinates.length === 2
    ) {
      lng = Number(rawLoc.coordinates.coordinates[0]);
      lat = Number(rawLoc.coordinates.coordinates[1]);
    }

    const structuredLocation = {
      province: "North Central Province",
      district,
      city,
      address: streetAddress,
      coordinates: {
        type: "Point",
        coordinates: [lng, lat]
      }
    };

    const syncedAddressDetails = {
      province: "North Central Province",
      district,
      city,
      streetAddress,
      postalCode: district === "Polonnaruwa" ? "51000" : "50000",
      coordinates: { lat, lng }
    };

    await shopsCol.updateOne(
      { _id: shop._id },
      {
        $set: {
          location: structuredLocation,
          addressDetails: syncedAddressDetails
        }
      }
    );

    console.log(`  ✓ Migrated: "${shop.name}" -> ${district} (${city}) [lng: ${lng}, lat: ${lat}]`);
  }

  console.log("🔄 Ensuring 2dsphere geospatial index on location.coordinates...");
  try {
    await shopsCol.createIndex({ "location.coordinates": "2dsphere" });
    console.log("✅ 2dsphere index ensured.");
  } catch (err) {
    console.warn("⚠️ 2dsphere index notification:", err.message);
  }

  await mongoose.disconnect();
  console.log("✨ Migration completed successfully.");
}

migrate().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});

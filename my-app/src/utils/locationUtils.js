/**
 * Utility functions for business locations, coordinates, and Google Maps directions
 * Specifically tailored for North Central Province (Anuradhapura & Polonnaruwa).
 *
 * NOTE:
 * - NO Google Cloud API keys or paid billing are required.
 * - NO customer live location or browser geolocation (navigator.geolocation) is tracked.
 * - Dynamic directions URL points to the BUSINESS destination coordinates in Google Maps:
 *   https://www.google.com/maps/dir/?api=1&destination=LATITUDE,LONGITUDE
 */

export const DIRECTIONS_UNAVAILABLE_MSG =
  "Directions are unavailable because this business has not provided a valid location.";

export const DISTRICT_DEFAULTS = {
  Anuradhapura: { lat: 8.3114, lng: 80.4037, name: "Anuradhapura" },
  Polonnaruwa: { lat: 7.9403, lng: 81.0188, name: "Polonnaruwa" },
};

/**
 * Validates coordinate numbers:
 * Latitude: -90 to 90
 * Longitude: -180 to 180
 */
export const isValidCoordinate = (lat, lng) => {
  const latitude = Number(lat);
  const longitude = Number(lng);
  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180 &&
    !(latitude === 0 && longitude === 0)
  );
};

/**
 * Extract { lat, lng } strictly for the BUSINESS from shop object.
 *
 * Stored in MongoDB GeoJSON:
 * location.coordinates.coordinates: [longitude, latitude]
 * IMPORTANT: GeoJSON ordering is [longitude, latitude]!
 */
export const getShopCoordinates = (shop) => {
  if (!shop) return null;

  // 1. GeoJSON Point: coordinates: [longitude, latitude]
  const geoCoords = shop.location?.coordinates?.coordinates;
  if (Array.isArray(geoCoords) && geoCoords.length >= 2) {
    const lng = Number(geoCoords[0]);
    const lat = Number(geoCoords[1]);
    if (isValidCoordinate(lat, lng)) {
      return { lat, lng };
    }
  }

  // 2. addressDetails fallback
  const addrCoords = shop.addressDetails?.coordinates;
  if (addrCoords) {
    const lat = Number(addrCoords.lat);
    const lng = Number(addrCoords.lng);
    if (isValidCoordinate(lat, lng)) {
      return { lat, lng };
    }
  }

  // 3. Direct properties fallback
  const directLat = Number(shop.latitude ?? shop.lat);
  const directLng = Number(shop.longitude ?? shop.lng);
  if (isValidCoordinate(directLat, directLng)) {
    return { lat: directLat, lng: directLng };
  }

  return null;
};

/**
 * Returns true if shop has valid exact coordinates
 */
export const hasValidCoordinates = (shop) => {
  return getShopCoordinates(shop) !== null;
};

/**
 * Generates external Google Maps directions link based solely on business destination coordinates:
 * https://www.google.com/maps/dir/?api=1&destination=LATITUDE,LONGITUDE
 *
 * Returns null if business has not provided valid coordinates (prevents broken links).
 */
export const getDirectionsUrl = (shop) => {
  if (!shop) return null;

  const coords = getShopCoordinates(shop);
  if (coords) {
    return `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`;
  }

  return null;
};

/**
 * Returns clean district name ("Anuradhapura" or "Polonnaruwa")
 */
export const getShopDistrict = (shop) => {
  if (!shop) return "Anuradhapura";
  const raw =
    shop.location?.district ||
    shop.addressDetails?.district ||
    (typeof shop.location === "string" ? shop.location : "");
  return String(raw).toLowerCase().includes("polonnaruwa")
    ? "Polonnaruwa"
    : "Anuradhapura";
};

/**
 * Returns formatted location text
 */
export const getShopLocationText = (shop) => {
  if (!shop) return "North Central Province, Sri Lanka";
  const city = shop.location?.city || shop.addressDetails?.city;
  const district = getShopDistrict(shop);
  if (city) {
    return `${city}, ${district}`;
  }
  if (typeof shop.location === "string" && shop.location.trim()) {
    return shop.location.trim();
  }
  return `${district}, Sri Lanka`;
};

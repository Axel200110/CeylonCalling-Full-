/**
 * Format currency to Sri Lankan Rupees (LKR)
 * @param {number|string} amount 
 * @param {boolean} showDecimals
 * @returns {string} e.g. "LKR 1,250"
 */
export const formatLKR = (amount, showDecimals = false) => {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return "LKR 0";
  }
  const num = Number(amount);
  return `LKR ${num.toLocaleString("en-US", {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  })}`;
};

/**
 * Format rating with one decimal point
 * @param {number|string} rating 
 * @param {number} fallback 
 * @returns {string} e.g. "4.8"
 */
export const formatRating = (rating, fallback = 4.5) => {
  if (rating === undefined || rating === null || isNaN(Number(rating))) {
    return Number(fallback).toFixed(1);
  }
  return Number(rating).toFixed(1);
};

// Curated high quality Sri Lankan themed fallback images
export const FALLBACK_IMAGES = {
  restaurant: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80",
  cafe: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80",
  hotel: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80",
  villa: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1000&q=80",
  guesthouse: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=80",
  food: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1000&q=80",
  kottu: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1000&q=80",
  destination: "https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1000&q=80",
  hero: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1600&q=85",
};

/**
 * Resolve image URL safely to absolute backend URL or curated fallback
 * @param {string} url 
 * @param {string} type - restaurant, cafe, hotel, villa, guesthouse, food, destination
 * @returns {string}
 */
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/$/, "");
  }
  return import.meta.env.MODE === "development" ? "" : "";
};

export const resolveImageUrl = (url, type = "restaurant", options = {}) => {
  const { width = 600, quality = 80 } = options;
  if (!url || typeof url !== "string" || url.trim() === "" || url === "undefined" || url === "null") {
    const fallback = FALLBACK_IMAGES[type] || FALLBACK_IMAGES.restaurant;
    return fallback.includes("w=") ? fallback : `${fallback}&w=${width}&q=${quality}`;
  }
  
  const cleanUrl = url.trim();
  
  // 1. Cloudinary dynamic optimization: auto-WebP/AVIF format, auto-quality, responsive width
  if (cleanUrl.includes("cloudinary.com") && cleanUrl.includes("/upload/")) {
    if (!cleanUrl.includes("/upload/f_") && !cleanUrl.includes("/upload/w_")) {
      return cleanUrl.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
    }
    return cleanUrl;
  }

  // 2. Unsplash dynamic optimization
  if (cleanUrl.includes("images.unsplash.com")) {
    if (!cleanUrl.includes("w=")) {
      return `${cleanUrl}&auto=format&fit=crop&w=${width}&q=${quality}`;
    }
    return cleanUrl;
  }

  if (cleanUrl.startsWith("http://") || cleanUrl.startsWith("https://")) {
    return cleanUrl;
  }
  
  const apiBase = getApiBaseUrl();
  const formattedPath = cleanUrl.startsWith("/") ? cleanUrl : `/${cleanUrl}`;
  return `${apiBase}${formattedPath}`;
};


/**
 * Parse price range tier from string
 * @param {string} priceRangeStr 
 * @returns {"budget" | "standard" | "premium"}
 */
export const getPriceTier = (priceRangeStr = "") => {
  if (!priceRangeStr) return "standard";
  const lower = priceRangeStr.toLowerCase();
  if (lower.includes("budget") || lower.includes("$") && !lower.includes("$$$")) return "budget";
  if (lower.includes("premium") || lower.includes("luxury") || lower.includes("$$$")) return "premium";
  
  const numbers = priceRangeStr.replace(/[^0-9]/g, "");
  if (!numbers) return "standard";
  const val = parseInt(numbers, 10);
  if (val < 1000) return "budget";
  if (val <= 3000) return "standard";
  return "premium";
};

/**
 * Clean location display string
 * @param {string|object} location
 * @returns {string}
 */
export const formatLocation = (location) => {
  if (!location || location === "undefined" || location === "null") {
    return "Sri Lanka";
  }

  if (typeof location === "string") {
    const cleanLocation = location.trim();
    return cleanLocation && cleanLocation !== "undefined" && cleanLocation !== "null"
      ? cleanLocation
      : "Sri Lanka";
  }

  if (typeof location === "object") {
    const parts = [
      location.address,
      location.city,
      location.district,
      location.province,
    ]
      .map((part) => (typeof part === "string" ? part.trim() : ""))
      .filter(Boolean);

    return parts.length > 0 ? parts.join(", ") : "Sri Lanka";
  }

  return "Sri Lanka";
};

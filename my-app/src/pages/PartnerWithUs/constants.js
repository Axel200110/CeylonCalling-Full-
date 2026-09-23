// PartnerWithUs/constants.js

import {
  Accessibility,
  Bed,
  Building2,
  Cake,
  Car,
  Coffee,
  Columns,
  Compass,
  CreditCard,
  Fish,
  Flame,
  Home,
  Hotel,
  MapPin,
  Milestone,
  Music,
  Snowflake,
  Soup,
  Sparkles,
  Sprout,
  TrendingUp,
  Trees,
  Users,
  Utensils,
  Waves,
  Wifi,
} from "lucide-react";

/**
 * Core Establishment Types
 */
export const ESTABLISHMENT_TYPES = [
  {
    id: "restaurant",
    label: "Restaurant",
    sinhala: "රෙස්ටුරන්ට්",
    icon: Utensils,
    emoji: "🍽️",
    description: "Restaurants, dining and food experiences",
  },
  {
    id: "hotel",
    label: "Hotel / Resort",
    sinhala: "හෝටල් / රිසෝට්",
    icon: Hotel,
    emoji: "🏨",
    description: "Hotels, resorts and comfortable stays",
  },
  {
    id: "villa",
    label: "Private Villa",
    sinhala: "පෞද්ගලික විලා",
    icon: Home,
    emoji: "🏡",
    description: "Private villas and holiday stays",
  },
  {
    id: "guesthouse",
    label: "Guest House",
    sinhala: "ගෙස්ට් හවුස්",
    icon: Bed,
    emoji: "🛌",
    description: "Affordable, local and comfortable stays",
  },
];

/**
 * Restaurant Categories (14 Clean Taxonomy Categories)
 */
export const RESTAURANT_CATEGORIES = [
  {
    id: "sri_lankan",
    label: "Sri Lankan Food",
    sinhala: "ශ්‍රී ලාංකික ආහාර",
    emoji: "🍛",
    icon: Soup,
  },
  {
    id: "rice_curry",
    label: "Rice & Curry",
    sinhala: "බත් සහ ව්‍යංජන",
    emoji: "🍛",
    icon: Soup,
  },
  {
    id: "kottu_hoppers",
    label: "Kottu & Hoppers",
    sinhala: "කොත්තු සහ ආප්ප",
    emoji: "🥘",
    icon: Flame,
  },
  {
    id: "street_food",
    label: "Street Food",
    sinhala: "වීදි ආහාර",
    emoji: "🌯",
    icon: Flame,
  },
  {
    id: "short_eats",
    label: "Short Eats & Snacks",
    sinhala: "කෙටි ආහාර",
    emoji: "🥪",
    icon: Coffee,
  },
  {
    id: "seafood",
    label: "Seafood",
    sinhala: "මුහුදු ආහාර",
    emoji: "🐟",
    icon: Fish,
  },
  {
    id: "vegetarian",
    label: "Vegetarian",
    sinhala: "නිර්මාංශ ආහාර",
    emoji: "🥗",
    icon: Sprout,
  },
  {
    id: "indian",
    label: "Indian Food",
    sinhala: "ඉන්දියානු ආහාර",
    emoji: "🍲",
    icon: Soup,
  },
  {
    id: "chinese",
    label: "Chinese Food",
    sinhala: "චීන ආහාර",
    emoji: "🥢",
    icon: Utensils,
  },
  {
    id: "asian",
    label: "Asian Food",
    sinhala: "ආසියානු ආහාර",
    emoji: "🍜",
    icon: Utensils,
  },
  {
    id: "pizza_pasta",
    label: "Pizza & Pasta",
    sinhala: "පීසා සහ පැස්ටා",
    emoji: "🍕",
    icon: Utensils,
  },
  {
    id: "fast_food",
    label: "Fast Food",
    sinhala: "ක්ෂණික ආහාර",
    emoji: "🍔",
    icon: Utensils,
  },
  {
    id: "cafe",
    label: "Café & Coffee",
    sinhala: "කැෆේ සහ කෝපි",
    emoji: "☕",
    icon: Coffee,
  },
  {
    id: "desserts",
    label: "Desserts & Sweets",
    sinhala: "අතුරුපස සහ පැණිරස",
    emoji: "🍰",
    icon: Cake,
  },
];

/**
 * Hotel Categories (8 Practical Categories)
 */
export const HOTEL_CATEGORIES = [
  {
    id: "budget_hotel",
    label: "Budget Hotels",
    sinhala: "අඩු වියදම් හෝටල්",
    emoji: "💰",
    icon: CreditCard,
  },
  {
    id: "family_hotel",
    label: "Family Hotels",
    sinhala: "පවුල් හෝටල්",
    emoji: "👨‍👩‍👧‍👦",
    icon: Users,
  },
  {
    id: "luxury_hotel",
    label: "Luxury Hotels",
    sinhala: "සුඛෝපභෝගී හෝටල්",
    emoji: "✨",
    icon: Sparkles,
  },
  {
    id: "resort",
    label: "Resorts",
    sinhala: "රිසෝට්",
    emoji: "🏝️",
    icon: Hotel,
  },
  {
    id: "heritage_hotel",
    label: "Heritage Hotels",
    sinhala: "උරුම හෝටල්",
    emoji: "🏛️",
    icon: Building2,
  },
  {
    id: "eco_hotel",
    label: "Eco & Nature Hotels",
    sinhala: "පරිසර හිතකාමී හෝටල්",
    emoji: "🌿",
    icon: Trees,
  },
  {
    id: "lake_view_hotel",
    label: "Lake View Hotels",
    sinhala: "වැව් දර්ශන සහිත හෝටල්",
    emoji: "🌊",
    icon: Waves,
  },
  {
    id: "pilgrim_stay",
    label: "Pilgrim-Friendly Hotels",
    sinhala: "වන්දනාකරුවන් සඳහා හෝටල්",
    emoji: "🛕",
    icon: Milestone,
  },
];

/**
 * Villa Categories (6 Practical Categories)
 */
export const VILLA_CATEGORIES = [
  {
    id: "private_villa",
    label: "Private Villas",
    sinhala: "පෞද්ගලික විලා",
    emoji: "🏡",
    icon: Home,
  },
  {
    id: "family_villa",
    label: "Family Villas",
    sinhala: "පවුල් විලා",
    emoji: "👨‍👩‍👧‍👦",
    icon: Users,
  },
  {
    id: "luxury_villa",
    label: "Luxury Villas",
    sinhala: "සුඛෝපභෝගී විලා",
    emoji: "✨",
    icon: Sparkles,
  },
  {
    id: "nature_villa",
    label: "Nature Villas",
    sinhala: "ස්වභාවික පරිසර විලා",
    emoji: "🌿",
    icon: Trees,
  },
  {
    id: "lake_view_villa",
    label: "Lake View Villas",
    sinhala: "වැව් දර්ශන සහිත විලා",
    emoji: "🌊",
    icon: Waves,
  },
  {
    id: "group_villa",
    label: "Group Villas",
    sinhala: "කණ්ඩායම් විලා",
    emoji: "👥",
    icon: Users,
  },
];

/**
 * Guest House Categories (6 Practical Categories)
 */
export const GUESTHOUSE_CATEGORIES = [
  {
    id: "budget_guesthouse",
    label: "Budget Guest Houses",
    sinhala: "අඩු වියදම් ගෙස්ට් හවුස්",
    emoji: "💰",
    icon: CreditCard,
  },
  {
    id: "family_guesthouse",
    label: "Family Guest Houses",
    sinhala: "පවුල් ගෙස්ට් හවුස්",
    emoji: "👨‍👩‍👧‍👦",
    icon: Users,
  },
  {
    id: "homestay",
    label: "Local Homestays",
    sinhala: "දේශීය හෝම්ස්ටේ",
    emoji: "🏠",
    icon: Home,
  },
  {
    id: "bed_breakfast",
    label: "Bed & Breakfast",
    sinhala: "උදේ ආහාරය සහිත නවාතැන්",
    emoji: "🍳",
    icon: Coffee,
  },
  {
    id: "pilgrim_guesthouse",
    label: "Pilgrim Guest Houses",
    sinhala: "වන්දනාකරුවන් සඳහා ගෙස්ට් හවුස්",
    emoji: "🛕",
    icon: Milestone,
  },
  {
    id: "nature_guesthouse",
    label: "Nature Guest Houses",
    sinhala: "ස්වභාවික පරිසර ගෙස්ට් හවුස්",
    emoji: "🌿",
    icon: Trees,
  },
];

/**
 * Restaurant Services & Facilities (12 Clean Operational Amenities)
 */
export const RESTAURANT_SERVICES = [
  {
    id: "dine_in",
    label: "Dine-In",
    sinhala: "අවන්හල තුළ ආහාර ගැනීම",
    emoji: "🍽️",
    icon: Utensils,
  },
  {
    id: "takeaway",
    label: "Takeaway",
    sinhala: "රැගෙන යාම",
    emoji: "🥡",
    icon: Utensils,
  },
  {
    id: "delivery",
    label: "Food Delivery",
    sinhala: "ආහාර බෙදාහැරීම",
    emoji: "🛵",
    icon: TrendingUp,
  },
  {
    id: "table_reservation",
    label: "Table Reservation",
    sinhala: "මේස වෙන්කරවා ගැනීම",
    emoji: "📅",
    icon: Columns,
  },
  {
    id: "parking",
    label: "Parking",
    sinhala: "වාහන නැවැත්වීම",
    emoji: "🅿️",
    icon: Car,
  },
  {
    id: "wifi",
    label: "Free Wi-Fi",
    sinhala: "නොමිලේ Wi-Fi",
    emoji: "📶",
    icon: Wifi,
  },
  {
    id: "air_conditioned",
    label: "Air Conditioned",
    sinhala: "වායු සමීකරණය",
    emoji: "❄️",
    icon: Snowflake,
  },
  {
    id: "outdoor_seating",
    label: "Outdoor Seating",
    sinhala: "එළිමහන් අසුන්",
    emoji: "🌳",
    icon: Trees,
  },
  {
    id: "family_friendly",
    label: "Family Friendly",
    sinhala: "පවුලට සුදුසු",
    emoji: "👨‍👩‍👧‍👦",
    icon: Users,
  },
  {
    id: "wheelchair_accessible",
    label: "Wheelchair Accessible",
    sinhala: "රෝද පුටු පහසුකම්",
    emoji: "♿",
    icon: Accessibility,
  },
  {
    id: "card_payment",
    label: "Card Payment",
    sinhala: "කාඩ්පත් ගෙවීම්",
    emoji: "💳",
    icon: CreditCard,
  },
  {
    id: "live_music",
    label: "Live Music",
    sinhala: "සජීවී සංගීතය",
    emoji: "🎵",
    icon: Music,
  },
];

/**
 * Sri Lankan Districts System (Scoped to North Central Province)
 */
export const SRI_LANKAN_DISTRICTS = [
  { id: "anuradhapura", label: "Anuradhapura", sinhala: "අනුරාධපුරය", emoji: "🏛️", icon: MapPin },
  { id: "polonnaruwa", label: "Polonnaruwa", sinhala: "පොළොන්නරුව", emoji: "🏛️", icon: Compass },
];

export { getCitiesByDistrict, SRI_LANKA_REGIONS } from "../../data/locationRegistry";

/* Core Infrastructure Guard Constraints */
export const MAX_PHOTOS = 5;
export const MAX_CATEGORIES = 4;

/* API Routing Gateway Endpoints */
export const API_ENDPOINT = "/api/partners/register";

/**
 * Cross-Reference Dictionary Maps
 */
export const CATEGORY_MAP = {
  restaurant: RESTAURANT_CATEGORIES,
  hotel: HOTEL_CATEGORIES,
  villa: VILLA_CATEGORIES,
  guesthouse: GUESTHOUSE_CATEGORIES,
};

export const CATEGORY_TITLE_MAP = {
  restaurant: "Food Categories",
  hotel: "Hotel Classifications",
  villa: "Villa Types",
  guesthouse: "Guest House Types",
};

/**
 * Backward compatibility resolver for legacy category IDs
 */
export const normalizeCategoryId = (catId = "") => {
  const map = {
    rice_curry_traditional: "rice_curry",
    street_kottu_hoppers: "kottu_hoppers",
    asian_noodles: "asian",
    indian_spice: "indian",
    pasta_pizza: "pizza_pasta",
    sweet_snacks: "desserts",
    tourist_fast_food: "fast_food",
    tea_snacks: "cafe",
    fresh_fish_local: "seafood",
    vegetarian_pilgrim: "vegetarian",
    heritage_hotels: "heritage_hotel",
    temple_area_hotels: "pilgrim_stay",
    wewa_lake_hotels: "lake_view_hotel",
    budget_pilgrim_hotels: "budget_hotel",
    family_group_hotels: "family_hotel",
    nature_eco_hotels: "eco_hotel",
    modern_comfort_hotels: "luxury_hotel",
    pool_relax_hotels: "resort",
    romantic_quiet_stays: "resort",
    private_family_villas: "family_villa",
    wewa_view_villas: "lake_view_villa",
    heritage_villas: "private_villa",
    eco_nature_villas: "nature_villa",
    budget_group_villas: "group_villa",
    modern_comfort_villas: "luxury_villa",
    pilgrim_guesthouses: "pilgrim_guesthouse",
    budget_lodges: "budget_guesthouse",
    homestays_local: "homestay",
    temple_rest_stays: "pilgrim_guesthouse",
    bed_breakfast_stays: "bed_breakfast",
    wheelchair_access: "wheelchair_accessible",
    reservation: "table_reservation",
  };
  return map[catId] || catId;
};
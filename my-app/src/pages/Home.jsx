import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BedDouble,
  Building2,
  Camera,
  Compass,
  Heart,
  House,
  MapPin,
  Search,
  Sparkles,
  Utensils,
  X
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PriceFilter from "../components/FilterSection";
import Navigation from "../components/NavigationPage";
import { useSiteUserAuthStore } from "../store/siteUserAuthStore";

// Popular Districts in Sri Lanka for locating destinations
const SriLankanDistricts = [
  { id: "anuradhapura", label: "Anuradhapura", sinhala: "අනුරාධපුරය", keywords: ["anuradhapura", "anuradhapuraya", "new town", "sacred city"] },
  { id: "polonnaruwa", label: "Polonnaruwa", sinhala: "පොළොන්නරුව", keywords: ["polonnaruwa", "polonnaruwaya", "kaduruwela", "minneriya"] },
  
];

// Predefined curated cravings for Restaurants
const SriLankanCravings = [
  {
    id: "rice_curry_traditional",
    label: "Traditional Rice & Curry",
    sinhala: "සාම්ප්‍රදායික බත් සහ ව්‍යංජන",
    emoji: "🍛",
    keywords: ["rice and curry", "bath", "sri lankan food", "traditional meal", "home food", "local food"]
  },

  

  {
    id: "street_kottu_hoppers",
    label: "Kottu, Hoppers & Street Food",
    sinhala: "කොත්තු, ආප්ප සහ වීදි ආහාර",
    emoji: "🥘",
    keywords: ["kottu", "hoppers", "appa", "roti", "street food", "wade", "short eats"]
  },

  {
    id: "lake_view_dining",
    label: "Lake View Dining (Wewa Side)",
    sinhala: "වැව් අද්දර ආහාර",
    emoji: "🌊",
    keywords: ["lake view", "wewa", "tank view restaurant", "scenic dining", "sunset food", "nature view"]
  },

  {
    id: "local_buffet_hotels",
    label: "Hotel Buffets & Tourist Meals",
    sinhala: "හෝටල් බුෆේ සහ සංචාරක ආහාර",
    emoji: "🍽️",
    keywords: ["buffet", "hotel food", "tourist meal", "breakfast buffet", "lunch buffet"]
  },

  {
    id: "fresh_fish_local",
    label: "Fresh Fish & Village Food",
    sinhala: "නැවුම් මාළු සහ ගමේ ආහාර",
    emoji: "🐟",
    keywords: ["fish curry", "fresh fish", "village food", "lake fish", "home cooked"]
  },

  {
    id: "vegetarian_pilgrim",
    label: "Vegetarian & Pilgrim Meals",
    sinhala: "නිර්මාංශ සහ පූජා ආහාර",
    emoji: "🥗",
    keywords: ["vegetarian", "vegan", "pilgrim food", "temple offering food", "simple meals"]
  },

  {
    id: "tea_snacks",
    label: "Tea Shops & Local Snacks",
    sinhala: "තේ කඩ සහ කෙටි ආහාර",
    emoji: "🍵",
    keywords: ["tea shop", "milk tea", "coffee", "short eats", "bun", "snacks", "bakery"]
  }
];
const InternationalCravings = [
  {
    id: "tourist_fast_food",
    label: "Fast Food & Quick Meals",
    sinhala: "ක්ෂණික ආහාර",
    emoji: "🍔",
    keywords: ["burger", "pizza", "fries", "fast food", "quick meal", "snack", "takeaway"]
  },

  {
    id: "asian_noodles",
    label: "Asian Noodles & Fried Rice",
    sinhala: "ආසියානු නූඩ්ල්ස් සහ රයිස්",
    emoji: "🥢",
    keywords: ["noodles", "fried rice", "chinese", "asian food", "chop suey", "stir fry"]
  },

  {
    id: "indian_spice",
    label: "Indian Spicy Meals",
    sinhala: "ඉන්දියානු කුළුබඩු ආහාර",
    emoji: "🌶️",
    keywords: ["indian", "biryani", "curry", "naan", "tandoori", "spicy food", "masala"]
  },

  {
    id: "pasta_pizza",
    label: "Pasta & Pizza (Tourist Food)",
    sinhala: "පැස්ටා සහ පීසා",
    emoji: "🍕",
    keywords: ["pasta", "pizza", "italian", "spaghetti", "lasagna", "western food"]
  },

  {
    id: "sweet_snacks",
    label: "Desserts & Sweet Snacks",
    sinhala: "පැණිරස සහ කෙටි ආහාර",
    emoji: "🍰",
    keywords: ["cake", "ice cream", "dessert", "sweet", "bakery", "chocolate", "waffle"]
  },

  {
    id: "healthy_light_meals",
    label: "Healthy & Light Meals",
    sinhala: "සෞඛ්‍යදායක ආහාර",
    emoji: "🥗",
    keywords: ["healthy", "salad", "vegetarian", "vegan", "fruit", "light meal", "organic"]
  }
];

// Curated Lodging Categories for Hotels
const HotelCategories = [
  {
    id: "heritage_hotels",
    label: "Heritage & Historical Hotels",
    sinhala: "උරුම සහ ඓතිහාසික හෝටල්",
    emoji: "🏛️",
    keywords: ["heritage", "historical", "ancient city", "ruins view", "temple area", "anuradhapura", "polonnaruwa"]
  },

  {
    id: "temple_area_hotels",
    label: "Temple Area Hotels",
    sinhala: "පන්සල් අසල හෝටල්",
    emoji: "🛕",
    keywords: ["temple", "near temple", "ruwanwelisaya", "jaya sri maha bodhi", "polonnaruwa temple", "pilgrim"]
  },

  {
    id: "wewa_lake_hotels",
    label: "Lake View (Wewa) Hotels",
    sinhala: "වැව් අද්දර හෝටල්",
    emoji: "🌊",
    keywords: ["wewa", "lake", "tank view", "waterfront", "sunset view", "scenic lake"]
  },

  {
    id: "budget_pilgrim_hotels",
    label: "Budget & Pilgrim Stay",
    sinhala: "පූජා සහ අඩු වියදම් නවාතැන්",
    emoji: "💰",
    keywords: ["budget", "cheap", "pilgrim", "basic stay", "guest house", "affordable"]
  },

  {
    id: "family_group_hotels",
    label: "Family & Group Hotels",
    sinhala: "පවුල් සහ කණ්ඩායම් හෝටල්",
    emoji: "👨‍👩‍👧‍👦",
    keywords: ["family", "group", "large room", "tour group", "kids friendly"]
  },

  {
    id: "nature_eco_hotels",
    label: "Nature & Eco Stays",
    sinhala: "ස්වභාවික සහ පරිසර හෝටල්",
    emoji: "🌿",
    keywords: ["eco", "nature", "forest", "green", "wildlife", "quiet stay"]
  },

  {
    id: "modern_comfort_hotels",
    label: "Modern Comfort Hotels",
    sinhala: "නවීන පහසුකම් සහිත හෝටල්",
    emoji: "🏨",
    keywords: ["modern", "air condition", "wifi", "comfort", "standard hotel", "city hotel"]
  },

  {
    id: "pool_relax_hotels",
    label: "Relax & Pool Hotels",
    sinhala: "විවේක සහ පිහිනුම් තටාක හෝටල්",
    emoji: "🏊",
    keywords: ["pool", "swimming pool", "relax", "spa", "resort style"]
  },

  {
    id: "romantic_quiet_stays",
    label: "Romantic & Quiet Stays",
    sinhala: "ශාන්තිමත් සහ යුවළන් සඳහා",
    emoji: "❤️",
    keywords: ["romantic", "couple", "quiet", "private stay", "honeymoon", "peaceful"]
  }
];
// Curated Lodging Categories for Villas
const VillaCategories = [
  {
    id: "heritage_villas",
    label: "Heritage Area Villas",
    sinhala: "ඓතිහාසික ප්‍රදේශ විලා",
    emoji: "🏛️",
    keywords: ["heritage", "ancient city", "ruins", "anuradhapura", "polonnaruwa", "temple area stay"]
  },

  {
    id: "pilgrim_villas",
    label: "Pilgrim & Temple Stay Villas",
    sinhala: "පූජා සහ පන්සල් නවාතැන් විලා",
    emoji: "🛕",
    keywords: ["pilgrim", "temple stay", "religious visit", "budget stay", "near temple", "sacred city"]
  },

  {
    id: "wewa_view_villas",
    label: "Lake View Villas (Wewa Side)",
    sinhala: "වැව් අද්දර විලා",
    emoji: "🌊",
    keywords: ["lake view", "wewa", "tank view", "waterfront", "sunset", "scenic"]
  },

  {
    id: "private_family_villas",
    label: "Private Family Villas",
    sinhala: "පවුලේ පෞද්ගලික විලා",
    emoji: "👨‍👩‍👧‍👦",
    keywords: ["family", "group stay", "private villa", "kitchen", "large villa", "holiday home"]
  },

  {
    id: "eco_nature_villas",
    label: "Eco & Nature Villas",
    sinhala: "ස්වභාවික පරිසර විලා",
    emoji: "🌿",
    keywords: ["eco", "nature", "forest", "green", "quiet", "wildlife", "natural stay"]
  },

  {
    id: "budget_group_villas",
    label: "Budget Group Villas",
    sinhala: "අඩු වියදම් කණ්ඩායම් විලා",
    emoji: "💰",
    keywords: ["budget", "cheap", "group stay", "affordable", "tour group", "shared villa"]
  },

  {
    id: "modern_comfort_villas",
    label: "Modern Comfort Villas",
    sinhala: "නවීන පහසුකම් විලා",
    emoji: "🏡",
    keywords: ["modern", "air condition", "wifi", "comfort", "luxury villa", "standard villa"]
  }
];

// Curated Lodging Categories for Guest Houses
const GuestHouseCategories = [
  {
    id: "pilgrim_guesthouses",
    label: "Pilgrim Guest Houses",
    sinhala: "වන්දනාකරුවන්ගේ ගෙස්ට් හවුස්",
    emoji: "🏛️",
    keywords: ["pilgrim", "temple stay", "dharmasala", "sacred city", "anuradhapura", "polonnaruwa", "religious stay"]
  },

  {
    id: "budget_lodges",
    label: "Budget Rooms & Lodges",
    sinhala: "අඩු වියදම් කාමර සහ ලොජ්",
    emoji: "🛌",
    keywords: ["budget", "cheap", "room", "lodge", "affordable stay", "low cost", "basic room"]
  },

  {
    id: "homestays_local",
    label: "Local Homestays",
    sinhala: "දේශීය හෝම්ස්ටේ",
    emoji: "🤝",
    keywords: ["homestay", "local host", "family stay", "local house", "authentic stay"]
  },

  {
    id: "temple_rest_stays",
    label: "Temple Area Rest Houses",
    sinhala: "පන්සල් අසල විවේක නවාතැන්",
    emoji: "🛕",
    keywords: ["temple", "rest house", "near temple", "ruwanwelisaya", "jaya sri maha bodhi", "polonnaruwa temple"]
  },

  {
    id: "dharma_stays",
    label: "Dharma & Meditation Stays",
    sinhala: "ධර්ම සහ භාවනා නවාතැන්",
    emoji: "🧘",
    keywords: ["meditation", "dharma", "peaceful stay", "silent stay", "monastery", "serenity"]
  },

  {
    id: "family_group_rooms",
    label: "Family & Group Rooms",
    sinhala: "පවුල් සහ කණ්ඩායම් කාමර",
    emoji: "👨‍👩‍👧‍👦",
    keywords: ["family", "group", "large room", "group booking", "tour group", "shared stay"]
  },

  {
    id: "bed_breakfast_stays",
    label: "Bed & Breakfast (B&B)",
    sinhala: "උදේ ආහාරය සහිත නවාතැන්",
    emoji: "🍳",
    keywords: ["bed and breakfast", "b&b", "breakfast included", "morning meal", "guest breakfast"]
  },

  {
    id: "simple_comfort_stays",
    label: "Simple Comfort Stays",
    sinhala: "සරල පහසු නවාතැන්",
    emoji: "🏡",
    keywords: ["simple stay", "clean room", "comfort", "wifi", "air condition", "standard room"]
  }
];

// Service options for restaurants (Dine-in, Delivery, Wi-Fi, etc.)
const RestaurantServices = [
  { id: "dine_in", label: "Dine-In Available", sinhala: "අවන්හල තුළ ආහාර ගැනීමට හැක", emoji: "🍽️", keywords: ["dine in", "eat in", "table service"] },
  { id: "takeaway", label: "Takeaway Available", sinhala: "රැගෙන යාමට හැක", emoji: "🥡", keywords: ["takeaway", "take out", "pickup", "parcel"] },
  { id: "delivery", label: "Delivery Available", sinhala: "නිවසට ගෙන්වා ගැනීම", emoji: "🛵", keywords: ["delivery", "home delivery", "food delivery"] },
  { id: "reservation", label: "Table Reservation", sinhala: "මේස වෙන්කරවා ගැනීම", emoji: "📅", keywords: ["reservation", "book table", "table booking"] },
  { id: "parking", label: "Parking Available", sinhala: "වාහන නැවතුම් පහසුකම්", emoji: "🅿️", keywords: ["parking", "car park", "vehicle parking"] },
  { id: "wifi", label: "Free Wi-Fi", sinhala: "නොමිලේ Wi-Fi", emoji: "📶", keywords: ["wifi", "free wifi", "internet"] },
  { id: "air_conditioned", label: "Air Conditioned", sinhala: "වායු සමීකරණය සහිත", emoji: "❄️", keywords: ["air conditioned", "ac", "aircon"] },
  { id: "outdoor_seating", label: "Outdoor Seating", sinhala: "එළිමහන් අසුන්", emoji: "🌳", keywords: ["outdoor", "garden", "open air", "outdoor seating"] },
  { id: "family_friendly", label: "Family Friendly", sinhala: "පවුලට සුදුසු", emoji: "👨‍👩‍👧‍👦", keywords: ["family", "kids", "children", "family friendly"] },
  { id: "wheelchair_access", label: "Wheelchair Accessible", sinhala: "රෝද පුටුවට පහසුකම් ඇත", emoji: "♿", keywords: ["wheelchair", "accessible", "disabled access"] },
  { id: "pet_friendly", label: "Pet Friendly", sinhala: "සුරතල් සතුන්ට අවසර ඇත", emoji: "🐶", keywords: ["pet friendly", "pets allowed"] },
  { id: "live_music", label: "Live Music", sinhala: "සජීවී සංගීතය", emoji: "🎶", keywords: ["live music", "band", "music"] },
  { id: "card_payment", label: "Card Payment", sinhala: "කාඩ්පත් ගෙවීම්", emoji: "💳", keywords: ["card", "visa", "mastercard", "credit card"] },
  { id: "cashless_payment", label: "Digital Payment", sinhala: "ඩිජිටල් ගෙවීම්", emoji: "📱", keywords: ["digital payment", "qr payment", "mobile payment"] },
  { id: "open_now", label: "Open Now", sinhala: "දැන් විවෘතයි", emoji: "🟢", keywords: ["open now", "currently open"] },
  {
  id: "couple_friendly",
  label: "Couple Friendly",
  sinhala: "යුවළන්ට සුදුසුයි",
  emoji: "❤️",
  keywords: [
    "couple",
    "romantic",
    "date",
    "couple friendly",
    "romantic dining"
  ]
},
{
  id: "birthday_party",
  label: "Birthday Parties",
  sinhala: "උපන්දිනය සැමරීමට සුදුසුයි",
  emoji: "🎂",
  keywords: [
    "birthday",
    "party",
    "celebration"
  ]
},
  { id: "twenty_four_hours", label: "24 Hours Open", sinhala: "පැය 24 විවෘතයි", emoji: "🕛", keywords: ["24 hours", "open 24 hours", "all day"] }
];

 const heroSlides = [
  {
    image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1600&q=80",
    eyebrow: "Anuradhapura • Sacred city heritage",
    title: "Walk through the ancient kingdom of Anuradhapura",
    subtitle: "Explore sacred stupas, ancient monasteries, and timeless ruins that shaped Sri Lanka's earliest civilization.",
    sinhalaSubtitle: "පුරාණ රාජධානියේ සුවිශේෂී උරුමයන් හා සංකේතයන් අත්දැකීම්",
  },
  {
    image: "https://images.unsplash.com/photo-1623052304870-1c7f8b7f1f66?auto=format&fit=crop&w=1600&q=80",
    eyebrow: "Polonnaruwa • Ancient royal city",
    title: "Discover the glory of Polonnaruwa's stone heritage",
    subtitle: "From Gal Vihara Buddha statues to royal palaces, experience the brilliance of Sri Lanka's medieval capital.",
    sinhalaSubtitle: "ගල් විහාරයේම පින්තූර හා රාජකীয় විහාරස්ථාන අතරින් යන කාලගුණවත් සංචාරය",
  },
  {
    image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1600&q=80",
    eyebrow: "Cultural triangle • Sri Lanka",
    title: "Ancient kingdoms, lakes, and sacred landscapes",
    subtitle: "Travel through Anuradhapura, Polonnaruwa, and surrounding heritage sites filled with history and spirituality.",
    sinhalaSubtitle: "පුරාණ නගර, වැව සහ පූජාස්ථානවලින් යුත් සුවිශේෂී සංචාරයකට පිවිසෙන්න",
  },
];


const getShopImageSet = (shop) => {
  const primary = shop.photo ? `http://localhost:5000${shop.photo}` : null;
  const type = (shop.shopType || "restaurant").toLowerCase();
  const typeImages = {
    restaurant: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80",
    ],
    hotel: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
    ],
    villa: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
    ],
    guesthouse: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
    ],
  };

  const images = [primary, ...typeImages[type] || typeImages.restaurant].filter(Boolean);
  return Array.from(new Set(images));
};

function PremiumDestinationCard({ shop, categories = [], onViewMenu }) {
  const [activeImage, setActiveImage] = useState(0);
  const [hovered, setHovered] = useState(false);
  const images = getShopImageSet(shop);

  useEffect(() => {
    if (!images.length || images.length === 1) return undefined;
    const interval = window.setInterval(() => {
      setActiveImage((prev) => (prev + 1) % images.length);
    }, 3600);
    return () => window.clearInterval(interval);
  }, [images.length]);

  const typeLabel = (shop.shopType || "restaurant").toLowerCase();
  const badgeText =
    typeLabel === "hotel"
      ? "Luxury Stay"
      : typeLabel === "villa"
        ? "Private Villa"
        : typeLabel === "guesthouse"
          ? "Budget Friendly"
          : "Trending";

  const rating = Number(shop.rating || (typeLabel === "restaurant" ? 4.7 : 4.8)).toFixed(1);
  const priceRange = shop.priceRange || "LKR 1800+";
  const tags = [
    shop.shopType === "hotel" ? "Lake View" : "Signature",
    shop.location || "Sri Lanka",
    categories[0]?.name || "Curated pick",
  ];

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.01, boxShadow: "0 30px 90px -30px rgba(15,23,42,0.35)" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)]"
    >
      <div className="relative overflow-hidden">
        <div className="aspect-[4/3] overflow-hidden">
          <motion.img
            key={images[activeImage]}
            src={images[activeImage]}
            alt={shop.name}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: hovered ? 1.06 : 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/10 to-transparent" />
        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-white backdrop-blur-md">
          <BadgeCheck size={12} />
          {badgeText}
        </div>
        <button
          type="button"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/15 text-white backdrop-blur-md transition hover:bg-white/25"
          aria-label="Save destination"
        >
          <Heart size={16} />
        </button>
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-full border border-white/15 bg-slate-950/40 px-2.5 py-1 text-[11px] font-medium text-white/90 backdrop-blur">
            <Camera size={12} />
            {images.length} photos
          </div>
          <div className="flex gap-1.5">
            {images.map((_, index) => (
              <span
                key={`${shop._id}-${index}`}
                className={`h-1.5 rounded-full transition-all ${index === activeImage ? "w-5 bg-white" : "w-1.5 bg-white/50"}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-600">
              {typeLabel === "hotel" ? "Luxury stay" : typeLabel === "villa" ? "Private villa" : typeLabel === "guesthouse" ? "Guest house" : "Dining spot"}
            </p>
            <h3 className="mt-1 text-xl font-bold text-slate-900">{shop.name}</h3>
          </div>
          <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
            {rating} ★
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
          <MapPin size={15} className="text-emerald-600" />
          <span className="line-clamp-1">{shop.address || shop.location || "Sri Lanka"}</span>
        </div>

        <p className="mt-3 text-sm leading-6 text-slate-600 line-clamp-3">
          {shop.description || "Curated for travelers seeking a refined stay and memorable local flavors."}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-600">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3">
          <div>
            <div className="text-[11px] uppercase tracking-[0.25em] text-slate-400">From</div>
            <div className="text-lg font-semibold text-slate-900">{priceRange}</div>
          </div>
          <button
            type="button"
            onClick={() => onViewMenu(shop)}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            View details
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

function Home() {
  const [shops, setShops] = useState([]);
  const [shopCategories, setShopCategories] = useState({});
  const [selectedShop, setSelectedShop] = useState(null);
  const [foods, setFoods] = useState([]);
  const [loadingShops, setLoadingShops] = useState(true);
  const [loadingFoods, setLoadingFoods] = useState(false);

  // Staging Filters (Apply only when clicking "Search suitable restaurants/hotels")
  const [tempFindWhat, setTempFindWhat] = useState("restaurant"); // "restaurant", "hotel", "villa", or "guesthouse"
  const [tempPriceFilter, setTempPriceFilter] = useState({ min: 0, max: 5000 });
  const [tempSelectedDistricts, setTempSelectedDistricts] = useState([]); // Selected district IDs
  const [tempSelectedCravings, setTempSelectedCravings] = useState([]); // Selected subcategory/craving IDs
  const [tempSelectedServices, setTempSelectedServices] = useState([]); // Selected restaurant service IDs

  // Applied Filters (Used in filter computations for the grid)
  const [appliedFindWhat, setAppliedFindWhat] = useState("restaurant");
  const [appliedPriceFilter, setAppliedPriceFilter] = useState({ min: 0, max: 5000 });
  const [appliedDistricts, setAppliedDistricts] = useState([]);
  const [appliedCravings, setAppliedCravings] = useState([]);
  const [appliedServices, setAppliedServices] = useState([]);

  const navigate = useNavigate();
  const resultsRef = useRef(null);
  const user = useSiteUserAuthStore((state) => state.user);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => window.clearInterval(interval);
  }, []);

  // Fetch shops/hotels and categories
  useEffect(() => {
    let isMounted = true;
    async function fetchShopsAndCategories() {
      setLoadingShops(true);
      try {
        const res = await fetch("http://localhost:5000/api/shops/all");
        if (!res.ok) throw new Error("Failed to fetch shops");
        const data = await res.json();
        const shopList = Array.isArray(data) ? data : data.shops || [];
        if (isMounted) setShops(shopList);

        const categoriesEntries = await Promise.all(
          shopList.map(async (shop) => {
            try {
              const catRes = await fetch(
                `http://localhost:5000/api/categories/shop/${shop._id}`
              );
              if (!catRes.ok) throw new Error();
              const categories = await catRes.json();
              return [shop._id, categories];
            } catch {
              return [shop._id, []];
            }
          })
        );
        const categoriesMap = Object.fromEntries(categoriesEntries);
        if (isMounted) setShopCategories(categoriesMap);
      } catch {
        if (isMounted) setShops([]);
      } finally {
        if (isMounted) setLoadingShops(false);
      }
    }

    fetchShopsAndCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleViewFoods = (shopObj) => {
    setSelectedShop(shopObj);
    setLoadingFoods(true);
    fetch(`http://localhost:5000/api/food?shopId=${shopObj._id}`)
      .then((res) => res.json())
      .then((data) => {
        setFoods(Array.isArray(data) ? data : data.foods || []);
        setLoadingFoods(false);
      })
      .catch(() => setLoadingFoods(false));
  };

  // Toggle district staging selection
  const handleDistrictToggle = (districtId) => {
    setTempSelectedDistricts((prev) =>
      prev.includes(districtId)
        ? prev.filter((id) => id !== districtId)
        : [...prev, districtId]
    );
  };

  // Toggle category staging selection
  const handleCravingToggle = (cravingId) => {
    setTempSelectedCravings((prev) =>
      prev.includes(cravingId)
        ? prev.filter((id) => id !== cravingId)
        : [...prev, cravingId]
    );
  };

  // Toggle service staging selection (restaurant services)
  const handleServiceToggle = (serviceId) => {
    setTempSelectedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]
    );
  };

  // Switch Find What (Stays temporary until Search is submitted)
  const handleFindWhatChange = (type) => {
    setTempFindWhat(type);
    setTempSelectedCravings([]); // Clear subcategories when switching main type
    setTempSelectedServices([]); // Clear services when switching
  };

  // Reset staging and applied filters
  const handleResetFilters = () => {
    setTempFindWhat("restaurant");
    setTempPriceFilter({ min: 0, max: 5000 });
    setTempSelectedDistricts([]);
    setTempSelectedCravings([]);
    setTempSelectedServices([]);

    setAppliedFindWhat("restaurant");
    setAppliedPriceFilter({ min: 0, max: 5000 });
    setAppliedDistricts([]);
    setAppliedCravings([]);
    setAppliedServices([]);
  };

  // Submit and apply filter configurations
  const handleSearchSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setAppliedFindWhat(tempFindWhat);
    setAppliedPriceFilter(tempPriceFilter);
    setAppliedDistricts(tempSelectedDistricts);
    setAppliedCravings(tempSelectedCravings);
    setAppliedServices(tempSelectedServices);
    window.setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  };

  // Check if shop matches selected districts
  const matchesDistrictKeywords = (shop, districtId) => {
    const district = SriLankanDistricts.find(d => d.id === districtId);
    if (!district) return false;

    const shopNameLower = shop.name.toLowerCase();
    const shopAddressLower = (shop.address || "").toLowerCase();
    const shopDescriptionLower = (shop.description || "").toLowerCase();

    return district.keywords.some(keyword =>
      shopNameLower.includes(keyword) ||
      shopAddressLower.includes(keyword) ||
      shopDescriptionLower.includes(keyword)
    );
  };

  // Check if shop matches the selected establishment type (Restaurant, Hotel, Villa, Guest House)
  const matchesEstablishmentType = (shop, type) => {
    const shopType = (shop.shopType || "restaurant").toLowerCase();
    const nameLower = shop.name.toLowerCase();
    const descLower = (shop.description || "").toLowerCase();
    const dbCategories = shopCategories[shop._id] || [];
    const dbCatsStr = dbCategories.map(cat => cat.name.toLowerCase()).join(" ");

    if (type === "restaurant") {
      return shopType === "restaurant";
    }

    // For accommodation types, shop.shopType must be "hotel"
    if (shopType !== "hotel") return false;

    if (type === "villa") {
      const villaKeywords = ["villa", "bungalow", "cabana", "chalet", "private resort", "private stay", "cottage", "holiday home"];
      return villaKeywords.some(kw => 
        nameLower.includes(kw) || 
        descLower.includes(kw) || 
        dbCatsStr.includes(kw)
      );
    }

    if (type === "guesthouse") {
      const guesthouseKeywords = ["guest", "guesthouse", "room", "rooms", "lodge", "inn", "budget", "pilgrim", "hostel", "homestay", "bed & breakfast", "b&b"];
      return guesthouseKeywords.some(kw => 
        nameLower.includes(kw) || 
        descLower.includes(kw) || 
        dbCatsStr.includes(kw)
      );
    }

    if (type === "hotel") {
      // General/luxury Hotel/Resort. 
      // Avoid overlaps by ensuring it does not contain explicit villa/guesthouse keywords,
      // or if it explicitly matches hotel/resort/spa.
      const isVilla = ["villa", "bungalow", "cabana", "private resort", "holiday home"].some(kw => 
        nameLower.includes(kw) || dbCatsStr.includes(kw)
      );
      const isGuest = ["guest", "guesthouse", "hostel", "homestay", "pilgrim", "budget room"].some(kw => 
        nameLower.includes(kw) || dbCatsStr.includes(kw)
      );
      
      const hasHotelKeywords = ["hotel", "resort", "spa", "luxury", "star"].some(kw => 
        nameLower.includes(kw) || dbCatsStr.includes(kw)
      );
      
      return hasHotelKeywords || (!isVilla && !isGuest);
    }

    return false;
  };

  // Check if shop matches selected category criteria
  const matchesCategoryKeywords = (shop, cravingId, findWhat) => {
    let categoriesList = [];
    if (findWhat === "restaurant") {
      categoriesList = [...SriLankanCravings, ...InternationalCravings];
    } else if (findWhat === "hotel") {
      categoriesList = HotelCategories;
    } else if (findWhat === "villa") {
      categoriesList = VillaCategories;
    } else if (findWhat === "guesthouse") {
      categoriesList = GuestHouseCategories;
    }

    const category = categoriesList.find(c => c.id === cravingId);
    if (!category) return false;

    const shopNameLower = shop.name.toLowerCase();
    const shopDescLower = (shop.description || "").toLowerCase();
    const dbCategories = shopCategories[shop._id] || [];

    return category.keywords.some(keyword => {
      const matchName = shopNameLower.includes(keyword);
      const matchDesc = shopDescLower.includes(keyword);
      const matchDbCat = dbCategories.some(cat => cat.name.toLowerCase().includes(keyword));
      return matchName || matchDesc || matchDbCat;
    });
  };

  // Check if shop matches selected service criteria (for restaurants)
  const matchesServiceKeywords = (shop, serviceId) => {
    const service = RestaurantServices.find(s => s.id === serviceId);
    if (!service) return false;

    const shopNameLower = shop.name.toLowerCase();
    const shopDescLower = (shop.description || "").toLowerCase();
    const dbCategories = shopCategories[shop._id] || [];
    const dbCatsStr = dbCategories.map(cat => cat.name.toLowerCase()).join(" ");

    return service.keywords.some(keyword =>
      shopNameLower.includes(keyword) ||
      shopDescLower.includes(keyword) ||
      dbCatsStr.includes(keyword)
    );
  };

  // === FILTER LOGIC ===
  const filteredShops = shops.filter((shop) => {
    // 1. Filter by Establishment Type
    const matchShopType = matchesEstablishmentType(shop, appliedFindWhat);

    // 2. District Location Filter
    const matchesDistrict =
      appliedDistricts.length === 0 ||
      appliedDistricts.some(districtId => matchesDistrictKeywords(shop, districtId));

    // 3. Subcategories/Cravings Checkbox Filter
    const matchesCravings =
      appliedCravings.length === 0 ||
      appliedCravings.some(cravingId => matchesCategoryKeywords(shop, cravingId, appliedFindWhat));

    // 3b. Services (only applicable for restaurants)
    const matchesServices =
      appliedServices.length === 0 ||
      appliedFindWhat !== "restaurant" ||
      appliedServices.some(serviceId => matchesServiceKeywords(shop, serviceId));

    // 4. Budget Range Filter
    const priceRangeStr = shop.priceRange || "";
    const [minStr, maxStr] = priceRangeStr.split("-").map((s) => s.trim());
    const minPrice = parseInt(minStr, 10) || 0;
    const maxPrice = parseInt(maxStr, 10) || 0;
    const matchesPrice =
      minPrice <= appliedPriceFilter.max && maxPrice >= appliedPriceFilter.min;

    return matchShopType && matchesDistrict && matchesCravings && matchesServices && matchesPrice;
  });

  const isRestaurant = tempFindWhat === "restaurant";
  const isHotel = tempFindWhat === "hotel";
  const isVilla = tempFindWhat === "villa";
  const isGuestHouse = tempFindWhat === "guesthouse";

  const pageTransition = {
    hidden: { opacity: 0, y: 20 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay, ease: "easeOut" },
    }),
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } } }}
      className="min-h-screen bg-[linear-gradient(180deg,#f8fffb_0%,#ffffff_100%)] pb-24 text-slate-800 antialiased selection:bg-emerald-100 selection:text-emerald-900"
    >
      <Navigation />

      <main className="mx-auto max-w-7xl px-4 pt-28 sm:px-6 lg:px-8">
        <motion.section
          variants={pageTransition}
          initial="hidden"
          animate="visible"
          custom={0.05}
          className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-slate-950 shadow-[0_40px_120px_-40px_rgba(15,23,42,0.65)]"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={heroSlides[heroIndex].image}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.03 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute inset-0 overflow-hidden"
            >
              <div className="absolute inset-0 scale-105 bg-cover bg-center" style={{ backgroundImage: `url(${heroSlides[heroIndex].image})` }} />
              <img
                src={heroSlides[heroIndex].image}
                alt="Sri Lanka travel showcase"
                className="h-full w-full object-cover opacity-0"
                aria-hidden="true"
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.32),transparent_32%),linear-gradient(105deg,rgba(2,6,23,0.92)_0%,rgba(2,6,23,0.74)_42%,rgba(2,6,23,0.28)_100%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,transparent_32%,rgba(2,6,23,0.18)_100%)]" />
              <div className="absolute -left-16 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-emerald-400/20 blur-[120px]" />
              <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-400/10 blur-[140px]" />
            </motion.div>
          </AnimatePresence>

          <div className="relative z-10 flex min-h-[640px] flex-col justify-between p-6 sm:p-8 lg:p-10">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-100 backdrop-blur-lg">
                <Sparkles size={13} />
                Ceylon Calling • Premium Travel Discovery
              </div>
              <div className="hidden items-center gap-2 md:flex">
                {heroSlides.map((slide, index) => (
                  <button
                    key={slide.image}
                    type="button"
                    onClick={() => setHeroIndex(index)}
                    className={`h-2.5 rounded-full transition-all ${index === heroIndex ? "w-8 bg-white" : "w-2.5 bg-white/45"}`}
                    aria-label={`Show slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <AnimatePresence mode="wait">
                <motion.div
                  key={heroSlides[heroIndex].image}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                  className="max-w-2xl"
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-300">
                    {heroSlides[heroIndex].eyebrow}
                  </p>
                  <h1 className="mt-4 text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
                    {heroSlides[heroIndex].title}
                  </h1>
                  <p className="mt-4 text-xl font-medium text-emerald-100/90 sm:text-2xl">
                    {heroSlides[heroIndex].sinhalaSubtitle}
                  </p>
                  <p className="mt-4 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
                    {heroSlides[heroIndex].subtitle}
                  </p>

                  <div className="mt-7 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                      className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_16px_50px_-20px_rgba(16,185,129,0.85)] transition hover:-translate-y-0.5 hover:bg-emerald-400"
                    >
                      <Search size={16} />
                      Search Destinations
                    </button>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {[
                      { label: "Restaurants", value: "restaurant" },
                      { label: "Hotels", value: "hotel" },
                      { label: "Villas", value: "villa" },
                      { label: "Guest Houses", value: "guesthouse" },
                    ].map((chip) => (
                      <button
                        key={chip.value}
                        type="button"
                        onClick={() => handleFindWhatChange(chip.value)}
                        className={`rounded-full border px-3.5 py-2 text-sm font-semibold transition ${tempFindWhat === chip.value ? "border-emerald-400 bg-emerald-500/20 text-emerald-100" : "border-white/15 bg-white/10 text-slate-200 hover:bg-white/15"}`}
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.1 }}
                className="rounded-[1.75rem] border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-2xl"
              >
                <div className="rounded-[1.4rem] border border-white/15 bg-slate-950/50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">Curated discovery</p>
                      <p className="mt-1 text-lg font-semibold text-white">Plan your next escape</p>
                    </div>
                    <div className="rounded-full bg-emerald-500/20 p-2 text-emerald-300">
                      <Compass size={16} />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-3 py-3">
                    <Search size={16} className="text-emerald-300" />
                    <input
                      value={tempSelectedDistricts.length > 0 ? `${tempSelectedDistricts.length} district selected` : "Try Anuradhapura, Polonnaruwa..."}
                      readOnly
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-400"
                    />
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-white">
                        <House size={14} className="text-emerald-300" />
                        Boutique stays
                      </div>
                      <p className="mt-1 text-sm text-slate-400">Heritage, lake view, and private villas.</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-white">
                        <Utensils size={14} className="text-emerald-300" />
                        Local dining
                      </div>
                      <p className="mt-1 text-sm text-slate-400">Kottu, rice & curry, and modern cafés.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        <motion.section
          variants={pageTransition}
          initial="hidden"
          animate="visible"
          custom={0.12}
          className="relative mt-10 overflow-hidden rounded-[2rem] border border-slate-200/80 bg-[linear-gradient(135deg,#fcfdfc_0%,#f7faf8_55%,#f4f7f6_100%)] p-6 shadow-[0_35px_90px_-50px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:p-8"
        >
          <div className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_58%)]" />
          <form onSubmit={handleSearchSubmit} className="relative z-10 space-y-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-700">
                  <Sparkles size={12} />
                  Smart filter suite
                </div>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Shape your ideal Sri Lanka stay</h2>
                <p className="mt-2 text-sm leading-7 text-slate-500 sm:text-base">
                  Discover the right experience with elegant, fast filters for stays, dining, districts, and budget.
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetFilters}
                className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:-translate-y-0.5 hover:bg-slate-50"
              >
                Reset filters
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-sm font-semibold text-emerald-700">1</span>
                <h3 className="text-lg font-semibold text-slate-900">What are you looking for?</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {[
                  { id: "restaurant", label: "Restaurant", subtitle: "Cuisines & dining", icon: <Utensils size={20} /> },
                  { id: "hotel", label: "Hotel / Resort", subtitle: "Luxury & comfort", icon: <Building2 size={20} /> },
                  { id: "villa", label: "Private Villa", subtitle: "Private & scenic", icon: <House size={20} /> },
                  { id: "guesthouse", label: "Guest House", subtitle: "Budget & pilgrim", icon: <BedDouble size={20} /> },
                ].map((option) => {
                  const active = tempFindWhat === option.id;
                  return (
                    <motion.button
                      key={option.id}
                      type="button"
                      whileHover={{ y: -4, scale: 1.01, boxShadow: "0 20px 50px -25px rgba(16, 185, 129, 0.35)" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleFindWhatChange(option.id)}
                      className={`rounded-[1.35rem] border p-4 text-left transition ${active ? "border-emerald-400 bg-emerald-50/80 shadow-[0_18px_45px_-28px_rgba(16,185,129,0.8)]" : "border-slate-200 bg-white/90 hover:border-slate-300 hover:bg-white"}`}
                    >
                      <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl ${active ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-700"}`}>
                        {option.icon}
                      </div>
                      <p className="text-lg font-semibold text-slate-900">{option.label}</p>
                      <p className="mt-1 text-sm text-slate-500">{option.subtitle}</p>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-sm font-semibold text-emerald-700">2</span>
                <h3 className="text-lg font-semibold text-slate-900">Choose district</h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {SriLankanDistricts.map((district) => {
                  const checked = tempSelectedDistricts.includes(district.id);
                  return (
                    <motion.label
                      key={district.id}
                      whileHover={{ y: -2, scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex cursor-pointer items-center justify-between rounded-[1.15rem] border px-4 py-3 transition ${checked ? "border-emerald-300 bg-emerald-50/80 text-emerald-800 shadow-[0_16px_35px_-24px_rgba(16,185,129,0.75)]" : "border-slate-200 bg-white/80 text-slate-700 hover:bg-white"}`}
                    >
                      <div>
                        <p className="text-sm font-semibold">{district.label}</p>
                        <p className="text-[11px] text-slate-500">{district.sinhala}</p>
                      </div>
                      <input type="checkbox" checked={checked} onChange={() => handleDistrictToggle(district.id)} className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                    </motion.label>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-sm font-semibold text-emerald-700">3</span>
                <h3 className="text-lg font-semibold text-slate-900">Pick your style</h3>
              </div>
              {isRestaurant ? (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Sri Lankan favorites</h4>
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                      {SriLankanCravings.map((option) => {
                        const checked = tempSelectedCravings.includes(option.id);
                        return (
                          <motion.label
                            key={option.id}
                            whileHover={{ y: -2, scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex cursor-pointer items-center gap-3 rounded-[1.15rem] border px-3.5 py-3 transition ${checked ? "border-emerald-300 bg-emerald-50/80" : "border-slate-200 bg-white/90 hover:bg-slate-50"}`}
                          >
                            <input type="checkbox" checked={checked} onChange={() => handleCravingToggle(option.id)} className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                            <div>
                              <p className="text-sm font-semibold text-slate-800">{option.label}</p>
                              <p className="text-[11px] text-slate-500">{option.sinhala}</p>
                            </div>
                          </motion.label>
                        );
                      })}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Global cuisines</h4>
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                      {InternationalCravings.map((option) => {
                        const checked = tempSelectedCravings.includes(option.id);
                        return (
                          <motion.label
                            key={option.id}
                            whileHover={{ y: -2, scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex cursor-pointer items-center gap-3 rounded-[1.15rem] border px-3.5 py-3 transition ${checked ? "border-emerald-300 bg-emerald-50/80" : "border-slate-200 bg-white/90 hover:bg-slate-50"}`}
                          >
                            <input type="checkbox" checked={checked} onChange={() => handleCravingToggle(option.id)} className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                            <div>
                              <p className="text-sm font-semibold text-slate-800">{option.label}</p>
                              <p className="text-[11px] text-slate-500">{option.sinhala}</p>
                            </div>
                          </motion.label>
                        );
                      })}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Services & facilities</h4>
                    <div className="flex flex-wrap gap-2">
                      {RestaurantServices.map((service) => {
                        const checked = tempSelectedServices.includes(service.id);
                        return (
                          <motion.label
                            key={service.id}
                            whileHover={{ y: -2, scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            className={`cursor-pointer rounded-full border px-3.5 py-2 text-sm font-medium transition ${checked ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white/90 text-slate-600 hover:bg-slate-50"}`}
                          >
                            <input type="checkbox" checked={checked} onChange={() => handleServiceToggle(service.id)} className="sr-only" />
                            {service.label}
                          </motion.label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {(isHotel ? HotelCategories : isVilla ? VillaCategories : GuestHouseCategories).map((option) => {
                    const checked = tempSelectedCravings.includes(option.id);
                    return (
                      <motion.label
                        key={option.id}
                        whileHover={{ y: -2, scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex cursor-pointer items-center gap-3 rounded-[1.15rem] border px-3.5 py-3 transition ${checked ? "border-emerald-300 bg-emerald-50/80" : "border-slate-200 bg-white/90 hover:bg-slate-50"}`}
                      >
                        <input type="checkbox" checked={checked} onChange={() => handleCravingToggle(option.id)} className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{option.label}</p>
                          <p className="text-[11px] text-slate-500">{option.sinhala}</p>
                        </div>
                      </motion.label>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-sm font-semibold text-emerald-700">4</span>
                <h3 className="text-lg font-semibold text-slate-900">Budget range</h3>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200 bg-white/80 p-4 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.3)]">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Estimated spend</p>
                    <p className="text-xs text-slate-500">Adjust for your stay or dining budget</p>
                  </div>
                  <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                    LKR {tempPriceFilter.max}
                  </div>
                </div>
                <PriceFilter min={0} max={5000} value={tempPriceFilter} onChange={setTempPriceFilter} />
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-end">
              <button type="button" onClick={handleResetFilters} className="rounded-full border border-slate-200 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:-translate-y-0.5 hover:bg-slate-50">
                Clear all
              </button>
              <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_16px_50px_-20px_rgba(16,185,129,0.9)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_56px_-18px_rgba(16,185,129,0.95)]">
                <Search size={16} />
                Search destinations
              </button>
            </div>
          </form>
        </motion.section>

        <motion.section ref={resultsRef} variants={pageTransition} initial="hidden" animate="visible" custom={0.2} className="mt-12 space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-600">Curated results</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">Find your perfect stay & dining experience</h2>
              <p className="mt-2 text-sm text-slate-500 sm:text-base">Premium stays and local favorites matched to your travel intent.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3.5 py-2 text-sm font-semibold text-emerald-700">
                {filteredShops.length} destination{filteredShops.length !== 1 ? "s" : ""} found
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600">
                Live matching
              </span>
            </div>
          </div>

          {loadingShops ? (
            <div className="flex flex-col items-center justify-center rounded-[2rem] border border-slate-200 bg-white/80 py-20 shadow-sm">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600" />
              <p className="mt-3 text-sm font-medium text-slate-500">Gathering curated destinations...</p>
            </div>
          ) : filteredShops.length === 0 ? (
            <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-10 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <Compass size={24} />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-slate-900">No destinations match your current filters</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-slate-500">
                Try broadening your search or resetting the filters to reveal more experiences across Sri Lanka.
              </p>
              <button onClick={handleResetFilters} className="mt-6 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500">
                Reset search
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredShops.map((shop) => (
                <PremiumDestinationCard key={shop._id} shop={shop} categories={shopCategories[shop._id] || []} onViewMenu={handleViewFoods} />
              ))}
            </div>
          )}
        </motion.section>
      </main>

      <AnimatePresence>
        {selectedShop && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-slate-950/70 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-4xl overflow-hidden rounded-[2rem] border border-white/20 bg-white shadow-2xl"
              initial={{ scale: 0.96, y: 24, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.96, y: 24, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
            >
              <button
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-700 shadow-sm transition hover:bg-slate-100"
                onClick={() => {
                  setSelectedShop(null);
                  setFoods([]);
                }}
                aria-label="Close details"
              >
                <X size={18} />
              </button>

              <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
                <div className="relative min-h-[280px] bg-slate-100">
                  <img
                    src={selectedShop.photo ? `http://localhost:5000${selectedShop.photo}` : "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80"}
                    alt={selectedShop.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-white backdrop-blur-md">
                    {selectedShop.shopType === "hotel" ? "Lodging experience" : "Dining showcase"}
                  </div>
                </div>
                <div className="p-6 sm:p-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-600">
                    {selectedShop.shopType === "hotel" ? "Rooms & facilities" : "Menu highlights"}
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-slate-900">{selectedShop.name}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{selectedShop.description || "A polished destination selected for its atmosphere, comfort, and local charm."}</p>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">Price</div>
                      <div className="mt-1 text-lg font-semibold text-slate-900">{selectedShop.priceRange || "LKR 1800+"}</div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">Location</div>
                      <div className="mt-1 text-lg font-semibold text-slate-900">{selectedShop.address || selectedShop.location || "Sri Lanka"}</div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {[(selectedShop.shopType || "restaurant"), "Verified", "Best choice"].map((item) => (
                      <span key={item} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600">
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="mt-8">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold text-slate-900">What is available</h4>
                      <span className="text-sm font-medium text-slate-500">{foods.length} items</span>
                    </div>
                    {loadingFoods ? (
                      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-6 text-center text-sm text-slate-500">
                        Loading details...
                      </div>
                    ) : foods.length === 0 ? (
                      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-6 text-center text-sm text-slate-500">
                        No details are listed yet for this selection.
                      </div>
                    ) : (
                      <div className="mt-4 grid gap-3">
                        {foods.map((food) => (
                          <div key={food._id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
                            <div>
                              <p className="font-semibold text-slate-900">{food.name}</p>
                              <p className="mt-1 text-sm text-slate-500">{selectedShop.shopType === "hotel" ? "Comfort and amenities" : "Signature item"}</p>
                            </div>
                            <div className="text-sm font-semibold text-emerald-700">{selectedShop.shopType === "hotel" ? `LKR ${Number(food.price || 0).toFixed(2)}` : `LKR ${Number(food.price || 0).toFixed(2)}`}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
export default Home;

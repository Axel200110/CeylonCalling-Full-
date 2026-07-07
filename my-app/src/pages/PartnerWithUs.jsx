// PartnerWithUs.jsx
import { motion as Motion } from "framer-motion";
import {
    Bed,
    Check,
    Home,
    Hotel,
    Mail,
    Phone,
    Store,
    Upload,
    User,
    Utensils,
    X
} from "lucide-react";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Quiz from "../assets/Restaurent.jpg";
import Input from "../shopowner/components/Input";


// ============================================================
// DATA: Establishment Types & Categories
// ============================================================

const ESTABLISHMENT_TYPES = [
  { 
    id: "restaurant", 
    label: "Restaurant", 
    sinhala: "රෙස්ටුරන්ට්",
    icon: Utensils,
    emoji: "🍽️",
    description: "Dining & Food Service"
  },
  { 
    id: "hotel", 
    label: "Hotel / Resort", 
    sinhala: "හෝටල්",
    icon: Hotel,
    emoji: "🏨",
    description: "Luxury & Comfort Stays"
  },
  { 
    id: "villa", 
    label: "Private Villa", 
    sinhala: "විලා",
    icon: Home,
    emoji: "🏡",
    description: "Private & Scenic Stays"
  },
  { 
    id: "guesthouse", 
    label: "Guest House", 
    sinhala: "ගෙස්ට් හවුස්",
    icon: Bed,
    emoji: "🛌",
    description: "Budget & Pilgrim Stays"
  }
];

// Restaurant Categories (Matches Home Page)
const RESTAURANT_CATEGORIES = [
  { id: "rice_curry_traditional", label: "Traditional Rice & Curry", sinhala: "සාම්ප්‍රදායික බත් සහ ව්‍යංජන", emoji: "🍛" },
  { id: "street_kottu_hoppers", label: "Kottu, Hoppers & Street Food", sinhala: "කොත්තු, ආප්ප සහ වීදි ආහාර", emoji: "🥘" },
  { id: "lake_view_dining", label: "Lake View Dining (Wewa Side)", sinhala: "වැව් අද්දර ආහාර", emoji: "🌊" },
  { id: "local_buffet_hotels", label: "Hotel Buffets & Tourist Meals", sinhala: "හෝටල් බුෆේ සහ සංචාරක ආහාර", emoji: "🍽️" },
  { id: "fresh_fish_local", label: "Fresh Fish & Village Food", sinhala: "නැවුම් මාළු සහ ගමේ ආහාර", emoji: "🐟" },
  { id: "vegetarian_pilgrim", label: "Vegetarian & Pilgrim Meals", sinhala: "නිර්මාංශ සහ පූජා ආහාර", emoji: "🥗" },
  { id: "tea_snacks", label: "Tea Shops & Local Snacks", sinhala: "තේ කඩ සහ කෙටි ආහාර", emoji: "🍵" },
  { id: "tourist_fast_food", label: "Fast Food & Quick Meals", sinhala: "ක්ෂණික ආහාර", emoji: "🍔" },
  { id: "asian_noodles", label: "Asian Noodles & Fried Rice", sinhala: "ආසියානු නූඩ්ල්ස් සහ රයිස්", emoji: "🥢" },
  { id: "indian_spice", label: "Indian Spicy Meals", sinhala: "ඉන්දියානු කුළුබඩු ආහාර", emoji: "🌶️" },
  { id: "pasta_pizza", label: "Pasta & Pizza (Tourist Food)", sinhala: "පැස්ටා සහ පීසා", emoji: "🍕" },
  { id: "sweet_snacks", label: "Desserts & Sweet Snacks", sinhala: "පැණිරස සහ කෙටි ආහාර", emoji: "🍰" },
  { id: "healthy_light_meals", label: "Healthy & Light Meals", sinhala: "සෞඛ්‍යදායක ආහාර", emoji: "🥗" }
];

// Hotel Categories (Matches Home Page)
const HOTEL_CATEGORIES = [
  { id: "heritage_hotels", label: "Heritage & Historical Hotels", sinhala: "උරුම සහ ඓතිහාසික හෝටල්", emoji: "🏛️" },
  { id: "temple_area_hotels", label: "Temple Area Hotels", sinhala: "පන්සල් අසල හෝටල්", emoji: "🛕" },
  { id: "wewa_lake_hotels", label: "Lake View (Wewa) Hotels", sinhala: "වැව් අද්දර හෝටල්", emoji: "🌊" },
  { id: "budget_pilgrim_hotels", label: "Budget & Pilgrim Stay", sinhala: "පූජා සහ අඩු වියදම් නවාතැන්", emoji: "💰" },
  { id: "family_group_hotels", label: "Family & Group Hotels", sinhala: "පවුල් සහ කණ්ඩායම් හෝටල්", emoji: "👨‍👩‍👧‍👦" },
  { id: "nature_eco_hotels", label: "Nature & Eco Stays", sinhala: "ස්වභාවික සහ පරිසර හෝටල්", emoji: "🌿" },
  { id: "modern_comfort_hotels", label: "Modern Comfort Hotels", sinhala: "නවීන පහසුකම් සහිත හෝටල්", emoji: "🏨" },
  { id: "pool_relax_hotels", label: "Relax & Pool Hotels", sinhala: "විවේක සහ පිහිනුම් තටාක හෝටල්", emoji: "🏊" },
  { id: "romantic_quiet_stays", label: "Romantic & Quiet Stays", sinhala: "ශාන්තිමත් සහ යුවළන් සඳහා", emoji: "❤️" }
];

// Villa Categories (Matches Home Page)
const VILLA_CATEGORIES = [
  { id: "heritage_villas", label: "Heritage Area Villas", sinhala: "ඓතිහාසික ප්‍රදේශ විලා", emoji: "🏛️" },
  { id: "pilgrim_villas", label: "Pilgrim & Temple Stay Villas", sinhala: "පූජා සහ පන්සල් නවාතැන් විලා", emoji: "🛕" },
  { id: "wewa_view_villas", label: "Lake View Villas (Wewa Side)", sinhala: "වැව් අද්දර විලා", emoji: "🌊" },
  { id: "private_family_villas", label: "Private Family Villas", sinhala: "පවුලේ පෞද්ගලික විලා", emoji: "👨‍👩‍👧‍👦" },
  { id: "eco_nature_villas", label: "Eco & Nature Villas", sinhala: "ස්වභාවික පරිසර විලා", emoji: "🌿" },
  { id: "budget_group_villas", label: "Budget Group Villas", sinhala: "අඩු වියදම් කණ්ඩායම් විලා", emoji: "💰" },
  { id: "modern_comfort_villas", label: "Modern Comfort Villas", sinhala: "නවීන පහසුකම් විලා", emoji: "🏡" }
];

// Guest House Categories (Matches Home Page)
const GUESTHOUSE_CATEGORIES = [
  { id: "pilgrim_guesthouses", label: "Pilgrim Guest Houses", sinhala: "වන්දනාකරුවන්ගේ ගෙස්ට් හවුස්", emoji: "🏛️" },
  { id: "budget_lodges", label: "Budget Rooms & Lodges", sinhala: "අඩු වියදම් කාමර සහ ලොජ්", emoji: "🛌" },
  { id: "homestays_local", label: "Local Homestays", sinhala: "දේශීය හෝම්ස්ටේ", emoji: "🤝" },
  { id: "temple_rest_stays", label: "Temple Area Rest Houses", sinhala: "පන්සල් අසල විවේක නවාතැන්", emoji: "🛕" },
  { id: "dharma_stays", label: "Dharma & Meditation Stays", sinhala: "ධර්ම සහ භාවනා නවාතැන්", emoji: "🧘" },
  { id: "family_group_rooms", label: "Family & Group Rooms", sinhala: "පවුල් සහ කණ්ඩායම් කාමර", emoji: "👨‍👩‍👧‍👦" },
  { id: "bed_breakfast_stays", label: "Bed & Breakfast (B&B)", sinhala: "උදේ ආහාරය සහිත නවාතැන්", emoji: "🍳" },
  { id: "simple_comfort_stays", label: "Simple Comfort Stays", sinhala: "සරල පහසු නවාතැන්", emoji: "🏡" }
];

// Restaurant Services (Matches Home Page)
const RESTAURANT_SERVICES = [
  { id: "dine_in", label: "Dine-In", sinhala: "අවන්හල තුළ ආහාර", emoji: "🍽️" },
  { id: "takeaway", label: "Takeaway", sinhala: "රැගෙන යාමට", emoji: "🥡" },
  { id: "delivery", label: "Delivery", sinhala: "නිවසට ගෙන්වා ගැනීම", emoji: "🛵" },
  { id: "reservation", label: "Table Reservation", sinhala: "මේස වෙන්කරවා ගැනීම", emoji: "📅" },
  { id: "parking", label: "Parking", sinhala: "වාහන නැවතුම්", emoji: "🅿️" },
  { id: "wifi", label: "Free Wi-Fi", sinhala: "නොමිලේ Wi-Fi", emoji: "📶" },
  { id: "air_conditioned", label: "Air Conditioned", sinhala: "වායු සමීකරණය", emoji: "❄️" },
  { id: "outdoor_seating", label: "Outdoor Seating", sinhala: "එළිමහන් අසුන්", emoji: "🌳" },
  { id: "family_friendly", label: "Family Friendly", sinhala: "පවුලට සුදුසු", emoji: "👨‍👩‍👧‍👦" },
  { id: "wheelchair_access", label: "Wheelchair Accessible", sinhala: "රෝද පුටුවට පහසුකම්", emoji: "♿" },
  { id: "pet_friendly", label: "Pet Friendly", sinhala: "සුරතල් සතුන්ට අවසර", emoji: "🐶" },
  { id: "live_music", label: "Live Music", sinhala: "සජීවී සංගීතය", emoji: "🎶" },
  { id: "card_payment", label: "Card Payment", sinhala: "කාඩ්පත් ගෙවීම්", emoji: "💳" },
  { id: "couple_friendly", label: "Couple Friendly", sinhala: "යුවළන්ට සුදුසු", emoji: "❤️" },
  { id: "birthday_party", label: "Birthday Parties", sinhala: "උපන්දින සැමරුම්", emoji: "🎂" },
  { id: "twenty_four_hours", label: "24 Hours Open", sinhala: "පැය 24 විවෘත", emoji: "🕛" }
];

// Sri Lankan Districts
const SRI_LANKAN_DISTRICTS = [
  { id: "anuradhapura", label: "Anuradhapura", sinhala: "අනුරාධපුරය", emoji: "🏛️" },
  { id: "polonnaruwa", label: "Polonnaruwa", sinhala: "පොළොන්නරුව", emoji: "🏛️" }
];

// ============================================================
// COMPONENT: Photo Upload with Preview
// ============================================================

const PhotoUpload = ({ photos, setPhotos, maxPhotos = 5 }) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (photos.length + files.length > maxPhotos) {
      alert(`You can upload a maximum of ${maxPhotos} photos.`);
      return;
    }
    const newPhotos = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: Date.now() + Math.random().toString(36).substring(2, 9),
    }));
    setPhotos([...photos, ...newPhotos]);
  };

  const handleRemovePhoto = (id) => {
    setPhotos(photos.filter((p) => p.id !== id));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files || []);
    if (photos.length + files.length > maxPhotos) {
      alert(`You can upload a maximum of ${maxPhotos} photos.`);
      return;
    }
    const newPhotos = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: Date.now() + Math.random().toString(36).substring(2, 9),
    }));
    setPhotos([...photos, ...newPhotos]);
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        className={`relative rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-200 ${
          dragActive
            ? "border-emerald-500 bg-emerald-50/50"
            : "border-slate-200 hover:border-emerald-300 hover:bg-slate-50/50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
            <Upload className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">
              Click or drag to upload photos
            </p>
            <p className="text-xs text-slate-400">
              PNG, JPG, WEBP up to 10MB each • {photos.length}/{maxPhotos} used
            </p>
          </div>
        </div>
      </div>

      {/* Photo Previews */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
              <img
                src={photo.preview}
                alt="Business"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemovePhoto(photo.id)}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-1.5">
                <span className="text-[10px] text-white font-medium truncate block">
                  {photo.file.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================
// COMPONENT: Category Selection Grid
// ============================================================

const CategoryGrid = ({ categories, selected, onToggle, title, sinhalaTitle, maxSelect = null }) => {
  const [showAll, setShowAll] = useState(false);
  const displayCategories = showAll ? categories : categories.slice(0, 8);
  const hasMore = categories.length > 8;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {title}
          </h4>
          <p className="text-[10px] text-slate-400">{sinhalaTitle}</p>
        </div>
        {maxSelect && (
          <span className="text-xs text-slate-400 font-medium">
            {selected.length}/{maxSelect} selected
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {displayCategories.map((category) => {
          const isChecked = selected.includes(category.id);
          const isDisabled = maxSelect && selected.length >= maxSelect && !isChecked;

          return (
            <label
              key={category.id}
              className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all duration-150 select-none ${
                isChecked
                  ? "bg-emerald-50/40 border-emerald-200 text-emerald-955 shadow-sm"
                  : isDisabled
                  ? "bg-slate-50/40 border-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-slate-50/20 border-slate-100 hover:bg-slate-50 text-slate-650 hover:border-slate-200"
              }`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onToggle(category.id)}
                disabled={isDisabled}
                className="sr-only"
              />
              <span className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${
                isChecked
                  ? "border-emerald-600 bg-emerald-600 shadow-sm shadow-emerald-600/20"
                  : "border-slate-300 bg-white"
              }`}>
                {isChecked && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <span className="text-sm">{category.emoji}</span>
                  <span className="font-bold truncate text-xs">{category.label}</span>
                </div>
                <span className="text-[9px] text-slate-400 block truncate">{category.sinhala}</span>
              </div>
            </label>
          );
        })}
      </div>

      {hasMore && (
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="text-xs text-emerald-600 font-semibold hover:text-emerald-700 transition"
        >
          {showAll ? "Show Less ↑" : `Show All ${categories.length} Categories ↓`}
        </button>
      )}
    </div>
  );
};

// ============================================================
// COMPONENT: Service Selection Grid
// ============================================================

const ServiceGrid = ({ services, selected, onToggle }) => {
  return (
    <div className="space-y-3">
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          🍽️ Services & Facilities / සේවා සහ පහසුකම්
        </h4>
        <p className="text-[10px] text-slate-400">
          Select the services and facilities your business offers
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {services.map((service) => {
          const isChecked = selected.includes(service.id);
          return (
            <label
              key={service.id}
              className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all duration-150 select-none ${
                isChecked
                  ? "bg-emerald-50/40 border-emerald-200 text-emerald-955 shadow-sm"
                  : "bg-slate-50/20 border-slate-100 hover:bg-slate-50 text-slate-650 hover:border-slate-200"
              }`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onToggle(service.id)}
                className="sr-only"
              />
              <span className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${
                isChecked
                  ? "border-emerald-600 bg-emerald-600 shadow-sm shadow-emerald-600/20"
                  : "border-slate-300 bg-white"
              }`}>
                {isChecked && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <span className="text-sm">{service.emoji}</span>
                  <span className="font-bold truncate text-xs">{service.label}</span>
                </div>
                <span className="text-[9px] text-slate-400 block truncate">{service.sinhala}</span>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================
// MAIN COMPONENT: PartnerWithUs
// ============================================================

const PartnerWithUs = () => {
  // ===== STATE =====
  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [establishmentType, setEstablishmentType] = useState("restaurant");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [details, setDetails] = useState("");
  const [photos, setPhotos] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  // ===== DERIVED STATE =====
  const getCategoriesForType = () => {
    switch (establishmentType) {
      case "restaurant":
        return RESTAURANT_CATEGORIES;
      case "hotel":
        return HOTEL_CATEGORIES;
      case "villa":
        return VILLA_CATEGORIES;
      case "guesthouse":
        return GUESTHOUSE_CATEGORIES;
      default:
        return [];
    }
  };

  const getCategoryTitle = () => {
    switch (establishmentType) {
      case "restaurant":
        return "Cuisine Categories / ආහාර කාණ්ඩ";
      case "hotel":
        return "Hotel Types / හෝටල් වර්ග";
      case "villa":
        return "Villa Types / විලා වර්ග";
      case "guesthouse":
        return "Guest House Types / නවාතැන් වර්ග";
      default:
        return "Categories";
    }
  };

  const getCategorySinhala = () => {
    switch (establishmentType) {
      case "restaurant":
        return "ආහාර කාණ්ඩ තෝරන්න";
      case "hotel":
        return "හෝටල් කාණ්ඩ තෝරන්න";
      case "villa":
        return "විලා කාණ්ඩ තෝරන්න";
      case "guesthouse":
        return "නවාතැන් කාණ්ඩ තෝරන්න";
      default:
        return "කාණ්ඩ තෝරන්න";
    }
  };

  const showServices = establishmentType === "restaurant";
  const categories = getCategoriesForType();

  // ===== VALIDATION =====
  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!businessName.trim()) newErrors.businessName = "Business name is required";
      if (!ownerName.trim()) newErrors.ownerName = "Owner name is required";
      if (!email.trim()) newErrors.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Invalid email format";
      if (!phone.trim()) newErrors.phone = "Phone number is required";
      if (!selectedDistrict) newErrors.district = "Please select a district";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ===== HANDLERS =====
  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleServiceToggle = (serviceId) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Final validation
    if (!validateStep(1) || !validateStep(2)) {
      setIsSubmitting(false);
      setCurrentStep(1);
      return;
    }

    // Prepare form data for API
    const formData = new FormData();
    formData.append("businessName", businessName);
    formData.append("ownerName", ownerName);
    formData.append("email", email);
    formData.append("phone", phone);
    const districtLabel = SRI_LANKAN_DISTRICTS.find((d) => d.id === selectedDistrict)?.label || "";
    formData.append("location", districtLabel);
    formData.append("district", selectedDistrict);
    formData.append("establishmentType", establishmentType);
    formData.append("categories", JSON.stringify(selectedCategories));
    formData.append("services", JSON.stringify(selectedServices));
    formData.append("details", details);

    // Append photos
    photos.forEach((photo) => {
      formData.append("photos", photo.file);
    });

    try {
      // Replace with your actual API endpoint
      const response = await fetch("http://localhost:5000/api/partners/register", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit registration");
      }

      alert(
        "✅ Thank you for your submission! Our team will review your request and contact you soon.\n\n" +
        "✅ ඔබේ ඉල්ලීම සඳහා ස්තුතියි! අපගේ කණ්ඩායම ඉක්මණින් ඔබව සම්බන්ද කරනු ඇත."
      );

      navigate("/");
    } catch (error) {
      console.error("Submit error:", error);
      alert("❌ An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ===== RENDER =====
  return (
    <Motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen bg-cover bg-center px-4 py-8 md:py-12"
      style={{ backgroundImage: `url(${Quiz})` }}
    >
      <div className="mx-auto w-full max-w-4xl rounded-3xl bg-white/95 backdrop-blur-xl border border-white/40 shadow-2xl p-6 sm:p-8 md:p-10">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
              Partner With Us
            </p>
            <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900">
              Register Your Business
            </h1>
            <p className="mt-1 text-sm text-slate-500 max-w-xl leading-relaxed">
              Add your {establishmentType} to Ceylon Calling and reach more guests.
              <br className="hidden sm:block" />
              <span className="text-slate-400">
                ඔබගේ ව්‍යාපාරය Ceylon Calling හි එක්කර පාරිශ‍්‍රමිකයින්ට පහසුවෙන් ළඟා වන්න.
              </span>
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full border border-emerald-600 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 flex-shrink-0"
          >
            Back to Home
          </Link>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (step < currentStep || validateStep(step - 1)) {
                    setCurrentStep(step);
                  }
                }}
                className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all ${
                  step === currentStep
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                    : step < currentStep
                    ? "bg-emerald-100 text-emerald-700 cursor-pointer hover:bg-emerald-200"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
              >
                {step < currentStep ? <Check className="w-4 h-4" /> : step}
              </button>
              {step < 3 && (
                <div className={`w-8 h-0.5 rounded-full ${
                  step < currentStep ? "bg-emerald-400" : "bg-slate-200"
                }`} />
              )}
            </div>
          ))}
          <span className="text-xs text-slate-400 ml-2">
            Step {currentStep} of 3
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* STEP 1: Basic Information */}
          {currentStep === 1 && (
            <Motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">1</span>
                  Business Information / ව්‍යාපාර තොරතුරු
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Fill in your business details to get started
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  icon={Store}
                  type="text"
                  placeholder="Business Name / ව්‍යාපාර නාමය"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                  error={errors.businessName}
                />
                <Input
                  icon={User}
                  type="text"
                  placeholder="Owner / Manager Name / හිමිකරු/කළමණාකරු"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  required
                  error={errors.ownerName}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  icon={Mail}
                  type="email"
                  placeholder="Email / විද්‍යුත් තැපෑල"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  error={errors.email}
                />
                <Input
                  icon={Phone}
                  type="tel"
                  placeholder="Phone / දුරකථන අංකය"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  error={errors.phone}
                />
              </div>

              {/* Establishment Type Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Business Type / ව්‍යාපාර වර්ගය
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {ESTABLISHMENT_TYPES.map((type) => {
                    const Icon = type.icon;
                    const isSelected = establishmentType === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => {
                          setEstablishmentType(type.id);
                          setSelectedCategories([]);
                          setSelectedServices([]);
                        }}
                        className={`flex flex-col items-center p-3 rounded-xl border-2 text-center transition-all duration-200 ${
                          isSelected
                            ? "border-emerald-600 bg-emerald-50/40 text-emerald-900 shadow-sm"
                            : "border-slate-200 hover:border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <span className="text-2xl">{type.emoji}</span>
                        <span className="text-xs font-bold mt-1">{type.label}</span>
                        <span className="text-[9px] text-slate-400">{type.sinhala}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5 max-w-xl">
                <label className="text-sm font-medium text-slate-700">
                  District / දිස්ත්‍රික්කය
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className={`w-full rounded-xl border ${
                    errors.district ? "border-red-300 bg-red-50" : "border-gray-300"
                  } bg-white px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition`}
                >
                  <option value="">Select District / දිස්ත්‍රික්කය තෝරන්න</option>
                  {SRI_LANKAN_DISTRICTS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.emoji} {d.label} - {d.sinhala}
                    </option>
                  ))}
                </select>
                {errors.district && (
                  <p className="text-xs text-red-500">{errors.district}</p>
                )}
                <p className="text-xs text-slate-400">
                  Only Anuradhapura and Polonnaruwa are available for this registration.
                </p>
              </div>

              {/* Business Description */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Business Description / ව්‍යාපාර විස්තරය
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Briefly describe your location, services, and specialties..."
                  className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200"
                  rows={3}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition shadow-sm shadow-emerald-600/20"
                >
                  Next Step →
                </button>
              </div>
            </Motion.div>
          )}

          {/* STEP 2: Categories & Services */}
          {currentStep === 2 && (
            <Motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">2</span>
                  Categories & Services / කාණ්ඩ සහ සේවා
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select categories and services that best describe your business
                </p>
              </div>

              {/* Categories */}
              <CategoryGrid
                categories={categories}
                selected={selectedCategories}
                onToggle={handleCategoryToggle}
                title={getCategoryTitle()}
                sinhalaTitle={getCategorySinhala()}
                maxSelect={null}
              />
              {errors.categories && (
                <p className="text-xs text-red-500 -mt-3">{errors.categories}</p>
              )}

              {/* Services (Restaurants only) */}
              {showServices && (
                <ServiceGrid
                  services={RESTAURANT_SERVICES}
                  selected={selectedServices}
                  onToggle={handleServiceToggle}
                />
              )}

              {/* Photo Upload */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Business Photos / ව්‍යාපාර ඡායාරූප
                </label>
                <p className="text-xs text-slate-400 -mt-0.5">
                  Upload up to 5 photos of your business (interior, exterior, food, etc.)
                </p>
                <PhotoUpload photos={photos} setPhotos={setPhotos} maxPhotos={5} />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-200 transition"
                >
                  ← Previous
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex-1 px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition shadow-sm shadow-emerald-600/20"
                >
                  Review & Submit →
                </button>
              </div>
            </Motion.div>
          )}

          {/* STEP 3: Review & Submit */}
          {currentStep === 3 && (
            <Motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">3</span>
                  Review & Submit / සමාලෝචනය සහ යැවීම
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Please review your information before submitting
                </p>
              </div>

              {/* Review Card */}
              <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-xs text-slate-400 block">Business Name</span>
                    <span className="font-semibold text-slate-800">{businessName}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Owner</span>
                    <span className="font-semibold text-slate-800">{ownerName}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Email</span>
                    <span className="font-semibold text-slate-800">{email}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Phone</span>
                    <span className="font-semibold text-slate-800">{phone}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Business Type</span>
                    <span className="font-semibold text-slate-800">
                      {ESTABLISHMENT_TYPES.find(t => t.id === establishmentType)?.label}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">District</span>
                    <span className="font-semibold text-slate-800">
                      {SRI_LANKAN_DISTRICTS.find(d => d.id === selectedDistrict)?.label}
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-3">
                  <span className="text-xs text-slate-400 block">Categories</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {selectedCategories.map((id) => {
                      const cat = categories.find(c => c.id === id);
                      return cat ? (
                        <span key={id} className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
                          {cat.emoji} {cat.label}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>

                {showServices && selectedServices.length > 0 && (
                  <div className="border-t border-slate-200 pt-3">
                    <span className="text-xs text-slate-400 block">Services</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {selectedServices.map((id) => {
                        const svc = RESTAURANT_SERVICES.find(s => s.id === id);
                        return svc ? (
                          <span key={id} className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                            {svc.emoji} {svc.label}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                {details && (
                  <div className="border-t border-slate-200 pt-3">
                    <span className="text-xs text-slate-400 block">Description</span>
                    <p className="text-sm text-slate-700 mt-0.5">{details}</p>
                  </div>
                )}

                {photos.length > 0 && (
                  <div className="border-t border-slate-200 pt-3">
                    <span className="text-xs text-slate-400 block">Photos ({photos.length})</span>
                    <div className="flex gap-2 mt-1.5">
                      {photos.slice(0, 4).map((photo, idx) => (
                        <img
                          key={photo.id}
                          src={photo.preview}
                          alt={`Business ${idx + 1}`}
                          className="w-14 h-14 object-cover rounded-lg border border-slate-200"
                        />
                      ))}
                      {photos.length > 4 && (
                        <div className="w-14 h-14 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-400 border border-slate-200">
                          +{photos.length - 4}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Info Box */}
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-slate-700">
                <p className="font-semibold text-emerald-700 flex items-center gap-2">
                  <Check className="w-4 h-4" /> What happens next?
                </p>
                <p className="mt-1 leading-relaxed text-slate-600">
                  We will review your partner request and contact you with account setup details.
                  <br />
                  <span className="text-slate-500">
                    ඔබගේ ඉල්ලීම පරීක්ෂා කර වලංගුතාවය තහවුරු කිරීමෙන් පසු ඔබව අපගේ කණ්ඩායම සම්බන්ධ කරයි.
                  </span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-200 transition"
                >
                  ← Previous
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition shadow-sm shadow-emerald-600/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Registration / ලියාපදිංචිය යවන්න"
                  )}
                </button>
              </div>
            </Motion.div>
          )}
        </form>
      </div>
    </Motion.div>
  );
};

export default PartnerWithUs;
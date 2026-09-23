import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { 
  MapPin, 
  Star, 
  Phone, 
  Wifi, 
  Car, 
  Baby, 
  GlassWater,
  Sparkles,
  Heart
} from "lucide-react";

// Helper to determine type badges and label
const getTypeDetails = (type = "restaurant") => {
  switch (type.toLowerCase()) {
    case "restaurant":
      return { label: "Restaurant", emoji: "🍽️", color: "text-emerald-600 bg-emerald-50 border-emerald-100" };
    case "cafe":
    case "coffee":
      return { label: "Café", emoji: "☕", color: "text-amber-600 bg-amber-50 border-amber-100" };
    case "hotel":
      return { label: "Hotel", emoji: "🏨", color: "text-blue-600 bg-blue-50 border-blue-100" };
    case "villa":
      return { label: "Villa", emoji: "🏡", color: "text-indigo-600 bg-indigo-50 border-indigo-100" };
    case "guesthouse":
      return { label: "Guest House", emoji: "🛌", color: "text-purple-600 bg-purple-50 border-purple-100" };
    case "bakery":
      return { label: "Bakery", emoji: "🍰", color: "text-rose-600 bg-rose-50 border-rose-100" };
    case "street_food":
    case "street food":
      return { label: "Street Food", emoji: "🍢", color: "text-orange-600 bg-orange-50 border-orange-100" };
    default:
      return { label: type.charAt(0).toUpperCase() + type.slice(1), emoji: "📍", color: "text-slate-600 bg-slate-50 border-slate-100" };
  }
};

// Map service strings to Lucide icons
const getServiceIcon = (service = "") => {
  const s = service.toLowerCase();
  if (s.includes("wifi") || s.includes("wi-fi")) return <Wifi size={12} className="mr-1" />;
  if (s.includes("parking")) return <Car size={12} className="mr-1" />;
  if (s.includes("delivery")) return <Sparkles size={12} className="mr-1" />;
  if (s.includes("family") || s.includes("kids")) return <Baby size={12} className="mr-1" />;
  if (s.includes("seating") || s.includes("outdoor")) return <GlassWater size={12} className="mr-1" />;
  return <Sparkles size={12} className="mr-1" />;
};

export default function ShopCard({ shop, currentUserId }) {
  const navigate = useNavigate();
  const typeInfo = getTypeDetails(shop.shopType);
  
  const mainImage = shop.photo
    ? shop.photo.startsWith("http")
      ? shop.photo
      : `${shop.photo}`
    : "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"; // Fallback beautiful image

  const [imageSrc, setImageSrc] = useState(mainImage);
  
  // Likes system state
  const alreadyLiked = currentUserId && Array.isArray(shop.likes)
    ? shop.likes.some(id => typeof id === "object" && id?._id ? id._id === currentUserId : id === currentUserId)
    : false;

  const [liked, setLiked] = useState(alreadyLiked);
  const [likeCount, setLikeCount] = useState(shop.likeCount || 0);
  const [likeLoading, setLikeLoading] = useState(false);

  const handleLike = async (e) => {
    e.stopPropagation(); // Prevent card navigation click
    if (!currentUserId) {
      navigate("/user/login");
      return;
    }
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      const res = await axios.post(
        `/api/shops/${shop._id}/like`,
        {},
        { withCredentials: true }
      );
      setLiked(res.data.data.liked);
      setLikeCount(res.data.data.likeCount);
    } catch (err) {
      console.error("Error liking shop:", err);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleCardClick = () => {
    navigate(`/shop/${shop._id}`);
  };

  // Mock standard rating if rating field is missing, to keep visual consistency
  const averageRating = Number(shop.rating || (shop.shopType === "hotel" ? 4.8 : 4.6)).toFixed(1);

  return (
    <motion.div
      onClick={handleCardClick}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ y: -6, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.08)" }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col h-full bg-white rounded-2xl border border-slate-100 overflow-hidden cursor-pointer select-none"
    >
      {/* 16:10 Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 shrink-0">
        <motion.img
          src={imageSrc}
          alt={shop.name}
          onError={() => setImageSrc("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80")}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full h-full object-cover rounded-t-2xl"
          loading="lazy"
        />
        {/* Type Badge */}
        <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold shadow-sm backdrop-blur-md ${typeInfo.color}`}>
          <span>{typeInfo.emoji}</span>
          <span>{typeInfo.label}</span>
        </div>
        {/* Like Button overlay */}
        <button
          onClick={handleLike}
          disabled={likeLoading}
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 hover:bg-white shadow-sm border border-slate-100/50 text-slate-500 hover:text-pink-500 backdrop-blur-md transition-colors"
          aria-label={liked ? "Unlike shop" : "Like shop"}
        >
          <Heart size={14} className={liked ? "fill-pink-500 text-pink-500" : ""} />
        </button>
      </div>

      {/* Content details */}
      <div className="flex flex-col justify-between flex-grow p-4 space-y-3.5">
        <div className="space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-bold text-slate-900 text-base leading-snug tracking-tight group-hover:text-emerald-600 transition-colors line-clamp-1">
              {shop.name}
            </h4>
            <div className="flex items-center gap-1 text-slate-700 bg-slate-50 px-2 py-0.5 rounded-md text-xs font-semibold shrink-0 border border-slate-100">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              <span>{averageRating}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-500">
            <MapPin size={13} className="text-emerald-500 shrink-0" />
            <span className="truncate">{shop.location || "Sri Lanka"}</span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed font-light line-clamp-2">
            {shop.description || "Indulge in a memorable hospitality experience under Ceylon's beautiful central sun."}
          </p>
        </div>

        {/* Pricing, Likes & Services Badges */}
        <div className="space-y-2 pt-2 border-t border-slate-50">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
            <span>{shop.priceRange || "LKR 1,000–3,000"}</span>
            <span className="text-slate-400">{likeCount} likes</span>
          </div>

          {/* Service badges */}
          {Array.isArray(shop.services) && shop.services.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {shop.services.slice(0, 3).map((svc, index) => (
                <span
                  key={`${shop._id}-svc-${index}`}
                  className="inline-flex items-center px-2 py-0.5 rounded bg-slate-50 text-slate-500 border border-slate-100 text-[10px] font-medium"
                >
                  {getServiceIcon(svc)}
                  <span className="capitalize">{svc}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

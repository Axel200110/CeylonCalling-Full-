import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { MapPin, Utensils, Store } from "lucide-react";

export default function FoodCard({ food, idx }) {
  const navigate = useNavigate();
  
  const mainImage = food.picture
    ? food.picture.startsWith("http")
      ? food.picture
      : `${food.picture}`
    : "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80"; // Fallback pizza / food image

  const [imageSrc, setImageSrc] = useState(mainImage);

  // Safely get shop info
  const shopId = food.shop?._id || food.shop;
  const shopName = food.shop?.name || "Premium Restaurant";
  const shopLocation = food.shop?.location || "Sri Lanka";

  const handleCardClick = () => {
    navigate(`/foods/${food._id}`);
  };

  return (
    <motion.div
      onClick={handleCardClick}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      whileHover={{ y: -6, boxShadow: "0 18px 36px -12px rgba(0,0,0,0.06)" }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: idx * 0.04 }}
      className="group flex flex-col h-full bg-white rounded-2xl border border-slate-100 overflow-hidden cursor-pointer select-none"
    >
      {/* 4:3 aspect ratio image container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 shrink-0">
        <motion.img
          src={imageSrc}
          alt={food.name}
          onError={() => setImageSrc("https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80")}
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="w-full h-full object-cover rounded-t-2xl"
          loading="lazy"
        />
        {/* Category Pill overlay */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/85 border border-white/10 text-[10px] font-bold text-white shadow-sm backdrop-blur-md uppercase tracking-wider">
          <Utensils size={10} className="text-emerald-400" />
          <span>{food.category?.name || "Dish"}</span>
        </div>
      </div>

      {/* Content body */}
      <div className="flex flex-col justify-between flex-grow p-4 space-y-3">
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-bold text-slate-900 text-sm tracking-tight leading-snug group-hover:text-emerald-600 transition-colors line-clamp-1">
              {food.name}
            </h4>
            <span className="text-emerald-600 font-bold text-sm shrink-0 whitespace-nowrap">
              LKR {Number(food.price || 0).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </span>
          </div>

          {/* Shop Link block */}
          {shopId && (
            <Link
              to={`/shop/${shopId}`}
              onClick={(e) => e.stopPropagation()} // Prevent card details navigation
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-600 transition-colors mt-1 hover:underline"
            >
              <Store size={12} className="text-slate-400" />
              <span className="truncate">{shopName}</span>
            </Link>
          )}

          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
            <MapPin size={11} className="text-slate-300" />
            <span className="truncate">{shopLocation}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-50 flex items-center justify-between">
          <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Ceylon Curated</span>
          <span className="text-xs font-semibold text-emerald-600 group-hover:underline">Discover Details →</span>
        </div>
      </div>
    </motion.div>
  );
}

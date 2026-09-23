import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  MapPin,
  Star,
  Heart,
  Wifi,
  Car,
  Utensils,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Navigation,
} from "lucide-react";
import { resolveImageUrl, formatRating, formatLocation } from "../../utils/formatters";
import { getDirectionsUrl, DIRECTIONS_UNAVAILABLE_MSG } from "../../utils/locationUtils";
import { notify } from "../../utils/toast";
import { useSiteUserAuthStore } from "../../store/siteUserAuthStore";

const getTypeMeta = (shopType = "restaurant") => {
  switch (shopType.toLowerCase()) {
    case "restaurant":
      return { label: "Restaurant", emoji: "🍽️", style: "bg-emerald-500/90 text-white" };
    case "cafe":
    case "coffee":
      return { label: "Café", emoji: "☕", style: "bg-amber-500/90 text-white" };
    case "hotel":
      return { label: "Hotel", emoji: "🏨", style: "bg-blue-500/90 text-white" };
    case "villa":
      return { label: "Villa", emoji: "🏡", style: "bg-indigo-500/90 text-white" };
    case "guesthouse":
      return { label: "Guest House", emoji: "🛌", style: "bg-purple-500/90 text-white" };
    case "street_food":
    case "street food":
    case "small_food_shop":
      return { label: "Street Food", emoji: "🍢", style: "bg-orange-500/90 text-white" };
    default:
      return { label: "Venue", emoji: "📍", style: "bg-slate-700/90 text-white" };
  }
};

const getServiceIcon = (service = "") => {
  const s = service.toLowerCase();
  if (s.includes("wifi")) return <Wifi size={11} className="shrink-0" />;
  if (s.includes("parking")) return <Car size={11} className="shrink-0" />;
  if (s.includes("dine")) return <Utensils size={11} className="shrink-0" />;
  return <Sparkles size={11} className="shrink-0" />;
};

export default function RestaurantCard({ shop, index = 0 }) {
  const navigate = useNavigate();
  const user = useSiteUserAuthStore((state) => state.user);

  const initialLiked =
    user?._id && Array.isArray(shop.likes)
      ? shop.likes.some((id) => (typeof id === "object" ? id?._id === user._id : id === user._id))
      : false;

  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(shop.likeCount || 0);
  const [isLiking, setIsLiking] = useState(false);

  const imageSrc = resolveImageUrl(shop.photo || (shop.photos && shop.photos[0]), shop.shopType || "restaurant");
  const [imgUrl, setImgUrl] = useState(imageSrc);

  const typeMeta = getTypeMeta(shop.shopType);
  const ratingVal = formatRating(shop.rating || (shop.shopType === "hotel" ? 4.8 : 4.6));

  const handleCardClick = () => {
    navigate(`/restaurant/${shop._id}`);
  };

  const handleDirections = (e) => {
    e.stopPropagation();
    const url = getDirectionsUrl(shop);
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      notify.error(DIRECTIONS_UNAVAILABLE_MSG);
    }
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!user) {
      navigate("/user/login");
      return;
    }
    if (isLiking) return;

    setIsLiking(true);
    try {
      const res = await axios.post(
        `/api/shops/${shop._id}/like`,
        {},
        { withCredentials: true }
      );
      if (res.data?.data) {
        setLiked(res.data.data.liked);
        setLikeCount(res.data.data.likeCount);
      }
    } catch (err) {
      console.error("Error liking shop:", err);
    } finally {
      setIsLiking(false);
    }
  };

  const isAccommodation = ["hotel", "villa", "guesthouse"].includes((shop.shopType || "").toLowerCase());
  const locationDisplay = shop.addressDetails?.city
    ? `${shop.addressDetails.city}, ${shop.addressDetails.district || "North Central"}`
    : formatLocation(shop.location);

  return (
    <motion.div
      onClick={handleCardClick}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      whileHover={{ y: -5, boxShadow: "0 20px 35px -10px rgba(15, 23, 42, 0.08)" }}
      transition={{ duration: 0.35, ease: "easeOut", delay: Math.min(index * 0.04, 0.3) }}
      className="group flex flex-col h-full bg-white rounded-3xl border border-slate-100/90 overflow-hidden cursor-pointer select-none shadow-xs transition-all duration-300"
    >
      {/* 16:10 Large Image Header */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 shrink-0">
        <img
          src={imgUrl}
          alt={shop.name || "Venue"}
          onError={() => setImgUrl(resolveImageUrl("", shop.shopType))}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Gradient Overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Type Badge */}
        <div
          className={`absolute top-3.5 left-3.5 flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold shadow-md backdrop-blur-md ${typeMeta.style}`}
        >
          <span>{typeMeta.emoji}</span>
          <span>{typeMeta.label}</span>
        </div>

        {/* Like Button */}
        <button
          type="button"
          onClick={handleLike}
          disabled={isLiking}
          className="absolute top-3.5 right-3.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 hover:bg-white shadow-md backdrop-blur-md text-slate-600 hover:text-pink-600 transition duration-200"
          aria-label={liked ? "Unlike venue" : "Like venue"}
        >
          <Heart size={15} className={liked ? "fill-pink-500 text-pink-500" : ""} />
        </button>

        {/* Bottom Image Overlay Badges */}
        <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-1 font-semibold text-slate-100 bg-slate-950/60 backdrop-blur-md px-2.5 py-1 rounded-lg">
            <MapPin size={12} className="text-emerald-400 shrink-0" />
            <span className="truncate max-w-[150px]">{locationDisplay}</span>
          </div>
          <div className="flex items-center gap-1 bg-white/90 text-slate-900 font-extrabold px-2 py-1 rounded-lg backdrop-blur-md shadow-xs">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span>{ratingVal}</span>
          </div>
        </div>
      </div>

      {/* Card Body Content */}
      <div className="flex flex-col justify-between flex-1 p-5 space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-extrabold text-slate-900 text-base tracking-tight leading-snug group-hover:text-emerald-600 transition-colors line-clamp-1">
              {shop.name}
            </h3>
            {shop.status === "approved" && (
              <span className="shrink-0 text-emerald-600" title="Verified Partner">
                <ShieldCheck size={16} />
              </span>
            )}
          </div>

          <p className="text-xs text-slate-500 leading-relaxed font-light line-clamp-2">
            {shop.description || shop.businessDescription || "Discover an authentic tourism experience in the North Central Province."}
          </p>
        </div>

        {/* Services & Footer Info */}
        <div className="pt-3 border-t border-slate-100 space-y-2.5">
          {/* Price Range & Likes */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">
              {isAccommodation
                ? (shop.priceRange ? (shop.priceRange.toLowerCase().includes("night") ? shop.priceRange : `${shop.priceRange} / night`) : "From LKR 4,500 / night")
                : (shop.priceRange || "LKR 1,000–3,000")}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">{likeCount} likes</span>
          </div>

          {/* Service Badges or Quick Link */}
          {Array.isArray(shop.services) && shop.services.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {shop.services.slice(0, 3).map((svc, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 border border-slate-100 text-[10px] font-medium capitalize"
                >
                  {getServiceIcon(svc)}
                  <span>{svc}</span>
                </span>
              ))}
            </div>
          )}

          {/* Action Bar */}
          <div className="pt-1 flex items-center justify-between gap-2 border-t border-slate-50">
            <button
              type="button"
              onClick={handleDirections}
              title="Get Directions on Google Maps"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-[11px] font-semibold transition"
            >
              <Navigation size={11} className="text-emerald-600" />
              <span>Directions</span>
            </button>

            <button
              type="button"
              onClick={handleCardClick}
              className="inline-flex items-center gap-1 text-[11px] text-emerald-600 hover:text-emerald-700 font-semibold group-hover:underline"
            >
              <span>{isAccommodation ? "View Stay" : "View Venue"}</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

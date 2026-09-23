import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  MapPin,
  Star,
  Heart,
  Wifi,
  Car,
  Utensils,
  Bed,
  Home,
  Hotel,
  ShieldCheck,
  ArrowUpRight,
  Clock,
  Sparkles,
  Navigation,
} from "lucide-react";
import { resolveImageUrl, formatLocation } from "../../utils/formatters";
import { getDirectionsUrl, hasValidCoordinates, DIRECTIONS_UNAVAILABLE_MSG } from "../../utils/locationUtils";
import { notify } from "../../utils/toast";
import { useSiteUserAuthStore } from "../../store/siteUserAuthStore";

/**
 * Returns clean, professional outline icon and type label for business types.
 * Strictly no cartoon emojis.
 */
const getTypeConfig = (shopType = "restaurant") => {
  switch (shopType.toLowerCase()) {
    case "restaurant":
    case "small_food_shop":
      return { label: "Restaurant", icon: Utensils, badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200/80" };
    case "hotel":
      return { label: "Hotel & Resort", icon: Hotel, badgeClass: "bg-blue-50 text-blue-700 border-blue-200/80" };
    case "villa":
      return { label: "Private Villa", icon: Home, badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200/80" };
    case "guesthouse":
      return { label: "Guest House", icon: Bed, badgeClass: "bg-purple-50 text-purple-700 border-purple-200/80" };
    default:
      return { label: "Establishment", icon: Sparkles, badgeClass: "bg-slate-50 text-slate-700 border-slate-200" };
  }
};

/**
 * Small utility outline icon mapping for services & facilities
 */
const renderTagIcon = (tag = "") => {
  const t = tag.toLowerCase();
  if (t.includes("wifi")) return <Wifi size={12} className="shrink-0 text-slate-500" />;
  if (t.includes("park") || t.includes("car")) return <Car size={12} className="shrink-0 text-slate-500" />;
  if (t.includes("dine") || t.includes("food")) return <Utensils size={12} className="shrink-0 text-slate-500" />;
  if (t.includes("bed") || t.includes("room")) return <Bed size={12} className="shrink-0 text-slate-500" />;
  return null;
};

export default function BusinessCard({ shop }) {
  const navigate = useNavigate();
  const user = useSiteUserAuthStore((state) => state.user);

  const initialLiked =
    user?._id && Array.isArray(shop.likes)
      ? shop.likes.some((id) => (typeof id === "object" ? id?._id === user._id : id === user._id))
      : false;

  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(shop.likeCount || 0);
  const [isLiking, setIsLiking] = useState(false);

  // Real image resolution with fallback
  const imageSrc = resolveImageUrl(
    shop.photo || (shop.photos && shop.photos[0]),
    shop.shopType || "restaurant"
  );
  const [imgUrl, setImgUrl] = useState(imageSrc);

  const typeConfig = getTypeConfig(shop.shopType);
  const TypeIcon = typeConfig.icon;

  // Format location string: City, District (e.g. Polonnaruwa Heritage City, Polonnaruwa)
  const locationDisplay = shop.addressDetails?.city
    ? `${shop.addressDetails.city}, ${shop.addressDetails.district || "North Central"}`
    : formatLocation(shop.location);

  // Real review or rating computation (no fabricated numbers)
  const reviewsCount = Array.isArray(shop.reviews) ? shop.reviews.length : 0;
  const ratingVal = shop.rating || null;

  const handleCardClick = () => {
    navigate(`/restaurant/${shop._id}`);
  };

  const handleDirectionsClick = (e) => {
    e.stopPropagation();
    const url = getDirectionsUrl(shop);
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      notify.error(DIRECTIONS_UNAVAILABLE_MSG);
    }
  };

  const handleLikeClick = async (e) => {
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
      console.error("Failed to update like status:", err);
    } finally {
      setIsLiking(false);
    }
  };

  // Curate key capability & facility highlights (max 3, no duplicate info)
  const highlightTags = [];
  if (shop.capabilities?.hasDelivery) highlightTags.push("Delivery");
  if (shop.capabilities?.hasTakeaway && !highlightTags.includes("Delivery")) highlightTags.push("Takeaway");
  if (shop.capabilities?.hasDineIn) highlightTags.push("Dine-In");
  if (shop.capabilities?.hasRoomBooking) highlightTags.push("Room Booking");
  if (Array.isArray(shop.services)) {
    if (shop.services.some((s) => s.toLowerCase().includes("wifi"))) highlightTags.push("Free Wi-Fi");
    if (shop.services.some((s) => s.toLowerCase().includes("parking"))) highlightTags.push("Parking");
  }

  const isAccommodation = ["hotel", "villa", "guesthouse"].includes(
    (shop.shopType || "").toLowerCase()
  );

  return (
    <article
      onClick={handleCardClick}
      className="group flex flex-col h-full bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md select-none"
    >
      {/* 1. Image Header with Standard 16:10 Ratio */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 shrink-0">
        <img
          src={imgUrl}
          alt={shop.name || "Business venue"}
          onError={() => setImgUrl(resolveImageUrl("", shop.shopType))}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
        />

        {/* Subtle top overlay badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* Business Type Badge */}
          <span
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide border shadow-xs backdrop-blur-xs bg-white/95 text-slate-800"
          >
            <TypeIcon size={12} className="text-emerald-600 shrink-0" />
            <span>{typeConfig.label}</span>
          </span>

          {/* Like / Save Button */}
          <button
            type="button"
            onClick={handleLikeClick}
            disabled={isLiking}
            className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full bg-white/95 hover:bg-white text-slate-600 hover:text-rose-600 shadow-xs border border-slate-200/60 transition active:scale-95"
            aria-label={liked ? "Remove from saved places" : "Save this place"}
          >
            <Heart
              size={15}
              className={liked ? "fill-rose-500 text-rose-500" : "stroke-[2]"}
            />
          </button>
        </div>

        {/* Operating status banner if closed */}
        {shop.operationalStatus === "closed" && (
          <div className="absolute bottom-2 left-3 bg-slate-900/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1">
            <Clock size={10} />
            <span>Temporarily Closed</span>
          </div>
        )}
      </div>

      {/* 2. Card Content Body */}
      <div className="flex flex-col justify-between flex-1 p-4 sm:p-5 space-y-3.5">
        <div className="space-y-1.5">
          {/* Business Name & Verification */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-emerald-600 transition-colors line-clamp-1">
              {shop.name}
            </h3>
            {shop.status === "approved" && (
              <span
                className="shrink-0 text-emerald-600 mt-0.5"
                title="Verified Partner by Ceylon Calling"
                aria-label="Verified Partner"
              >
                <ShieldCheck size={16} />
              </span>
            )}
          </div>

          {/* Level 2: Location */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-normal">
            <MapPin size={13} className="text-slate-400 shrink-0" />
            <span className="truncate">{locationDisplay}</span>
          </div>

          {/* Level 3: Ratings / Reviews */}
          <div className="flex items-center gap-2 pt-0.5 text-xs">
            {ratingVal ? (
              <div className="flex items-center gap-1 text-slate-800 font-semibold">
                <Star size={13} className="fill-amber-400 text-amber-400 shrink-0" />
                <span>{ratingVal}</span>
                {reviewsCount > 0 && (
                  <span className="text-slate-400 font-normal">({reviewsCount})</span>
                )}
              </div>
            ) : reviewsCount > 0 ? (
              <div className="flex items-center gap-1 text-slate-700 text-xs">
                <Star size={13} className="fill-amber-400 text-amber-400 shrink-0" />
                <span className="font-semibold">{reviewsCount}</span>
                <span className="text-slate-400">{reviewsCount === 1 ? "review" : "reviews"}</span>
              </div>
            ) : (
              <span className="text-[11px] text-slate-400 font-normal">
                {likeCount > 0 ? `${likeCount} travelers saved` : "New on Ceylon Calling"}
              </span>
            )}
          </div>

          {/* Level 4: Highlight Services / Facilities */}
          {highlightTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {highlightTags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200/80 text-slate-600 text-[11px] font-medium"
                >
                  {renderTagIcon(tag)}
                  <span>{tag}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 3. Card Footer & Primary Action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="text-xs">
            <span className="text-[11px] text-slate-400 block font-normal">
              {isAccommodation ? "Starting from" : "Estimated"}
            </span>
            <span className="font-bold text-slate-800 text-sm">
              {shop.priceRange
                ? shop.priceRange
                : isAccommodation
                ? "LKR 4,500 / night"
                : "LKR 1,000–3,000"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleDirectionsClick}
              title="Get Directions on Google Maps"
              className="inline-flex items-center justify-center gap-1 px-2.5 py-2 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
            >
              <Navigation size={12} className="text-emerald-600" />
              <span className="hidden sm:inline">Directions</span>
            </button>

            <button
              type="button"
              onClick={handleCardClick}
              className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <span>View</span>
              <ArrowUpRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

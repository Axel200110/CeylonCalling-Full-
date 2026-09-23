import React, { useState } from "react";
import {
  Bed,
  Users,
  Wifi,
  Snowflake,
  Bath,
  CheckCircle2,
  Calendar,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { resolveImageUrl } from "../../utils/formatters";

/**
 * Small utility outline icon for room amenities
 */
const getFacilityIcon = (fac = "") => {
  const f = fac.toLowerCase();
  if (f.includes("wifi")) return <Wifi size={12} className="text-slate-500 shrink-0" />;
  if (f.includes("air") || f.includes("ac")) return <Snowflake size={12} className="text-slate-500 shrink-0" />;
  if (f.includes("bath") || f.includes("hot water") || f.includes("water")) return <Bath size={12} className="text-slate-500 shrink-0" />;
  return <CheckCircle2 size={12} className="text-slate-500 shrink-0" />;
};

export default function CustomerRoomCard({ room, shop, onBookRoom }) {
  const rawPhotos = Array.isArray(room.photos) && room.photos.length > 0
    ? room.photos
    : Array.isArray(room.images) && room.images.length > 0
    ? room.images
    : [];

  const uniquePhotos = Array.from(new Set(rawPhotos.filter(Boolean)));
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  const fallbackPhoto = "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80";

  const displayPhoto = uniquePhotos.length > 0
    ? resolveImageUrl(uniquePhotos[activePhotoIdx], "hotel")
    : fallbackPhoto;

  const isUnavailable =
    room.status === "maintenance" ||
    room.status === "booked" ||
    (room.availableUnits !== undefined && room.availableUnits <= 0) ||
    shop?.operationalStatus === "closed";

  const handlePrevPhoto = (e) => {
    e.stopPropagation();
    setActivePhotoIdx((prev) => (prev > 0 ? prev - 1 : uniquePhotos.length - 1));
  };

  const handleNextPhoto = (e) => {
    e.stopPropagation();
    setActivePhotoIdx((prev) => (prev < uniquePhotos.length - 1 ? prev + 1 : 0));
  };

  return (
    <article className="group flex flex-col bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200">
      {/* 1. Photo Section with Multi-Photo Switcher */}
      <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden shrink-0">
        <img
          src={displayPhoto}
          alt={room.name || "Room preview"}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = fallbackPhoto;
          }}
        />

        {/* Room Type & Availability Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/95 text-slate-900 text-[11px] font-bold border border-slate-200/60 shadow-xs backdrop-blur-xs">
            <Bed size={13} className="text-emerald-600 shrink-0" />
            <span>{room.roomType || "Suite"}</span>
          </span>

          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide border shadow-xs backdrop-blur-xs ${
              !isUnavailable
                ? "bg-emerald-50/95 text-emerald-800 border-emerald-200"
                : "bg-slate-900/80 text-white border-slate-800"
            }`}
          >
            {!isUnavailable ? "Available" : "Unavailable"}
          </span>
        </div>

        {/* Previous & Next arrows if multiple photos */}
        {uniquePhotos.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevPhoto}
              className="absolute left-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-sm"
              aria-label="Previous photo"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={handleNextPhoto}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-sm"
              aria-label="Next photo"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}

        {/* Photo dots indicator at bottom */}
        {uniquePhotos.length > 1 && (
          <div className="absolute bottom-2.5 left-0 right-0 flex items-center justify-center gap-1.5 pointer-events-none">
            {uniquePhotos.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  activePhotoIdx === idx ? "w-4 bg-white" : "w-1.5 bg-white/60"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* 2. Room Content */}
      <div className="flex flex-col justify-between flex-1 p-4 sm:p-5 space-y-4">
        <div className="space-y-2.5">
          {/* Room Name */}
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-emerald-600 transition-colors">
              {room.name}
            </h3>

            {/* Capacity and Bed Specification */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <Users size={13} className="text-slate-400 shrink-0" />
                <span>Up to {room.capacityGuests || 2} Guests</span>
              </span>

              <span className="inline-flex items-center gap-1">
                <Bed size={13} className="text-slate-400 shrink-0" />
                <span>{room.bedType || "1 Queen Bed"}</span>
              </span>
            </div>
          </div>

          {/* Description if available */}
          {room.description && (
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-normal">
              {room.description}
            </p>
          )}

          {/* Key Facilities / Amenities */}
          {Array.isArray(room.facilities) && room.facilities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {room.facilities.slice(0, 4).map((fac, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200/80 text-[11px] font-medium text-slate-600"
                >
                  {getFacilityIcon(fac)}
                  <span>{fac}</span>
                </span>
              ))}
              {room.facilities.length > 4 && (
                <span className="text-[10px] text-slate-400 self-center">
                  +{room.facilities.length - 4} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* 3. Price & Reserve CTA Button */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-medium">Per night</span>
            <span className="text-base font-bold text-slate-900 leading-none">
              LKR {Number(room.pricePerNight || 0).toLocaleString()}
            </span>
          </div>

          <button
            type="button"
            disabled={isUnavailable}
            onClick={() => onBookRoom && onBookRoom(room)}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 disabled:pointer-events-none text-white text-xs font-semibold shadow-xs transition shrink-0"
          >
            <Calendar size={13} />
            <span>Reserve Suite</span>
          </button>
        </div>
      </div>
    </article>
  );
}

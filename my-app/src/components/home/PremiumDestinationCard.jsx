import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Camera, Heart, MapPin } from "lucide-react";
import { useEffect, useState } from "react";

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

  const images = [primary, ...(typeImages[type] || typeImages.restaurant)].filter(Boolean);
  return Array.from(new Set(images));
};

export default function PremiumDestinationCard({ shop, categories = [], onViewMenu }) {
  const [activeImage, setActiveImage] = useState(0);
  const [hovered, setHovered] = useState(false);
  const images = getShopImageSet(shop);

  useEffect(() => {
    if (images.length <= 1) return undefined;
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

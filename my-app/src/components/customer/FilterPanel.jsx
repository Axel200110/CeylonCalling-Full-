import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal,
  X,
  MapPin,
  RefreshCw,
  Layers,
} from "lucide-react";
import {
  ESTABLISHMENT_TYPES,
  RESTAURANT_CATEGORIES,
  RESTAURANT_SERVICES,
  SRI_LANKAN_DISTRICTS,
} from "../../pages/PartnerWithUs/constants";

export const PRICE_TIERS = [
  { id: "all", label: "Any Price", desc: "All price tiers" },
  { id: "budget", label: "Budget", desc: "Below LKR 1,000" },
  { id: "standard", label: "Standard", desc: "LKR 1,000–3,000" },
  { id: "premium", label: "Premium", desc: "Above LKR 3,000" },
];

export const RATING_OPTIONS = [
  { id: "all", label: "All Ratings" },
  { id: "4.5", label: "4.5 & up", icon: "⭐" },
  { id: "4.0", label: "4.0 & up", icon: "⭐" },
  { id: "3.5", label: "3.5 & up", icon: "⭐" },
];

export const SORT_OPTIONS = [
  { id: "featured", label: "Featured & Popular" },
  { id: "rating", label: "Highest Rated" },
  { id: "likes", label: "Most Liked" },
  { id: "price_asc", label: "Price: Low to High" },
  { id: "price_desc", label: "Price: High to Low" },
  { id: "name", label: "Alphabetical (A-Z)" },
];

export default function FilterPanel({
  selectedType = "all",
  setSelectedType,
  selectedFoodCategory = "all",
  setSelectedFoodCategory,
  selectedDistrict,
  setSelectedDistrict,
  selectedPrice,
  setSelectedPrice,
  selectedRating,
  setSelectedRating,
  selectedServices,
  setSelectedServices,
  sortBy,
  setSortBy,
  onResetFilters,
  isOpen,
  onClose,
}) {
  const toggleService = (serviceId) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter((s) => s !== serviceId));
    } else {
      setSelectedServices([...selectedServices, serviceId]);
    }
  };

  const FilterContent = () => (
    <div className="space-y-6 text-slate-800">
      {/* 1. Sort By */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Sort By
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* 2. Establishment Type */}
      {setSelectedType && (
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Establishment Type
          </label>
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              if (setSelectedFoodCategory && e.target.value !== "restaurant") {
                setSelectedFoodCategory("all");
              }
            }}
            className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
          >
            <option value="all">All Establishment Types</option>
            {ESTABLISHMENT_TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.emoji} {t.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 3. Food Category (Only for Restaurant) */}
      {(selectedType === "restaurant" || selectedType === "all") && setSelectedFoodCategory && (
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Food Category / Cuisine
          </label>
          <select
            value={selectedFoodCategory}
            onChange={(e) => setSelectedFoodCategory(e.target.value)}
            className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
          >
            <option value="all">All Cuisines & Styles</option>
            {RESTAURANT_CATEGORIES.map((fc) => (
              <option key={fc.id} value={fc.id}>
                {fc.emoji} {fc.label} ({fc.sinhala})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 4. District / Location */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
          <span>District / Region</span>
          <MapPin size={13} className="text-emerald-500" />
        </label>
        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
        >
          <option value="all">All Sri Lanka</option>
          {SRI_LANKAN_DISTRICTS.map((d) => (
            <option key={d.id} value={d.id}>
              {d.label} ({d.sinhala})
            </option>
          ))}
        </select>
      </div>

      {/* 5. Price Tier */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Price Range
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {PRICE_TIERS.map((tier) => {
            const isSelected = selectedPrice === tier.id;
            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => setSelectedPrice(tier.id)}
                className={`p-2 rounded-xl text-left border transition-all ${
                  isSelected
                    ? "bg-emerald-50 border-emerald-500 text-emerald-800 font-bold shadow-xs ring-1 ring-emerald-500"
                    : "bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-700 text-xs font-medium"
                }`}
              >
                <div className="text-xs font-bold">{tier.label}</div>
                <div className="text-[10px] text-slate-400 font-light">{tier.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Ratings Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Minimum Rating
        </label>
        <div className="flex flex-wrap gap-1.5">
          {RATING_OPTIONS.map((rat) => {
            const isSelected = selectedRating === rat.id;
            return (
              <button
                key={rat.id}
                type="button"
                onClick={() => setSelectedRating(rat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${
                  isSelected
                    ? "bg-amber-50 border-amber-400 text-amber-900 shadow-xs"
                    : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600 font-medium"
                }`}
              >
                {rat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 7. Facilities & Services */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Services & Facilities
        </label>
        <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
          {RESTAURANT_SERVICES.map((svc) => {
            const isChecked = selectedServices.includes(svc.id);
            const Icon = svc.icon;
            return (
              <button
                key={svc.id}
                type="button"
                onClick={() => toggleService(svc.id)}
                className={`flex items-center gap-2 p-2 rounded-xl text-xs font-semibold border transition text-left ${
                  isChecked
                    ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                    : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 font-medium"
                }`}
              >
                <Icon size={13} className={isChecked ? "text-emerald-400 shrink-0" : "text-slate-400 shrink-0"} />
                <span className="truncate">{svc.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Reset Action */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onResetFilters}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition"
        >
          <RefreshCw size={13} />
          <span>Reset All Filters</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar Layout */}
      <aside className="hidden lg:block w-72 shrink-0 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm self-start sticky top-24">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 font-black text-slate-900 text-sm tracking-tight">
            <SlidersHorizontal size={16} className="text-emerald-600" />
            <span>Filter Places</span>
          </div>
          <button
            onClick={onResetFilters}
            className="text-[11px] font-bold text-emerald-600 hover:underline"
          >
            Clear
          </button>
        </div>
        <FilterContent />
      </aside>

      {/* Mobile Drawer / Bottom Sheet Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto z-10"
            >
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 font-black text-slate-900 text-base">
                  <SlidersHorizontal size={18} className="text-emerald-600" />
                  <span>Filter Places</span>
                </div>
                <button
                  onClick={onClose}
                  className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-900"
                >
                  <X size={16} />
                </button>
              </div>

              <FilterContent />

              <div className="mt-6 pt-4 border-t border-slate-100 flex gap-3">
                <button
                  type="button"
                  onClick={onResetFilters}
                  className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-2xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-md transition"
                >
                  Show Results
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

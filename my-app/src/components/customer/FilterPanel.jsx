import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal,
  X,
  MapPin,
  RotateCcw,
  Star,
  ChevronDown,
} from "lucide-react";
import {
  ESTABLISHMENT_TYPES,
  RESTAURANT_CATEGORIES,
  RESTAURANT_SERVICES,
  SRI_LANKAN_DISTRICTS,
  getCitiesByDistrict,
} from "../../pages/PartnerWithUs/constants";

export const PRICE_TIERS = [
  { id: "all", label: "Any Price", desc: "All price tiers" },
  { id: "budget", label: "Budget", desc: "Below LKR 1,000" },
  { id: "standard", label: "Standard", desc: "LKR 1,000–3,000" },
  { id: "premium", label: "Premium", desc: "Above LKR 3,000" },
];

export const RATING_OPTIONS = [
  { id: "all", label: "Any Rating" },
  { id: "4.5", label: "4.5 & up" },
  { id: "4.0", label: "4.0 & up" },
  { id: "3.5", label: "3.5 & up" },
];

export default function FilterPanel({
  selectedType = "all",
  setSelectedType,
  selectedFoodCategory = "all",
  setSelectedFoodCategory,
  selectedDistrict,
  setSelectedDistrict,
  selectedCity = "all",
  setSelectedCity,
  selectedPrice,
  setSelectedPrice,
  selectedRating,
  setSelectedRating,
  selectedServices,
  setSelectedServices,
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
      {/* 1. Establishment Type */}
      {setSelectedType && (
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Establishment Type
          </label>
          <div className="relative">
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                if (setSelectedFoodCategory && e.target.value !== "restaurant") {
                  setSelectedFoodCategory("all");
                }
              }}
              className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg px-3 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer appearance-none pr-8"
            >
              <option value="all">All Establishment Types</option>
              {ESTABLISHMENT_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      )}

      {/* 2. Food Category (Only for Restaurant) */}
      {(selectedType === "restaurant" || selectedType === "all") && setSelectedFoodCategory && (
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Food Category / Cuisine
          </label>
          <div className="relative">
            <select
              value={selectedFoodCategory}
              onChange={(e) => setSelectedFoodCategory(e.target.value)}
              className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg px-3 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer appearance-none pr-8"
            >
              <option value="all">All Cuisines &amp; Styles</option>
              {RESTAURANT_CATEGORIES.map((fc) => (
                <option key={fc.id} value={fc.id}>
                  {fc.label} ({fc.sinhala})
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      )}

      {/* 3. District / Location */}
      <div className="space-y-2 pt-4 border-t border-slate-200/80">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <MapPin size={13} className="text-emerald-600" />
          <span>North Central District</span>
        </label>
        <div className="relative">
          <select
            value={selectedDistrict}
            onChange={(e) => {
              setSelectedDistrict(e.target.value);
              if (setSelectedCity) setSelectedCity("all");
            }}
            className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg px-3 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer appearance-none pr-8"
          >
            <option value="all">All North Central Province</option>
            {SRI_LANKAN_DISTRICTS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label} ({d.sinhala})
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* 3b. City / Tourism Zone */}
      {setSelectedCity && selectedDistrict && selectedDistrict !== "all" && (
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Town / Heritage Zone
          </label>
          <div className="relative">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg px-3 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer appearance-none pr-8"
            >
              <option value="all">
                All Towns in {selectedDistrict.charAt(0).toUpperCase() + selectedDistrict.slice(1)}
              </option>
              {getCitiesByDistrict(selectedDistrict).map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name} ({c.sinhala})
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      )}

      {/* 4. Price Tier */}
      <div className="space-y-3 pt-4 border-t border-slate-200/80">
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
                className={`px-2.5 py-2 rounded-lg border text-left text-xs transition ${
                  isSelected
                    ? "bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold"
                    : "bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-600"
                }`}
              >
                <div className="font-semibold leading-tight">{tier.label}</div>
                <div className="text-[10px] text-slate-400 font-normal mt-0.5">{tier.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Ratings Filter */}
      <div className="space-y-3 pt-4 border-t border-slate-200/80">
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
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs transition ${
                  isSelected
                    ? "bg-amber-50 border-amber-400 text-amber-900 font-semibold"
                    : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600 font-medium"
                }`}
              >
                {rat.id !== "all" && <Star size={11} className="fill-amber-400 text-amber-400" />}
                <span>{rat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Facilities & Services */}
      <div className="space-y-3 pt-4 border-t border-slate-200/80">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Services &amp; Facilities
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
                className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium border transition text-left ${
                  isChecked
                    ? "bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold"
                    : "bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-600"
                }`}
              >
                <Icon size={13} className={isChecked ? "text-emerald-600 shrink-0" : "text-slate-400 shrink-0"} />
                <span className="truncate">{svc.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 7. Reset Action */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onResetFilters}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-slate-200 hover:bg-slate-100/80 text-slate-600 text-xs font-semibold transition"
        >
          <RotateCcw size={13} />
          <span>Reset All Filters</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar Layout */}
      <aside className="hidden lg:block w-72 shrink-0 bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs self-start sticky top-24">
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <SlidersHorizontal size={16} className="text-emerald-600" />
            <span>Filters</span>
          </div>
          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
          >
            Clear all
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
              className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto z-10"
            >
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                  <SlidersHorizontal size={18} className="text-emerald-600" />
                  <span>Filters</span>
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
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 shadow-md transition"
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

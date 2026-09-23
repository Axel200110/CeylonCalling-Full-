import React from "react";
import { motion } from "framer-motion";
import {
  Compass,
  Utensils,
  Hotel,
  Home,
  Bed,
  Building2,
} from "lucide-react";
import { RESTAURANT_CATEGORIES } from "../../pages/PartnerWithUs/constants";

export const ESTABLISHMENT_NAV = [
  { id: "all", label: "All Venues", icon: Compass, emoji: "🌐" },
  { id: "restaurant", label: "Restaurants", icon: Utensils, emoji: "🍽️" },
  { id: "stays", label: "Hotels & Stays", icon: Hotel, emoji: "🏨" },
  { id: "hotel", label: "Hotels & Resorts", icon: Building2, emoji: "🏢" },
  { id: "villa", label: "Villas", icon: Home, emoji: "🏡" },
  { id: "guesthouse", label: "Guest Houses", icon: Bed, emoji: "🛌" },
];

export const STAY_SUB_NAV = [
  { id: "stays", label: "All Stays & Accommodations", emoji: "🏨" },
  { id: "hotel", label: "Hotels & Resorts", emoji: "🏢" },
  { id: "villa", label: "Private Villas", emoji: "🏡" },
  { id: "guesthouse", label: "Guest Houses", emoji: "🛌" },
];

export default function CategoryNav({
  selectedCategory,
  onSelectCategory,
  selectedFoodCategory = "all",
  onSelectFoodCategory,
}) {
  const showFoodCategories = selectedCategory === "restaurant";
  const showStayCategories =
    selectedCategory === "stays" ||
    selectedCategory === "hotel" ||
    selectedCategory === "villa" ||
    selectedCategory === "guesthouse";

  return (
    <div className="w-full space-y-2.5 py-1">
      {/* 1. Core Establishment Types Chips (Horizontal scrollable, touch-friendly) */}
      <div className="relative">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 pt-0.5 px-0.5 select-none scroll-smooth">
          {ESTABLISHMENT_NAV.map((cat) => {
            const isSelected =
              selectedCategory === cat.id ||
              (cat.id === "stays" &&
                !["all", "restaurant", "hotel", "villa", "guesthouse"].includes(selectedCategory));

            return (
              <motion.button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${
                  isSelected
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-slate-200/80 shadow-xs"
                }`}
              >
                <span className="text-sm">{cat.emoji}</span>
                <span>{cat.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 2a. Restaurant Food Cuisines Sub-Nav */}
      {showFoodCategories && onSelectFoodCategory && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 px-0.5"
        >
          <button
            type="button"
            onClick={() => onSelectFoodCategory("all")}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition shrink-0 ${
              selectedFoodCategory === "all"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-emerald-50 text-emerald-800 border border-emerald-100 hover:bg-emerald-100"
            }`}
          >
            All Cuisines
          </button>
          {RESTAURANT_CATEGORIES.map((fc) => {
            const isSelected = selectedFoodCategory === fc.id;
            return (
              <button
                key={fc.id}
                type="button"
                onClick={() => onSelectFoodCategory(fc.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition shrink-0 ${
                  isSelected
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50"
                }`}
              >
                <span>{fc.emoji}</span>
                <span>{fc.label}</span>
              </button>
            );
          })}
        </motion.div>
      )}

      {/* 2b. Stays Accommodation Types Sub-Nav */}
      {showStayCategories && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 px-0.5"
        >
          {STAY_SUB_NAV.map((stay) => {
            const isSelected = selectedCategory === stay.id;
            return (
              <button
                key={stay.id}
                type="button"
                onClick={() => onSelectCategory(stay.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition shrink-0 ${
                  isSelected
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-emerald-50/70 text-emerald-900 border border-emerald-100 hover:bg-emerald-100"
                }`}
              >
                <span>{stay.emoji}</span>
                <span>{stay.label}</span>
              </button>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}

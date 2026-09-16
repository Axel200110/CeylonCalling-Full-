import React from "react";
import { motion } from "framer-motion";
import {
  Compass,
  Utensils,
  Hotel,
  Home,
  Bed,
} from "lucide-react";
import { RESTAURANT_CATEGORIES } from "../../pages/PartnerWithUs/constants";

export const ESTABLISHMENT_NAV = [
  { id: "all", label: "All Places", icon: Compass, emoji: "🌐" },
  { id: "restaurant", label: "Restaurants", icon: Utensils, emoji: "🍽️" },
  { id: "hotel", label: "Hotels & Resorts", icon: Hotel, emoji: "🏨" },
  { id: "villa", label: "Private Villas", icon: Home, emoji: "🏡" },
  { id: "guesthouse", label: "Guest Houses", icon: Bed, emoji: "🛌" },
];

export default function CategoryNav({
  selectedCategory,
  onSelectCategory,
  selectedFoodCategory = "all",
  onSelectFoodCategory,
}) {
  const showFoodCategories = selectedCategory === "restaurant";

  return (
    <div className="w-full space-y-3 py-2">
      {/* 1. Core Establishment Types Chips */}
      <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-hide pb-1 pt-1 px-1">
        {ESTABLISHMENT_NAV.map((cat) => {
          const isSelected = selectedCategory === cat.id;

          return (
            <motion.button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0 select-none ${
                isSelected
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/10 ring-2 ring-slate-900/5"
                  : "bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-slate-200/80 shadow-sm"
              }`}
            >
              <span className="text-sm">{cat.emoji}</span>
              <span>{cat.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* 2. Restaurant Food Categories Sub-Nav (When Restaurant selected) */}
      {showFoodCategories && onSelectFoodCategory && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 px-1"
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
    </div>
  );
}

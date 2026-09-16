// PartnerWithUs/components/CategorySelector.jsx

import { ChevronDown, ChevronUp, Layers } from "lucide-react";
import { useMemo, useState } from "react";
import { MAX_CATEGORIES } from "../constants";

const CategorySelector = ({ 
  categories = [], 
  selected = [], 
  onToggle, 
  title = "Classification Categories", 
  maxSelect = MAX_CATEGORIES 
}) => {
  const [showAll, setShowAll] = useState(false);

  // Memoize metrics to maximize performance during high-frequency selection updates
  const totalCount = categories.length;
  const selectedCount = selected.length;
  const isLimitReached = selectedCount >= maxSelect;
  const hasMore = totalCount > 8;
  
  const displayCategories = useMemo(() => {
    return showAll ? categories : categories.slice(0, 8);
  }, [showAll, categories]);

  // Compute selection percentage for the micro-progress gauge
  const progressPercentage = Math.min((selectedCount / maxSelect) * 100, 100);

  // Dynamic branding accents depending on selection weight
  const getBadgeColorStyles = () => {
    if (selectedCount === 0) return "bg-slate-100 text-slate-500 border-slate-200";
    if (isLimitReached) return "bg-emerald-500 text-white border-emerald-600 shadow-sm shadow-emerald-500/20";
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 md:p-6 shadow-sm space-y-4 transition-all duration-300">
      
      {/* Header Deck: Semantic Indicators & Dynamic Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-50">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-slate-50 rounded-lg text-slate-500">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              {title}
            </h4>
            <p className="text-[11px] text-slate-400">Select operational features aligned with your core amenities.</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5 min-w-[120px]">
          <div className={`text-xs font-bold px-2.5 py-1 rounded-full border transition-all duration-300 ${getBadgeColorStyles()}`}>
            {selectedCount} / {maxSelect} Allocated
          </div>
          {/* Micro Linear Progress Tracker */}
          <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grid Canvas: High Fidelity Category Selection Matrices */}
      <div 
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 transition-all duration-300"
        role="group"
        aria-label={title}
      >
        {displayCategories.map((category) => {
          const isChecked = selected.includes(category.id);
          const isDisabled = isLimitReached && !isChecked;

          return (
            <label
              key={category.id}
              className={`group flex items-start gap-3 p-3 rounded-xl border font-semibold cursor-pointer transition-all duration-300 transform active:scale-[0.98] select-none ${
                isChecked
                  ? "bg-gradient-to-br from-emerald-50/60 to-white border-emerald-500/80 text-emerald-950 shadow-sm ring-1 ring-emerald-500/10"
                  : isDisabled
                  ? "bg-slate-50/30 border-slate-100/70 text-slate-400 cursor-not-allowed opacity-60"
                  : "bg-slate-50/40 border-slate-200/60 hover:border-slate-300 bg-white text-slate-700 hover:bg-slate-50/80 shadow-sm"
              }`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onToggle(category.id)}
                disabled={isDisabled}
                className="sr-only"
                aria-label={`Select operational module: ${category.label}`}
              />

              {/* Dynamic Modern Selector Indicator */}
              <div 
                className={`w-4 h-4 rounded-md border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200 ${
                  isChecked
                    ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
                    : isDisabled
                    ? "border-slate-200 bg-slate-100"
                    : "border-slate-300 bg-white group-hover:border-slate-400"
                }`}
                aria-hidden="true"
              >
                {isChecked && (
                  <svg className="w-3 h-3 text-white stroke-[3.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>

              {/* Rich Context Multi-Language Label */}
              <div className="min-w-0 flex-1 space-y-0.5">
                <div className="flex items-center gap-1.5 leading-tight">
                  <span className="text-base select-none filter drop-shadow-sm group-hover:scale-110 transition-transform duration-200" aria-hidden="true">
                    {category.emoji}
                  </span>
                  <span className={`text-xs font-bold truncate transition-colors ${isChecked ? "text-emerald-950" : "text-slate-800"}`}>
                    {category.label}
                  </span>
                </div>
                {category.sinhala && (
                  <span className={`text-[10px] block truncate tracking-tight font-medium ${
                    isChecked ? "text-emerald-700/80 font-semibold" : "text-slate-400"
                  }`}>
                    {category.sinhala}
                  </span>
                )}
              </div>
            </label>
          );
        })}
      </div>

      {/* Control Footer: Micro-action Show More/Less Button */}
      {hasMore && (
        <div className="pt-2 flex justify-start">
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border shadow-sm transition-all duration-200 ${
              showAll 
                ? "bg-white text-slate-700 border-slate-200 hover:bg-slate-50" 
                : "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100/70"
            }`}
            aria-expanded={showAll}
          >
            {showAll ? (
              <>
                Collapse View <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                View All {totalCount} Modules <ChevronDown className="w-3.5 h-3.5 animate-bounce" style={{ animationDuration: '2s' }} />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default CategorySelector;
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, SlidersHorizontal } from "lucide-react";
import DiscoverFilterSidebar from "./DiscoverFilterSidebar";

export default function DiscoverMobileFilter({
  isOpen,
  onClose,
  totalResultsCount,
  ...filterProps
}) {
  // Lock background scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center lg:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Drawer / Modal Container */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-filter-heading"
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[90vh] flex flex-col z-10 overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <SlidersHorizontal size={16} className="text-emerald-600" />
                <h2 id="mobile-filter-heading">Filters</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="h-9 w-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition"
                aria-label="Close filters"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable Filter Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <DiscoverFilterSidebar
                totalResultsCount={totalResultsCount}
                {...filterProps}
              />
            </div>

            {/* Sticky Bottom Actions */}
            <div className="p-4 border-t border-slate-100 bg-white shrink-0 flex gap-3">
              <button
                type="button"
                onClick={filterProps.onResetFilters}
                className="flex-1 min-h-[44px] py-2.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 active:bg-slate-100 transition"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 min-h-[44px] py-2.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 active:bg-emerald-800 shadow-xs transition"
              >
                Show {totalResultsCount} {totalResultsCount === 1 ? "Place" : "Places"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

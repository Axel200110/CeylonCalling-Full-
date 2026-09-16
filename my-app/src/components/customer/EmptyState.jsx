import React from "react";
import { UtensilsCrossed, Compass, RefreshCw, SearchX, MapPinOff } from "lucide-react";

export default function EmptyState({
  icon = "search",
  title = "No venues found",
  description = "We couldn't find any places matching your current filters. Try changing your search keywords or resetting filters.",
  actionText = "Clear Filters",
  onAction,
}) {
  const getIcon = () => {
    switch (icon) {
      case "food":
        return <UtensilsCrossed size={36} className="text-emerald-500" />;
      case "location":
        return <MapPinOff size={36} className="text-emerald-500" />;
      case "compass":
        return <Compass size={36} className="text-emerald-500" />;
      default:
        return <SearchX size={36} className="text-emerald-500" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-3xl border border-slate-100/80 shadow-sm max-w-lg mx-auto my-8 space-y-4">
      <div className="w-20 h-20 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
        {getIcon()}
      </div>
      <div className="space-y-1.5">
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed font-light">{description}</p>
      </div>
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-emerald-600 text-white text-xs font-semibold shadow-sm transition duration-200 mt-2"
        >
          <RefreshCw size={13} />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
}

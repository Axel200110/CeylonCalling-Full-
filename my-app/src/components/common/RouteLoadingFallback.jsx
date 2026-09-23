import React from "react";

export default function RouteLoadingFallback() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-emerald-600 animate-spin" />
        <span className="text-xs font-medium text-slate-500 tracking-wide">Loading...</span>
      </div>
    </div>
  );
}

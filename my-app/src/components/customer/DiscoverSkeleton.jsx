import React from "react";

export default function DiscoverSkeleton({ count = 6 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs animate-pulse"
        >
          {/* 16:10 Image Placeholder */}
          <div className="aspect-[16/10] bg-slate-200 w-full shrink-0" />

          {/* Card Content Skeleton */}
          <div className="p-4 sm:p-5 space-y-3.5 flex-1 flex flex-col justify-between">
            <div className="space-y-2">
              {/* Title & Badge */}
              <div className="flex items-center justify-between gap-4">
                <div className="h-5 bg-slate-200 rounded-md w-3/5" />
                <div className="h-4 bg-slate-200 rounded-md w-12" />
              </div>

              {/* Location */}
              <div className="h-3.5 bg-slate-100 rounded-md w-2/5" />

              {/* Rating */}
              <div className="h-3.5 bg-slate-100 rounded-md w-1/4" />

              {/* Tags */}
              <div className="flex gap-1.5 pt-1">
                <div className="h-4 bg-slate-100 rounded-md w-14" />
                <div className="h-4 bg-slate-100 rounded-md w-14" />
                <div className="h-4 bg-slate-100 rounded-md w-14" />
              </div>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="space-y-1">
                <div className="h-2.5 bg-slate-100 rounded w-12" />
                <div className="h-4 bg-slate-200 rounded-md w-20" />
              </div>
              <div className="h-8 bg-slate-200 rounded-lg w-24" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

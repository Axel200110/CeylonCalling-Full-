import React from "react";

export function RestaurantSkeleton({ count = 1 }) {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="flex flex-col bg-white rounded-3xl border border-slate-100/80 overflow-hidden shadow-sm animate-pulse"
        >
          <div className="aspect-[16/10] bg-slate-200 w-full" />
          <div className="p-5 space-y-3.5 flex-1 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <div className="h-5 bg-slate-200 rounded-lg w-3/5" />
                <div className="h-5 bg-slate-200 rounded-md w-12" />
              </div>
              <div className="h-4 bg-slate-100 rounded-md w-2/5" />
              <div className="h-3.5 bg-slate-100 rounded-md w-full" />
              <div className="h-3.5 bg-slate-100 rounded-md w-4/5" />
            </div>
            <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
              <div className="h-4 bg-slate-100 rounded-md w-20" />
              <div className="flex gap-1.5">
                <div className="h-4 bg-slate-100 rounded-full w-12" />
                <div className="h-4 bg-slate-100 rounded-full w-12" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export function FoodSkeleton({ count = 1 }) {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="flex flex-col bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm animate-pulse"
        >
          <div className="aspect-[4/3] bg-slate-200 w-full" />
          <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="h-4 bg-slate-200 rounded-md w-3/5" />
                <div className="h-4 bg-slate-200 rounded-md w-16" />
              </div>
              <div className="h-3 bg-slate-100 rounded-md w-2/5" />
            </div>
            <div className="pt-2 border-t border-slate-50 flex items-center justify-between">
              <div className="h-3 bg-slate-100 rounded-md w-16" />
              <div className="h-8 bg-slate-200 rounded-xl w-20" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export function RestaurantDetailsSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-pulse">
      <div className="aspect-[2.5/1] rounded-3xl bg-slate-200 w-full" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 space-y-4">
            <div className="h-6 bg-slate-200 rounded-lg w-1/4" />
            <div className="h-4 bg-slate-100 rounded-md w-full" />
            <div className="h-4 bg-slate-100 rounded-md w-5/6" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FoodSkeleton count={4} />
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 space-y-4">
            <div className="h-5 bg-slate-200 rounded-md w-1/2" />
            <div className="h-4 bg-slate-100 rounded-md w-full" />
            <div className="h-4 bg-slate-100 rounded-md w-3/4" />
          </div>
        </div>
      </div>
    </div>
  );
}

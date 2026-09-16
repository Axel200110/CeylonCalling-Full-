export default function ShopSkeleton() {
  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse select-none">
      {/* 16:10 Shimmer Box */}
      <div className="aspect-[16/10] bg-slate-100 relative" />

      {/* Content Shimmer */}
      <div className="p-4 space-y-4 flex-grow flex flex-col justify-between">
        <div className="space-y-2.5">
          <div className="flex justify-between items-center gap-4">
            <div className="h-4 bg-slate-100 rounded-md w-3/5" />
            <div className="h-5 bg-slate-100 rounded-md w-12 shrink-0" />
          </div>

          <div className="flex items-center gap-1.5 pt-1">
            <div className="h-3.5 bg-slate-100 rounded-full w-4 shrink-0" />
            <div className="h-3 bg-slate-100 rounded-md w-2/5" />
          </div>

          <div className="space-y-1.5 pt-2">
            <div className="h-2.5 bg-slate-100 rounded-md w-full" />
            <div className="h-2.5 bg-slate-100 rounded-md w-4/5" />
          </div>
        </div>

        {/* Price & Services badges shimmer */}
        <div className="space-y-3 pt-3 border-t border-slate-50">
          <div className="flex justify-between items-center">
            <div className="h-3 bg-slate-100 rounded-md w-24" />
            <div className="h-3 bg-slate-100 rounded-md w-12" />
          </div>
          <div className="flex gap-1.5">
            <div className="h-5 bg-slate-100 rounded-md w-16" />
            <div className="h-5 bg-slate-100 rounded-md w-14" />
            <div className="h-5 bg-slate-100 rounded-md w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}

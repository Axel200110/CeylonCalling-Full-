export default function FoodSkeleton() {
  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse select-none">
      {/* 4:3 Shimmer Box */}
      <div className="aspect-[4/3] bg-slate-100" />

      {/* Content Shimmer */}
      <div className="p-4 space-y-3.5 flex-grow flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex justify-between items-center gap-4">
            <div className="h-4 bg-slate-100 rounded-md w-1/2" />
            <div className="h-4 bg-slate-100 rounded-md w-16 shrink-0" />
          </div>

          <div className="flex items-center gap-1.5 pt-1">
            <div className="h-3.5 bg-slate-100 rounded-full w-4 shrink-0" />
            <div className="h-3 bg-slate-100 rounded-md w-2/5" />
          </div>

          <div className="flex items-center gap-1.5">
            <div className="h-3.5 bg-slate-100 rounded-full w-4 shrink-0" />
            <div className="h-2.5 bg-slate-100 rounded-md w-1/3" />
          </div>
        </div>

        <div className="pt-2 border-t border-slate-50 flex justify-between items-center">
          <div className="h-2.5 bg-slate-100 rounded-md w-16" />
          <div className="h-3.5 bg-slate-100 rounded-md w-20" />
        </div>
      </div>
    </div>
  );
}

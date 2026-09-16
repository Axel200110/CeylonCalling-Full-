import { motion } from "framer-motion";
import { Compass } from "lucide-react";
import PremiumDestinationCard from "./PremiumDestinationCard";

export default function HomeResultsSection({ loadingShops, filteredShops, shopCategories, onViewMenu }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mt-12 space-y-6"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-600">Curated results</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">Find your perfect stay & dining experience</h2>
          <p className="mt-2 text-sm text-slate-500 sm:text-base">Premium stays and local favorites matched to your travel intent.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3.5 py-2 text-sm font-semibold text-emerald-700">
            {filteredShops.length} destination{filteredShops.length !== 1 ? "s" : ""} found
          </span>
          <span className="rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600">
            Live matching
          </span>
        </div>
      </div>

      {loadingShops ? (
        <div className="flex flex-col items-center justify-center rounded-[2rem] border border-slate-200 bg-white/80 py-20 shadow-sm">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600" />
          <p className="mt-3 text-sm font-medium text-slate-500">Gathering curated destinations...</p>
        </div>
      ) : filteredShops.length === 0 ? (
        <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <Compass size={24} />
          </div>
          <h3 className="mt-5 text-xl font-semibold text-slate-900">No destinations match your current filters</h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-slate-500">
            Try broadening your search or resetting the filters to reveal more experiences across Sri Lanka.
          </p>
          <button type="button" className="mt-6 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500">
            Reset search
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredShops.map((shop) => (
            <PremiumDestinationCard
              key={shop._id}
              shop={shop}
              categories={shopCategories[shop._id] || []}
              onViewMenu={onViewMenu}
            />
          ))}
        </div>
      )}
    </motion.section>
  );
}

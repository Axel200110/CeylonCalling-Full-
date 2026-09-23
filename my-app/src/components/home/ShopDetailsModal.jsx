import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export default function ShopDetailsModal({ selectedShop, foods, loadingFoods, onClose }) {
  if (!selectedShop) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-slate-950/70 p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative w-full max-w-4xl overflow-hidden rounded-[2rem] border border-white/20 bg-white shadow-2xl"
          initial={{ scale: 0.96, y: 24, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.96, y: 24, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
        >
          <button
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-700 shadow-sm transition hover:bg-slate-100"
            onClick={onClose}
            aria-label="Close details"
          >
            <X size={18} />
          </button>

          <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative min-h-[280px] bg-slate-100">
              <img
                src={selectedShop.photo ? `${selectedShop.photo}` : "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80"}
                alt={selectedShop.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-white backdrop-blur-md">
                {selectedShop.shopType === "hotel" ? "Lodging experience" : "Dining showcase"}
              </div>
            </div>
            <div className="p-6 sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-600">
                {selectedShop.shopType === "hotel" ? "Rooms & facilities" : "Menu highlights"}
              </p>
              <h3 className="mt-2 text-2xl font-bold text-slate-900">{selectedShop.name}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {selectedShop.description || "A polished destination selected for its atmosphere, comfort, and local charm."}
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">Price</div>
                  <div className="mt-1 text-lg font-semibold text-slate-900">{selectedShop.priceRange || "LKR 1800+"}</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">Location</div>
                  <div className="mt-1 text-lg font-semibold text-slate-900">{selectedShop.address || selectedShop.location || "Sri Lanka"}</div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {[(selectedShop.shopType || "restaurant"), "Verified", "Best choice"].map((item) => (
                  <span key={item} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600">
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-8">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-slate-900">What is available</h4>
                  <span className="text-sm font-medium text-slate-500">{foods.length} items</span>
                </div>
                {loadingFoods ? (
                  <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-6 text-center text-sm text-slate-500">
                    Loading details...
                  </div>
                ) : foods.length === 0 ? (
                  <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-6 text-center text-sm text-slate-500">
                    No details are listed yet for this selection.
                  </div>
                ) : (
                  <div className="mt-4 grid gap-3">
                    {foods.map((food) => (
                      <div key={food._id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
                        <div>
                          <p className="font-semibold text-slate-900">{food.name}</p>
                          <p className="mt-1 text-sm text-slate-500">{selectedShop.shopType === "hotel" ? "Comfort and amenities" : "Signature item"}</p>
                        </div>
                        <div className="text-sm font-semibold text-emerald-700">LKR {Number(food.price || 0).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

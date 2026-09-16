import { motion } from "framer-motion";
import { BedDouble, Building2, House, Search, Utensils } from "lucide-react";
import PriceFilter from "../FilterSection";

export default function HomeFilterPanel({
  tempFindWhat,
  tempSelectedDistricts,
  tempSelectedCravings,
  tempSelectedServices,
  tempPriceFilter,
  onFindWhatChange,
  onDistrictToggle,
  onCravingToggle,
  onServiceToggle,
  onResetFilters,
  onSearchSubmit,
  districts,
  sriLankanCravings,
  internationalCravings,
  hotelCategories,
  villaCategories,
  guestHouseCategories,
  restaurantServices,
}) {
  const isRestaurant = tempFindWhat === "restaurant";
  const isHotel = tempFindWhat === "hotel";
  const isVilla = tempFindWhat === "villa";
  const isGuestHouse = tempFindWhat === "guesthouse";

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative mt-10 overflow-hidden rounded-[2rem] border border-slate-200/80 bg-[linear-gradient(135deg,#fcfdfc_0%,#f7faf8_55%,#f4f7f6_100%)] p-6 shadow-[0_35px_90px_-50px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:p-8"
    >
      <div className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_58%)]" />
      <form onSubmit={onSearchSubmit} className="relative z-10 space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-700">
              <Search size={12} />
              Smart filter suite
            </div>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Shape your ideal Sri Lanka stay</h2>
            <p className="mt-2 text-sm leading-7 text-slate-500 sm:text-base">
              Discover the right experience with elegant, fast filters for stays, dining, districts, and budget.
            </p>
          </div>
          <button
            type="button"
            onClick={onResetFilters}
            className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:-translate-y-0.5 hover:bg-slate-50"
          >
            Reset filters
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-sm font-semibold text-emerald-700">1</span>
            <h3 className="text-lg font-semibold text-slate-900">What are you looking for?</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { id: "restaurant", label: "Restaurant", subtitle: "Cuisines & dining", icon: <Utensils size={20} /> },
              { id: "hotel", label: "Hotel / Resort", subtitle: "Luxury & comfort", icon: <Building2 size={20} /> },
              { id: "villa", label: "Private Villa", subtitle: "Private & scenic", icon: <House size={20} /> },
              { id: "guesthouse", label: "Guest House", subtitle: "Budget & pilgrim", icon: <BedDouble size={20} /> },
            ].map((option) => {
              const active = tempFindWhat === option.id;
              return (
                <motion.button
                  key={option.id}
                  type="button"
                  whileHover={{ y: -4, scale: 1.01, boxShadow: "0 20px 50px -25px rgba(16, 185, 129, 0.35)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onFindWhatChange(option.id)}
                  className={`rounded-[1.35rem] border p-4 text-left transition ${active ? "border-emerald-400 bg-emerald-50/80 shadow-[0_18px_45px_-28px_rgba(16,185,129,0.8)]" : "border-slate-200 bg-white/90 hover:border-slate-300 hover:bg-white"}`}
                >
                  <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl ${active ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-700"}`}>
                    {option.icon}
                  </div>
                  <p className="text-lg font-semibold text-slate-900">{option.label}</p>
                  <p className="mt-1 text-sm text-slate-500">{option.subtitle}</p>
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-sm font-semibold text-emerald-700">2</span>
            <h3 className="text-lg font-semibold text-slate-900">Choose district</h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {districts.map((district) => {
              const checked = tempSelectedDistricts.includes(district.id);
              return (
                <motion.label
                  key={district.id}
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex cursor-pointer items-center justify-between rounded-[1.15rem] border px-4 py-3 transition ${checked ? "border-emerald-300 bg-emerald-50/80 text-emerald-800 shadow-[0_16px_35px_-24px_rgba(16,185,129,0.75)]" : "border-slate-200 bg-white/80 text-slate-700 hover:bg-white"}`}
                >
                  <div>
                    <p className="text-sm font-semibold">{district.label}</p>
                    <p className="text-[11px] text-slate-500">{district.sinhala}</p>
                  </div>
                  <input type="checkbox" checked={checked} onChange={() => onDistrictToggle(district.id)} className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                </motion.label>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-sm font-semibold text-emerald-700">3</span>
            <h3 className="text-lg font-semibold text-slate-900">Pick your style</h3>
          </div>
          {isRestaurant ? (
            <div className="space-y-6">
              <div className="space-y-3">
                <h4 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Sri Lankan favorites</h4>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {sriLankanCravings.map((option) => {
                    const checked = tempSelectedCravings.includes(option.id);
                    return (
                      <motion.label
                        key={option.id}
                        whileHover={{ y: -2, scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex cursor-pointer items-center gap-3 rounded-[1.15rem] border px-3.5 py-3 transition ${checked ? "border-emerald-300 bg-emerald-50/80" : "border-slate-200 bg-white/90 hover:bg-slate-50"}`}
                      >
                        <input type="checkbox" checked={checked} onChange={() => onCravingToggle(option.id)} className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{option.label}</p>
                          <p className="text-[11px] text-slate-500">{option.sinhala}</p>
                        </div>
                      </motion.label>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Global cuisines</h4>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {internationalCravings.map((option) => {
                    const checked = tempSelectedCravings.includes(option.id);
                    return (
                      <motion.label
                        key={option.id}
                        whileHover={{ y: -2, scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex cursor-pointer items-center gap-3 rounded-[1.15rem] border px-3.5 py-3 transition ${checked ? "border-emerald-300 bg-emerald-50/80" : "border-slate-200 bg-white/90 hover:bg-slate-50"}`}
                      >
                        <input type="checkbox" checked={checked} onChange={() => onCravingToggle(option.id)} className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{option.label}</p>
                          <p className="text-[11px] text-slate-500">{option.sinhala}</p>
                        </div>
                      </motion.label>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Services & facilities</h4>
                <div className="flex flex-wrap gap-2">
                  {restaurantServices.map((service) => {
                    const checked = tempSelectedServices.includes(service.id);
                    return (
                      <motion.label
                        key={service.id}
                        whileHover={{ y: -2, scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        className={`cursor-pointer rounded-full border px-3.5 py-2 text-sm font-medium transition ${checked ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white/90 text-slate-600 hover:bg-slate-50"}`}
                      >
                        <input type="checkbox" checked={checked} onChange={() => onServiceToggle(service.id)} className="sr-only" />
                        {service.label}
                      </motion.label>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {(isHotel ? hotelCategories : isVilla ? villaCategories : guestHouseCategories).map((option) => {
                const checked = tempSelectedCravings.includes(option.id);
                return (
                  <motion.label
                    key={option.id}
                    whileHover={{ y: -2, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex cursor-pointer items-center gap-3 rounded-[1.15rem] border px-3.5 py-3 transition ${checked ? "border-emerald-300 bg-emerald-50/80" : "border-slate-200 bg-white/90 hover:bg-slate-50"}`}
                  >
                    <input type="checkbox" checked={checked} onChange={() => onCravingToggle(option.id)} className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{option.label}</p>
                      <p className="text-[11px] text-slate-500">{option.sinhala}</p>
                    </div>
                  </motion.label>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-sm font-semibold text-emerald-700">4</span>
            <h3 className="text-lg font-semibold text-slate-900">Budget range</h3>
          </div>
          <div className="rounded-[1.5rem] border border-slate-200 bg-white/80 p-4 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.3)]">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-800">Estimated spend</p>
                <p className="text-xs text-slate-500">Adjust for your stay or dining budget</p>
              </div>
              <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                LKR {tempPriceFilter.max}
              </div>
            </div>
            <PriceFilter min={0} max={5000} value={tempPriceFilter} onChange={onChange => onServiceToggle && onChange} />
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-end">
          <button type="button" onClick={onResetFilters} className="rounded-full border border-slate-200 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:-translate-y-0.5 hover:bg-slate-50">
            Clear all
          </button>
          <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_16px_50px_-20px_rgba(16,185,129,0.9)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_56px_-18px_rgba(16,185,129,0.95)]">
            <Search size={16} />
            Search destinations
          </button>
        </div>
      </form>
    </motion.section>
  );
}

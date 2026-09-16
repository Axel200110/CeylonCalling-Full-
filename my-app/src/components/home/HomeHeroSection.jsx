import { AnimatePresence, motion } from "framer-motion";
import { Compass, House, Search, Sparkles, Utensils } from "lucide-react";

export default function HomeHeroSection({
  heroSlides,
  heroIndex,
  onHeroChange,
  tempFindWhat,
  onFindWhatChange,
  onSearchClick,
}) {
  return (
    <motion.section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-slate-950 shadow-[0_40px_120px_-40px_rgba(15,23,42,0.65)]">
      <AnimatePresence mode="wait">
        <motion.div
          key={heroSlides[heroIndex].image}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-0 overflow-hidden"
        >
          <div
            className="absolute inset-0 scale-105 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroSlides[heroIndex].image})` }}
          />
          <img
            src={heroSlides[heroIndex].image}
            alt="Sri Lanka travel showcase"
            className="h-full w-full object-cover opacity-0"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.32),transparent_32%),linear-gradient(105deg,rgba(2,6,23,0.92)_0%,rgba(2,6,23,0.74)_42%,rgba(2,6,23,0.28)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,transparent_32%,rgba(2,6,23,0.18)_100%)]" />
          <div className="absolute -left-16 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-emerald-400/20 blur-[120px]" />
          <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-400/10 blur-[140px]" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 flex min-h-[640px] flex-col justify-between p-6 sm:p-8 lg:p-10">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-100 backdrop-blur-lg">
            <Sparkles size={13} />
            Ceylon Calling • Premium Travel Discovery
          </div>
          <div className="hidden items-center gap-2 md:flex">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.image}
                type="button"
                onClick={() => onHeroChange(index)}
                className={`h-2.5 rounded-full transition-all ${index === heroIndex ? "w-8 bg-white" : "w-2.5 bg-white/45"}`}
                aria-label={`Show slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <motion.div
            key={heroSlides[heroIndex].image}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-300">
              {heroSlides[heroIndex].eyebrow}
            </p>
            <h1 className="mt-4 text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
              {heroSlides[heroIndex].title}
            </h1>
            <p className="mt-4 text-xl font-medium text-emerald-100/90 sm:text-2xl">
              {heroSlides[heroIndex].sinhalaSubtitle}
            </p>
            <p className="mt-4 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
              {heroSlides[heroIndex].subtitle}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onSearchClick}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_16px_50px_-20px_rgba(16,185,129,0.85)] transition hover:-translate-y-0.5 hover:bg-emerald-400"
              >
                <Search size={16} />
                Search Destinations
              </button>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {[
                { label: "Restaurants", value: "restaurant" },
                { label: "Hotels", value: "hotel" },
                { label: "Villas", value: "villa" },
                { label: "Guest Houses", value: "guesthouse" },
              ].map((chip) => (
                <button
                  key={chip.value}
                  type="button"
                  onClick={() => onFindWhatChange(chip.value)}
                  className={`rounded-full border px-3.5 py-2 text-sm font-semibold transition ${tempFindWhat === chip.value ? "border-emerald-400 bg-emerald-500/20 text-emerald-100" : "border-white/15 bg-white/10 text-slate-200 hover:bg-white/15"}`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="rounded-[1.75rem] border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-2xl"
          >
            <div className="rounded-[1.4rem] border border-white/15 bg-slate-950/50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">Curated discovery</p>
                  <p className="mt-1 text-lg font-semibold text-white">Plan your next escape</p>
                </div>
                <div className="rounded-full bg-emerald-500/20 p-2 text-emerald-300">
                  <Compass size={16} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-3 py-3">
                <Search size={16} className="text-emerald-300" />
                <input
                  value={tempSelectedDistricts.length > 0 ? `${tempSelectedDistricts.length} district selected` : "Try Anuradhapura, Polonnaruwa..."}
                  readOnly
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-400"
                />
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <House size={14} className="text-emerald-300" />
                    Boutique stays
                  </div>
                  <p className="mt-1 text-sm text-slate-400">Heritage, lake view, and private villas.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <Utensils size={14} className="text-emerald-300" />
                    Local dining
                  </div>
                  <p className="mt-1 text-sm text-slate-400">Kottu, rice & curry, and modern cafés.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

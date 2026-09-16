import React from "react";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Utensils,
  Hotel,
  Home,
  Bed,
  Compass,
  Sparkles,
} from "lucide-react";
import {
  ESTABLISHMENT_TYPES,
  SRI_LANKAN_DISTRICTS,
  RESTAURANT_CATEGORIES,
} from "../../pages/PartnerWithUs/constants";

export default function HeroDiscovery({
  searchQuery,
  setSearchQuery,
  selectedDistrict,
  setSelectedDistrict,
  selectedCategory,
  setSelectedCategory,
  onSearch,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch();
  };

  const heroCategories = [
    { id: "all", label: "All Categories", icon: Compass },
    ...ESTABLISHMENT_TYPES,
  ];

  return (
    <div className="relative rounded-3xl sm:rounded-[2.5rem] overflow-hidden bg-slate-950 border border-slate-800/60 shadow-2xl text-white">
      {/* Background with Sri Lankan photo overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105 opacity-40 transition-transform duration-1000"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1800&q=85')`,
        }}
      />
      {/* Dynamic gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/40" />
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-10 px-6 py-12 sm:px-12 sm:py-16 lg:py-20 max-w-5xl mx-auto text-center space-y-8">
        {/* Eyebrow Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-emerald-300 text-xs font-bold tracking-wide shadow-sm"
        >
          <Sparkles size={14} className="text-emerald-400" />
          <span>Discover Sri Lanka Like a Local</span>
        </motion.div>

        {/* Title & Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="space-y-4"
        >
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Discover the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Best of Sri Lanka
            </span>
          </h1>
          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Explore authentic restaurants, hotels, resorts, private villas, and local guest houses across the island.
          </p>
        </motion.div>

        {/* Large Responsive Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <form
            onSubmit={handleSubmit}
            className="bg-white/95 backdrop-blur-xl p-2.5 sm:p-3 rounded-2xl sm:rounded-full border border-white/30 shadow-2xl flex flex-col md:flex-row items-stretch md:items-center gap-2 text-slate-800"
          >
            {/* 1. Keyword search */}
            <div className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-full hover:bg-slate-50 transition">
              <Search size={18} className="text-emerald-600 shrink-0" />
              <div className="flex-1 text-left">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  What are you looking for?
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Restaurant, Rice & Curry, Kottu, Villa..."
                  className="w-full bg-transparent text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-8 bg-slate-200" />

            {/* 2. Location picker */}
            <div className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-full hover:bg-slate-50 transition relative">
              <MapPin size={18} className="text-emerald-600 shrink-0" />
              <div className="flex-1 text-left">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Where?
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Sri Lanka</option>
                  {SRI_LANKAN_DISTRICTS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.label} ({d.sinhala})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-8 bg-slate-200" />

            {/* 3. Establishment Type picker */}
            <div className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-full hover:bg-slate-50 transition">
              <Compass size={18} className="text-emerald-600 shrink-0" />
              <div className="flex-1 text-left">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Establishment Type
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer"
                >
                  {heroCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 4. Search submit button */}
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/30 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
            >
              <Search size={16} />
              <span>Search</span>
            </button>
          </form>

          {/* Quick Category Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            <span className="text-xs text-slate-400 font-medium mr-1">Browse:</span>
            {ESTABLISHMENT_TYPES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(isSelected ? "all" : cat.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition backdrop-blur-md ${
                    isSelected
                      ? "bg-emerald-500 text-white border border-emerald-400 shadow-sm"
                      : "bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10"
                  }`}
                >
                  <Icon size={12} className={isSelected ? "text-white" : "text-emerald-400"} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

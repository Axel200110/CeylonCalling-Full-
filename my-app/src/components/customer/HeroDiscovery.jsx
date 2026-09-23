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
  ShieldCheck,
  Star,
  X,
  ChevronDown,
} from "lucide-react";
import HeroImg from "../../assets/Hero.jpg";
import {
  ESTABLISHMENT_TYPES,
  SRI_LANKAN_DISTRICTS,
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
    <div className="relative rounded-3xl sm:rounded-[2.5rem] overflow-hidden bg-slate-950 border border-emerald-500/20 shadow-2xl shadow-emerald-950/40 text-white">
      {/* 1. Background Cinematic Image with Luxury Gradients */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105 opacity-35 transition-transform duration-1000"
        style={{
          backgroundImage: `url(${HeroImg})`,
        }}
      />
      {/* Ambient lighting overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-transparent to-slate-950/90" />
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-teal-500/20 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-64 bg-emerald-600/10 blur-[100px] pointer-events-none" />

      {/* 2. Hero Content */}
      <div className="relative z-10 px-4 py-12 sm:px-8 sm:py-16 lg:py-20 max-w-5xl mx-auto text-center space-y-8">
        {/* Eyebrow Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 backdrop-blur-md text-emerald-300 text-xs sm:text-sm font-semibold tracking-wide shadow-lg shadow-emerald-950/50"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <Sparkles size={14} className="text-emerald-400" />
          <span>North Central Province &bull; Sacred Cities &amp; Heritage Stays</span>
        </motion.div>

        {/* Title & Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="space-y-4 max-w-3xl mx-auto"
        >
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Discover the Heart of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 drop-shadow-sm">
              North Central Sri Lanka
            </span>
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Explore authentic restaurants, heritage hotels, lakeside villas, and pilgrim stays across Anuradhapura &amp; Polonnaruwa.
          </p>
        </motion.div>

        {/* 3. Floating Modern Search Dock */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <form
            onSubmit={handleSubmit}
            className="bg-white/95 backdrop-blur-2xl p-2.5 sm:p-3 rounded-2xl sm:rounded-full border border-white/60 shadow-2xl shadow-slate-950/60 flex flex-col md:flex-row items-stretch md:items-center gap-2 text-slate-800"
          >
            {/* Segment 1: Keyword search */}
            <div className="flex-1 flex items-center gap-3 px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-full hover:bg-slate-100/80 transition group">
              <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition shrink-0">
                <Search size={17} />
              </div>
              <div className="flex-1 text-left min-w-0">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  What are you looking for?
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Restaurant, Rice & Curry, Kottu, Villa..."
                    className="w-full bg-transparent text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="p-1 text-slate-400 hover:text-slate-600 transition"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-10 bg-slate-200 shrink-0" />

            {/* Segment 2: Location picker */}
            <div className="flex-1 flex items-center gap-3 px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-full hover:bg-slate-100/80 transition group relative">
              <div className="w-9 h-9 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition shrink-0">
                <MapPin size={17} />
              </div>
              <div className="flex-1 text-left min-w-0">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Where?
                </label>
                <div className="relative flex items-center">
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer appearance-none pr-5 truncate"
                  >
                    <option value="all">All North Central Province</option>
                    {SRI_LANKAN_DISTRICTS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.label} ({d.sinhala})
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-0 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-10 bg-slate-200 shrink-0" />

            {/* Segment 3: Establishment Type picker */}
            <div className="flex-1 flex items-center gap-3 px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-full hover:bg-slate-100/80 transition group relative">
              <div className="w-9 h-9 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition shrink-0">
                <Compass size={17} />
              </div>
              <div className="flex-1 text-left min-w-0">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Establishment Type
                </label>
                <div className="relative flex items-center">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer appearance-none pr-5 truncate"
                  >
                    {heroCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-0 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Segment 4: Search submit button */}
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl sm:rounded-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 hover:shadow-emerald-500/40 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
            >
              <Search size={16} className="stroke-[2.5]" />
              <span>Search</span>
            </button>
          </form>

          {/* Quick Category Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">
              Browse:
            </span>
            {ESTABLISHMENT_TYPES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(isSelected ? "all" : cat.id)}
                  className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all backdrop-blur-md shadow-sm ${
                    isSelected
                      ? "bg-emerald-500 text-white border border-emerald-400 shadow-md shadow-emerald-500/25 scale-105"
                      : "bg-slate-900/60 hover:bg-slate-800/80 text-slate-200 border border-slate-700/60 hover:border-emerald-500/40"
                  }`}
                >
                  <Icon
                    size={14}
                    className={isSelected ? "text-white" : "text-emerald-400"}
                  />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* 4. Trust & Highlights Ribbon */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="pt-4 border-t border-slate-800/60 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-400 font-medium"
        >
          <div className="flex items-center gap-1.5 text-slate-300">
            <ShieldCheck size={16} className="text-emerald-400" />
            <span>Verified Local Partners</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <MapPin size={16} className="text-teal-400" />
            <span>Anuradhapura &amp; Polonnaruwa</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Star size={16} className="text-amber-400 fill-amber-400" />
            <span>4.9 / 5 Explorer Rating</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

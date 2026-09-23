import { motion } from "framer-motion";
import {
  Compass,
  Heart,
  ShieldCheck,
  UtensilsCrossed
} from "lucide-react";

import RestaurantInterior from "../assets/about_opt.jpg";
import DeliciousFood from "../assets/Mission.jpg";
import DiningExperience from "../assets/vision_opt.jpg";

// --- Framer Motion Animation Variants ---
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.05 }
  }
};

const textReveal = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 70, damping: 16 }
  }
};

const cardFadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 60, damping: 15 }
  }
};

export default function About() {
  const pillars = [
    {
      icon: <UtensilsCrossed className="text-emerald-600" size={22} />,
      title: "Our Mission",
      subtitle: "අපගේ මෙහෙවර",
      desc: "To bridge the gap between discerning travelers and authenticated local food venues, ensuring every meal shares a piece of Rajarata heritage."
    },
    {
      icon: <Compass className="text-purple-600" size={22} />,
      title: "Our Vision",
      subtitle: "අපගේ දැක්ම",
      desc: "To be the definitive premium digital gateway for hospitality in the North Central Province, empowering local culinary entrepreneurs to flourish globally."
    },
    {
      icon: <ShieldCheck className="text-amber-600" size={22} />,
      title: "Our Guarantee",
      subtitle: "අපගේ සහතිකය",
      desc: "Every restaurant, café, and boutique stay listed on Ceylon Calling undergoes independent curation to satisfy strict benchmarks of flavor and hygiene."
    }
  ];

  return (
    <section
      id="about"
      className="relative bg-neutral-50 py-16 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden selection:bg-emerald-500/10 selection:text-emerald-800"
    >
      {/* Structural Ambient Background Elements */}
      <div className="absolute top-0 left-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 sm:space-y-20 md:space-y-28">
        
        {/* ================= 1. PREMIUM HEADER SECTION ================= */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center space-y-4 max-w-3xl mx-auto"
        >
          <motion.div 
            variants={textReveal}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 text-[11px] sm:text-xs font-semibold tracking-wide uppercase"
          >
            <Heart size={12} className="fill-emerald-600 stroke-none animate-pulse shrink-0" />
            The Living Story
          </motion.div>

          <motion.h2 
            variants={textReveal}
            className="text-2xl sm:text-4xl md:text-5xl font-black text-neutral-900 tracking-tight leading-tight px-2 sm:px-0"
          >
            Elevating Culinary Discovery in the <br className="hidden md:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
              North Central Province.
            </span>
          </motion.h2>

          <motion.div variants={textReveal} className="space-y-3 px-1">
            <p className="text-base sm:text-lg text-neutral-600 font-light leading-relaxed max-w-2xl mx-auto">
              Ceylon Calling is a dedicated directory ecosystem engineered to connect global epicureans and local residents with premier restaurants, hidden cafés, and luxury stays.
            </p>
            <p className="text-xs sm:text-sm text-neutral-500 italic font-medium">
              උතුරු මැද පළාතේ විශිෂ්ටතම අවන්හල්, කැෆේ සහ හෝටල් සොයාගැනීමේ නිවැරදිම පියවර.
            </p>
          </motion.div>
        </motion.div>

        {/* ================= 2. MODERN SPLIT STORY TEXT + IMAGE BUNDLE ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 items-center">
          
          {/* Left Text Block */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, type: "spring" }}
            className="lg:col-span-6 space-y-5 sm:space-y-6 text-left order-2 lg:order-1"
          >
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 block">How We Began</span>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight leading-tight">
                Born From a Passion for Authentic Rajarata Hospitality
              </h3>
            </div>
            
            <p className="text-sm sm:text-base text-neutral-600 font-light leading-relaxed">
              The ancient plains of Anuradhapura and Polonnaruwa have hosted travelers for millennia. Yet, modern discovery mechanisms often overlook the authentic street-side vendors, artisan coffee brewers, and family-run boutique properties that define our contemporary food landscape.
            </p>

            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-100 shadow-sm space-y-2">
              <p className="text-xs sm:text-sm text-neutral-700 font-medium leading-relaxed">
                "Our objective was simple: build a premium, highly trustworthy platform that allows a tourist or resident to locate a pristine local dining experience within seconds without scrolling through irrelevant global map data."
              </p>
              <span className="text-xs font-bold text-emerald-600 block">— The Ceylon Calling Editorial Board</span>
            </div>

            <p className="text-[11px] sm:text-xs text-neutral-500 font-sans italic leading-normal">
              ආහාර සහ සංස්කෘතියට ඇති අසීමිත ආදරය නිසා ආරම්භ වූ Ceylon Calling, සාම්ප්‍රදායික වට්ටෝරු සහ නවීන සේවාවන් සපයන දේශීය ව්‍යාපාර ලෝකයටම දායාද කරයි.
            </p>
          </motion.div>

          {/* Right Image Graphic Mosaic Layout */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 grid grid-cols-12 gap-3 sm:gap-4 h-[280px] sm:h-[380px] md:h-[440px] lg:h-[420px] xl:h-[460px] relative pointer-events-none order-1 lg:order-2"
          >
            <div className="col-span-7 h-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-md sm:shadow-lg border border-white">
              <img 
                src={RestaurantInterior} 
                alt="Premium boutique restaurant setting" 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="col-span-5 grid grid-rows-2 gap-3 sm:gap-4 h-full">
              <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm sm:shadow-md border border-white">
                <img 
                  src={DeliciousFood} 
                  alt="Curated local specialty dish presentation" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm sm:shadow-md border border-white">
                <img 
                  src={DiningExperience} 
                  alt="Scenic outdoor terrace location" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </motion.div>

        </div>

        {/* ================= 3. STRATEGIC VALUES TRANSFORMATION CARDS ================= */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6"
        >
          {pillars.map((pillar, index) => (
            <motion.div
              key={index}
              variants={cardFadeUp}
              whileHover={{ y: -5, boxShadow: "0 12px 30px rgba(0,0,0,0.03)" }}
              className="bg-white/75 backdrop-blur-md border border-neutral-200/60 shadow-sm p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl text-left flex flex-col justify-between gap-4 transition-all duration-300 group"
            >
              <div className="space-y-3">
                <div className="p-2.5 w-fit rounded-xl sm:rounded-2xl bg-neutral-50 border border-neutral-100 group-hover:bg-white group-hover:scale-105 transition-all duration-300 shadow-inner">
                  {pillar.icon}
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-base sm:text-lg font-bold text-neutral-900 tracking-tight">
                    {pillar.title}
                  </h4>
                  <span className="text-[10px] sm:text-[11px] font-semibold text-neutral-400 uppercase tracking-wide block">
                    {pillar.subtitle}
                  </span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
                {pillar.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "./Navigation";

// --- Carousel Images ---
import heroImg1 from "../assets/hero_opt.jpg";

// Icons
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  Coffee,
  Compass,
  FileText,
  Hotel,
  ShieldCheck,
  Sparkles,
  Store,
  UserPlus,
  UtensilsCrossed,
  X
} from "lucide-react";

// --- Framer Motion Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 80, damping: 15 } 
  }
};

const floatAnimation = (delay = 0) => ({
  animate: {
    y: [0, -6, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
      delay
    }
  }
});

const carouselVariants = {
  initial: { opacity: 0, scale: 1.03 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 1.2, ease: "easeInOut" }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 1.2, ease: "easeInOut" }
  }
};

export default function Header() {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselImages = [
    heroImg1,
    "https://images.unsplash.com/photo-1546768292-fb12f6c9256b?auto=format&fit=crop&w=1280&q=75",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1280&q=75"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [carouselImages.length]);

  // Mouse Parallax (Safeguarded for non-touch devices)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cardX = useTransform(mouseX, [-500, 500], [-8, 8]);
  const cardY = useTransform(mouseY, [-500, 500], [-8, 8]);

  function handleMouseMove(event) {
    if (window.matchMedia("(pointer: coarse)").matches) return; // Skip on mobile touch
    const { clientX, clientY } = event;
    const width = window.innerWidth;
    const height = window.innerHeight;
    mouseX.set(clientX - width / 2);
    mouseY.set(clientY - height / 2);
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setOpenModal(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const stats = [
    { value: "300+", label: "Restaurants", icon: <UtensilsCrossed size={13} className="text-emerald-400" /> },
    { value: "120+", label: "Hotels", icon: <Hotel size={13} className="text-purple-400" /> },
    { value: "80+", label: "Cafés", icon: <Coffee size={13} className="text-amber-400" /> }
  ];

  const features = [
    {
      icon: <UtensilsCrossed className="text-emerald-400" size={18} />,
      title: "Verified Dining",
      desc: "Handpicked premium restaurants and venues audited for luxury quality benchmarks."
    },
    {
      icon: <Coffee className="text-amber-400" size={18} />,
      title: "Café Culture",
      desc: "Locate artisan coffee, local tea spots, and modern urban hangouts."
    },
    {
      icon: <Hotel className="text-purple-400" size={18} />,
      title: "Premium Stays",
      desc: "From boutique resort hideaways to historic luxury stays across Rajarata."
    },
    {
      icon: <Sparkles className="text-emerald-400" size={18} />,
      title: "Local Heritage",
      desc: "Support local culinary artists serving native authentic Sri Lankan recipes."
    }
  ];

  const modalSteps = [
    { title: "Create Account", desc: "Set up your secure business partner profile.", icon: <UserPlus size={16} /> },
    { title: "Business Details", desc: "Specify location, operating hours & amenities.", icon: <FileText size={16} /> },
    { title: "Upload Photos", desc: "Showcase your beautiful interior and menu options.", icon: <Camera size={16} /> },
    { title: "Verification", desc: "Our team audits for high hospitality benchmarks.", icon: <ShieldCheck size={16} /> },
    { title: "Published Live", desc: "Instantly display to active regional tourists.", icon: <CheckCircle2 size={16} /> }
  ];

  return (
    <div
      id="header"
      className="relative w-full min-h-screen bg-neutral-950 overflow-hidden border-b border-neutral-900 selection:bg-emerald-500/30 selection:text-emerald-200 flex flex-col justify-between"
      onMouseMove={handleMouseMove}
    >
      {/* Immersive Background Canvas */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentSlide}
            variants={carouselVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${carouselImages[currentSlide]})` }}
          />
        </AnimatePresence>
      </div>

      {/* Atmospheric Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/60 via-neutral-950/85 to-neutral-950 z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.04)_0%,transparent_70%)] z-10 pointer-events-none" />

      {/* Navigation Layer */}
      <div className="relative z-50 w-full">
        <Navigation />
      </div>

      {/* Main Container */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 lg:pt-40 pb-24 flex-grow flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
          
          {/* Left Block: Text, CTA & Stats */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start"
          >
            {/* Context Badge */}
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md max-w-max mx-auto lg:mx-0"
            >
              <Compass className="text-emerald-400 animate-spin-slow shrink-0" size={12} />
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-neutral-300 whitespace-nowrap">
                North Central Province Curated Discovery
              </span>
            </motion.div>

            {/* Dynamic Sized Headline */}
            <motion.h1 
              variants={itemVariants}
              className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.15] sm:leading-[1.12] max-w-xl lg:max-w-none"
            >
              Find Amazing Places to <br className="hidden sm:inline" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
                Eat, Relax & Stay.
              </span>
            </motion.h1>

            {/* Subtitles */}
            <motion.div variants={itemVariants} className="space-y-3 max-w-lg lg:max-w-xl">
              <p className="text-sm sm:text-base md:text-lg text-neutral-300 font-light leading-relaxed">
                Discover verified restaurants, luxury boutique stays, and cozy artisan cafés across the historic capital territories of Sri Lanka. 
              </p>
              <p className="text-xs sm:text-sm text-emerald-400/90 font-medium tracking-wide italic leading-normal">
                පහසුවෙන් සොයා ගන්න — උතුරු මැද පළාතේ හොඳම අවන්හල්, කැෆේ සහ හෝටල්.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 w-full sm:w-auto pt-2"
            >
              <button
                onClick={() => navigate("/discover")}
                className="group relative flex items-center justify-center gap-2 w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-sm sm:text-base font-semibold shadow-lg shadow-emerald-500/10 transition-all duration-300 hover:brightness-110 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                Explore Places
                <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => { setActiveStep(0); setOpenModal(true); }}
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm sm:text-base font-semibold backdrop-blur-md border border-white/10 transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                <Store size={15} className="text-purple-400" />
                Partner With Us
              </button>
            </motion.div>

            {/* Trust Matrix */}
            <motion.div 
              variants={itemVariants}
              className="pt-6 grid grid-cols-3 gap-2 sm:gap-3 border-t border-white/5 w-full max-w-md lg:max-w-lg mt-2"
            >
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-white/[0.01] border border-white/[0.05] p-2.5 sm:p-3.5 rounded-xl backdrop-blur-sm space-y-0.5 sm:space-y-1 text-center lg:text-left">
                  <div className="flex flex-col lg:flex-row items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-neutral-400 tracking-wide font-medium">
                    {stat.icon}
                    <span className="text-center lg:text-left">{stat.label}</span>
                  </div>
                  <div className="text-lg sm:text-2xl font-bold text-white tracking-tight">{stat.value}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Block: Laptop/Desktop Grid View */}
          <motion.div 
            style={{ x: cardX, y: cardY }}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 relative hidden lg:grid grid-cols-1 gap-4 pl-4 xl:pl-8 pointer-events-auto"
          >
            {features.map((feat, i) => (
              <motion.div
                key={i}
                {...floatAnimation(i * 0.4)}
                whileHover={{ scale: 1.01, x: 4, backgroundColor: "rgba(255,255,255,0.04)" }}
                className="p-4 rounded-2xl bg-white/[0.01] border border-white/[0.06] backdrop-blur-xl flex gap-4 items-start group cursor-default transition-all duration-300"
              >
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-300">
                  {feat.icon}
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-sm font-semibold text-white tracking-wide group-hover:text-emerald-300 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-neutral-400 font-light leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Mobile/Tablet Adaptive Grid View */}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3 mt-10 w-full">
          {features.map((feat, index) => (
            <div key={index} className="p-3.5 rounded-xl bg-white/[0.01] border border-white/[0.05] backdrop-blur-md flex gap-3.5 items-start text-left">
              <div className="p-2 rounded-lg bg-white/5 border border-white/10 shrink-0">{feat.icon}</div>
              <div className="space-y-0.5">
                <h4 className="text-xs sm:text-sm font-semibold text-white">{feat.title}</h4>
                <p className="text-[11px] sm:text-xs text-neutral-400 leading-normal font-light">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Slide Carousel Dots Layout */}
      <div className="relative z-30 w-full pb-6 flex justify-center items-center gap-2">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1 rounded-full transition-all duration-300 focus:outline-none ${
              index === currentSlide ? "w-6 bg-emerald-400" : "w-1 bg-white/20 hover:bg-white/40"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* ADAPTIVE RESPONSIBLE MODAL LAYOUT */}
      <AnimatePresence>
        {openModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-neutral-950/80 backdrop-blur-md px-0 sm:px-4"
            onClick={() => setOpenModal(false)}
          >
            <motion.div
              initial={window.innerWidth < 640 ? { y: "100%" } : { scale: 0.96, y: 8, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={window.innerWidth < 640 ? { y: "100%" } : { scale: 0.96, y: 8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="bg-neutral-900 border-t sm:border border-neutral-800 text-white rounded-t-2xl sm:rounded-3xl w-full max-w-2xl p-5 sm:p-7 md:p-8 shadow-2xl relative overflow-hidden max-h-[90vh] sm:max-h-[95vh] flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Radial Blur Layer */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

              {/* Header section */}
              <div className="relative flex justify-between items-start mb-4 pr-8">
                <div className="space-y-1 text-left">
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-purple-400 tracking-wider uppercase">
                    <Store size={11} /> Merchant Verification
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Join Ceylon Calling / අප සමඟ එක්වන්න
                  </h2>
                  <p className="text-xs text-neutral-400">
                    List your enterprise on the region's premier business dashboard.
                  </p>
                </div>
                <button
                  onClick={() => setOpenModal(false)}
                  className="absolute top-0 right-0 p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-400 hover:text-white transition"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Scrollable Flow List for Mobile Screens */}
              <div className="space-y-2 overflow-y-auto pr-1 flex-grow py-2 custom-scrollbar">
                {modalSteps.map((step, index) => (
                  <div
                    key={index}
                    onClick={() => setActiveStep(index)}
                    className={`p-3 rounded-xl border flex items-start sm:items-center gap-3.5 transition-all duration-200 cursor-pointer ${
                      index === activeStep
                        ? "bg-emerald-950/20 border-emerald-500/30 shadow-inner"
                        : "bg-neutral-800/20 border-neutral-800/60 hover:border-neutral-700"
                    }`}
                  >
                    <div className={`p-2 rounded-lg border transition-colors shrink-0 ${
                      index === activeStep
                        ? "bg-emerald-500/10 border-emerald-400/20 text-emerald-400"
                        : "bg-neutral-900 border-neutral-800 text-neutral-500"
                    }`}>
                      {step.icon}
                    </div>
                    <div className="space-y-0.5 text-left">
                      <span className="text-[9px] block uppercase font-bold tracking-wider text-neutral-500">
                        Step 0{index + 1}
                      </span>
                      <h4 className={`text-xs sm:text-sm font-semibold transition-colors ${index === activeStep ? "text-emerald-300" : "text-white"}`}>
                        {step.title}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-neutral-400 font-light max-w-md leading-normal">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Section Layout */}
              <div className="mt-5 pt-4 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center gap-4 sm:justify-between shrink-0">
                <p className="text-[10px] sm:text-[11px] text-neutral-500 text-center sm:text-left max-w-xs leading-tight">
                  All listings are scrutinized by our verification team before publication.
                </p>
                <div className="flex gap-2.5 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => setOpenModal(false)}
                    className="flex-1 sm:flex-initial px-4 py-2 text-xs rounded-lg font-medium bg-neutral-800 hover:bg-neutral-700 transition border border-neutral-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setOpenModal(false);
                      navigate("/partner-with-us");
                    }}
                    className="flex-1 sm:flex-initial px-4 py-2.5 text-xs rounded-lg font-semibold bg-emerald-600 hover:bg-emerald-500 transition shadow-lg shadow-emerald-600/15 whitespace-nowrap"
                  >
                    Start Registration
                  </button>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
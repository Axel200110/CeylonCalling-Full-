import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowRight, Compass, Home, LogIn, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/Lion.jpg";

function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const lastScrollY = useRef(0);
  const { scrollY } = useScroll();
  const navRef = useRef(null);

  // Smooth hide on scroll down, show on scroll up
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
    
    // Prevent hiding if the mobile menu is currently expanded
    if (isMenuOpen) {
      setIsHidden(false);
      return;
    }

    if (latest > 120 && latest > lastScrollY.current) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }
    lastScrollY.current = latest;
  });

  // Handle outside clicks safely using ref constraints
  useEffect(() => {
    if (!isMenuOpen) return;
    
    const handleOutsideClick = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isMenuOpen]);

  // Close menu on navigation routing updates
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const menuVariants = {
    hidden: { opacity: 0, height: 0, y: -8 },
    visible: {
      opacity: 1,
      height: "auto",
      y: 0,
      transition: {
        height: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
        opacity: { duration: 0.2 },
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      y: -8,
      transition: {
        height: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
        opacity: { duration: 0.15 },
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.04, duration: 0.25, ease: "easeOut" },
    }),
  };

  const isActivePath = (path) => location.pathname === path;

  return (
    <motion.nav
      ref={navRef}
      initial={{ y: 0, opacity: 0 }}
      animate={{ y: isHidden ? "-100%" : "0%", opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${
        isScrolled || isMenuOpen
          ? "border-b border-slate-200/80 bg-white/85 text-slate-900 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.07)] backdrop-blur-xl"
          : "border-b border-white/10 bg-gradient-to-b from-black/20 to-transparent text-white backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        
        {/* LOGO BRAND */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="group flex items-center gap-3 rounded-xl p-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
        >
          <div className="relative flex h-10 w-10 items-center justify-center">
            <img
              src={Logo}
              alt="Ceylon Calling logo"
              className="h-10 w-10 rounded-full object-cover ring-2 ring-emerald-500/20 shadow-md transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 scale-75 rounded-xl bg-emerald-400/20 blur-md transition-transform duration-300 group-hover:scale-110" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-sm font-bold tracking-tight">
              Ceylon <span className="text-emerald-500">Calling</span>
            </span>
            <span className={`text-[9px] font-semibold uppercase tracking-[0.2em] transition-colors duration-300 ${
              isScrolled || isMenuOpen ? "text-slate-500" : "text-white/70"
            }`}>
              Sri Lanka stays & dining
            </span>
          </div>
        </button>

        {/* MID-SECTION SEARCH BAR */}
       

        {/* RIGHT ACTION CONTROLS */}
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1.5 md:flex">
           
           
          </div>

          {/* DYNAMIC SIGN-IN TRIGGER */}
          <div
            className="relative"
            onMouseEnter={() => setIsTooltipOpen(true)}
            onMouseLeave={() => setIsTooltipOpen(false)}
          >
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/user/login")}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                isScrolled || isMenuOpen
                  ? "bg-slate-900 text-white hover:bg-slate-800"
                  : "bg-white text-slate-900 shadow-md hover:bg-slate-50"
              }`}
            >
              <LogIn size={14} />
              <span>Login</span>
            </motion.button>

            {/* BENEFITS TOOLTIP */}
            <AnimatePresence>
              {isTooltipOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="pointer-events-none absolute right-0 top-full mt-3 w-64 rounded-xl border border-slate-100 bg-white p-3.5 shadow-xl"
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Member benefits</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    Save itineraries, sync favorites, and receive personalized dynamic stay offers.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* MOBILE BURGER TRIGGER */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200 lg:hidden focus:outline-none ${
              isScrolled || isMenuOpen
                ? "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                : "border-white/10 bg-white/10 text-white hover:bg-white/20"
            }`}
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* MOBILE CONTAINER DROPDOWN */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full overflow-hidden border-t border-slate-100 bg-white text-slate-900 shadow-inner lg:hidden"
          >
            <div className="flex flex-col gap-2 px-4 py-4 sm:px-6">
              <motion.button
                custom={0}
                variants={itemVariants}
                onClick={() => navigate("/")}
                className={`flex items-center justify-between rounded-xl p-3.5 text-left transition-all ${
                  isActivePath("/") 
                    ? "bg-emerald-50 text-emerald-700" 
                    : "bg-slate-50 hover:bg-slate-100 text-slate-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Home size={16} className={isActivePath("/") ? "text-emerald-600" : "text-slate-500"} />
                  <span className="text-xs font-semibold">Home Platform</span>
                </div>
                <ArrowRight size={14} className="opacity-60" />
              </motion.button>

              <motion.button
                custom={1}
                variants={itemVariants}
                onClick={() => navigate("/user/login")}
                className="flex items-center justify-between rounded-xl bg-slate-50 p-3.5 text-left text-slate-800 transition-all hover:bg-slate-100"
              >
                <div className="flex items-center gap-3">
                  <LogIn size={16} className="text-slate-500" />
                  <span className="text-xs font-semibold">Access Account</span>
                </div>
                <ArrowRight size={14} className="opacity-60" />
              </motion.button>

              <motion.div 
                custom={2} 
                variants={itemVariants} 
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-3 py-2.5 text-white"
              >
                <Compass size={14} className="animate-spin-slow" />
                <span className="text-[11px] font-medium tracking-wide">
                  Premium Sri Lanka Travel Desk Active
                </span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default Navigation;
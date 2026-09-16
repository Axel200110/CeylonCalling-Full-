import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import Logo from "../assets/Lion.jpg";
import { useSiteUserAuthStore } from "../store/siteUserAuthStore";

// Icons
import {
  ArrowUpRight,
  Compass,
  Facebook,
  Globe,
  Instagram,
  LogIn,
  LogOut,
  Mail,
  Menu,
  Moon,
  Store,
  Sun,
  X
} from "lucide-react";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Navigation Local Language Core State: 'en' | 'si'
  const [lang, setLang] = useState("en");
  
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();

  // Connect Zustand Global Auth Store State & Actions
  const { isAuthenticated, logout } = useSiteUserAuthStore();

  // Multi-Language Structural Matrix (Localized Dictionary strings)
  const translations = useMemo(() => ({
    en: {
      home: "Home",
      about: "About",
      join: "Join Us",
      contact: "Contact",
      vendor: "Shop Login",
      explore: "Explore Places",
      login: "User Login",
      logout: "Log Out",
      languageName: "English",
      switchLang: "සිංහල"
    },
    si: {
      home: "මුල් පිටුව",
      about: "අප ගැන",
      join: "එක්වන්න",
      contact: "සම්බන්ධ වන්න",
      vendor: "විකුණුම්කරු පිවිසුම",
      explore: "ගවේෂණය කරන්න",
      login: "පරිශීලක පිවිසුම",
      logout: "නික්ම වන්න",
      languageName: "සිංහල",
      switchLang: "English"
    }
  }), []);

  // Navigation Links Memo Grid mapping exact component IDs
  const navLinks = useMemo(() => [
    { id: "header", label: translations[lang].home },
    { label: "Places", path: "/shops" },
    { label: "Foods", path: "/foods" },
    { id: "about", label: translations[lang].about },
    { id: "join", label: translations[lang].join }, 
    { id: "contact", label: translations[lang].contact },
  ], [lang, translations]);


  const socialLinks = useMemo(() => [
    { href: "https://facebook.com/ceyloncalling", icon: <Facebook className="w-3.5 h-3.5" />, aria: "Go to Ceylon Calling Facebook Page" },
    { href: "https://instagram.com/ceyloncalling", icon: <Instagram className="w-3.5 h-3.5" />, aria: "Go to Ceylon Calling Instagram Page" },
    { href: "mailto:reservations@ceyloncalling.lk", icon: <Mail className="w-3.5 h-3.5" />, aria: "Send email directly to Ceylon Calling Desk" }
  ], []);

  // Monitor Global Scroll States
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard Event Listener (Escape Key to safely exit layouts)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Structural Scrolling Lock for active modals
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isMenuOpen]);

  // Handle click vectors pointing away from mobile sheet layout context
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === "en" ? "si" : "en"));
  };

  // Centralized Dynamic Auth Routing and Action Trigger Handler with Advanced Toast
  const handleAuthAction = async () => {
    if (isAuthenticated) {
      await toast.promise(
        (async () => {
          await logout();
          navigate("/");
        })(),
        {
          loading: 'Terminating session securely...',
          success: (
            <div className="flex flex-col text-left">
              <span className="font-bold text-slate-900 text-sm">Logged Out Safely</span>
              <span className="text-xs text-slate-400 font-medium">Your active session cache has been cleared.</span>
            </div>
          ),
          error: 'Failed to terminate session safely.',
        },
        {
          success: {
            duration: 4000,
            icon: '🔒',
          }
        }
      );
    } else {
      navigate("/user/login");
    }
  };

  return (
    <>
      {/* High-Fidelity Progress Indicator Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 z-[70] origin-[0%]"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Main Bar Navigation Layer Container */}
      <motion.nav
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled 
            ? "py-2.5 bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/40 dark:border-slate-800/40 shadow-[0_4px_30_rgba(0,0,0,0.02)] backdrop-blur-xl" 
            : "py-4 bg-transparent border-b border-transparent backdrop-blur-none"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* LEFT: Logo Identity Frame Cluster */}
          <div 
            onClick={() => navigate("/")} 
            className="flex items-center gap-2.5 cursor-pointer group select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl p-1"
            role="button"
            tabIndex={0}
            aria-label="Ceylon Calling Navigation Home"
            onKeyDown={(e) => { if (e.key === 'Enter') navigate("/"); }}
          >
            <div className="relative">
              <img
                src={Logo}
                alt="Ceylon Calling"
                className={`rounded-full object-cover ring-2 ring-neutral-200/40 dark:ring-slate-800/80 transition-all duration-300 ${
                  scrolled ? "h-8 w-8" : "h-9 w-9 md:h-10 md:w-10"
                }`}
              />
            </div>
            <div className="flex flex-col">
              <span className={`font-semibold tracking-tight text-neutral-900 dark:text-white transition-all duration-300 ${
                scrolled ? "text-base" : "text-lg md:text-xl"
              }`}>
                Ceylon <span className="text-emerald-600 dark:text-emerald-400 font-medium">Calling</span>
              </span>
              <p className="text-[9px] text-neutral-400 dark:text-neutral-500 font-bold tracking-widest uppercase -mt-0.5">
                North Central Index
              </p>
            </div>
          </div>

          {/* CENTER: Minimalist Desktop Navigation Rail Tracks */}
          <div className="hidden lg:flex items-center gap-1 bg-neutral-100/60 dark:bg-slate-800/40 p-1 rounded-full border border-neutral-200/20 dark:border-slate-700/20">
            {navLinks.map((item) => (
              item.path ? (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className="relative px-4 py-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-full cursor-pointer transition-all duration-200 flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 border-none bg-transparent font-medium"
                >
                  <span className="relative z-10">{item.label}</span>
                </button>
              ) : (
                <ScrollLink
                  key={item.id}
                  to={item.id}
                  smooth={true}
                  duration={500}
                  spy={true}
                  offset={-80}
                  activeClass="!text-emerald-700 dark:!text-emerald-400 bg-white dark:bg-slate-900 shadow-[0_2px_6px_rgba(0,0,0,0.03)] font-medium"
                  className="relative px-4 py-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-full cursor-pointer transition-all duration-200 flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  <span className="relative z-10">{item.label}</span>
                </ScrollLink>
              )
            ))}
          </div>


          {/* RIGHT: High-Fidelity Utility & CTA Matrix Grid */}
          <div className="hidden lg:flex items-center gap-3">
            
            {/* Social Track Matrix */}
            <div className="flex items-center gap-1.5 border-r border-neutral-200/60 dark:border-slate-800 pr-3">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  aria-label={social.aria}
                  className="w-7 h-7 rounded-full bg-neutral-100/50 dark:bg-slate-800/40 border border-neutral-200/20 text-neutral-500 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-white dark:hover:bg-slate-900 flex items-center justify-center transition-all duration-200 shadow-sm"
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Language Selection Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-slate-800/60 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white text-xs font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              aria-label={`Switch language to ${translations[lang].switchLang}`}
            >
              <Globe className="w-3.5 h-3.5 text-neutral-400" />
              <span className="font-sans text-[11px] tracking-wide">{translations[lang].switchLang}</span>
            </button>

            {/* Micro Layout Color Switcher */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-full hover:bg-neutral-100 dark:hover:bg-slate-800/60 transition-all duration-200 focus:outline-none"
              aria-label="Toggle layout color environment"
            >
              {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            {/* Secondary CTA Outlined Button Link */}
            <button
              onClick={() => navigate("/login")}
              className="group flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] bg-white font-medium text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-slate-800 hover:border-neutral-900 dark:hover:border-slate-400 rounded-full transition-all duration-200 focus:outline-none"
            >
              <Store size={12} className="text-neutral-400" />
              <span>{translations[lang].vendor}</span>
              <ArrowUpRight size={11} className="text-neutral-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-150" />
            </button>

            {/* INTEGRATED DYNAMIC DESKTOP AUTH BUTTON */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleAuthAction}
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-bold transition-all duration-200 focus:outline-none focus:ring-2 ${
                isAuthenticated 
                  ? "bg-red-500/10 border border-red-500/20 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 shadow-sm"
                  : scrolled
                    ? "bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700"
                    : "bg-white text-slate-900 shadow-sm hover:bg-slate-50 border border-neutral-200 dark:border-slate-800"
              }`}
            >
              {isAuthenticated ? <LogOut size={12} /> : <LogIn size={12} />}
              <span>{isAuthenticated ? translations[lang].logout : translations[lang].login}</span>
            </motion.button>

            {/* Primary Modern Gradient CTA Action Button */}
            <button
              onClick={() => navigate("/discover")}
              className="relative group overflow-hidden px-4 py-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[11px] font-medium shadow-md hover:shadow-emerald-600/10 transition-all duration-200 hover:-translate-y-0.5 focus:outline-none"
            >
              <div className="relative z-10 flex items-center gap-1.5">
                <Compass size={12} className="animate-spin-slow" />
                <span>{translations[lang].explore}</span>
              </div>
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/10 via-transparent to-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
            </button>
          </div>

          {/* RIGHT MOBILE CONTAINER: Structural Responsive Control Layouts */}
          <div className="flex lg:hidden items-center gap-2">
            <button 
              onClick={toggleLanguage}
              className="px-2.5 py-1 text-[11px] font-medium text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-slate-800 rounded-full flex items-center gap-1"
              aria-label="Change language track mobile"
            >
              <Globe className="w-3 h-3" />
              <span>{translations[lang].switchLang}</span>
            </button>
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-xl bg-neutral-100 dark:bg-slate-800 text-neutral-900 dark:text-white transition-all active:scale-95 focus:outline-none"
              aria-label="Open mobile navigation overlay sheet"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={16} strokeWidth={2.5} /> : <Menu size={16} strokeWidth={2.5} />}
            </button>
          </div>
        </div>

        {/* CASCADING MOBILE PANEL SHEET */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-[57px] left-0 w-full bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl border-b border-neutral-200/60 dark:border-slate-800/60 shadow-2xl z-40 rounded-b-3xl overflow-hidden lg:hidden"
            >
              <div className="px-6 py-8 flex flex-col space-y-6 max-h-[calc(100vh-80px)] overflow-y-auto">
                
                {/* Mobile Navigation List Links */}
                <motion.ul 
                  className="space-y-1"
                  initial="closed"
                  animate="open"
                  variants={{
                    open: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } }
                  }}
                >
                  {navLinks.map((item) => (
                    <motion.li 
                      key={item.id || item.label}
                      variants={{
                        open: { y: 0, opacity: 1 },
                        closed: { y: 8, opacity: 0 }
                      }}
                    >
                      {item.path ? (
                        <button
                          onClick={() => {
                            navigate(item.path);
                            setIsMenuOpen(false);
                          }}
                          className="w-full text-left block text-sm font-medium text-neutral-800 dark:text-neutral-200 hover:text-emerald-600 py-2.5 px-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-slate-900/60 transition-colors border-none bg-transparent"
                        >
                          {item.label}
                        </button>
                      ) : (
                        <ScrollLink
                          to={item.id}
                          smooth={true}
                          duration={500}
                          offset={-70}
                          onClick={() => setIsMenuOpen(false)}
                          className="block text-sm font-medium text-neutral-800 dark:text-neutral-200 hover:text-emerald-600 py-2.5 px-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-slate-900/60 transition-colors"
                        >
                          {item.label}
                        </ScrollLink>
                      )}
                    </motion.li>
                  ))}

                </motion.ul>

                <div className="h-px bg-neutral-100 dark:bg-slate-800/80" />

                {/* Mobile Direct Action System Hub */}
                <div className="flex flex-col space-y-2.5">
                  <button
                    onClick={() => {
                      navigate("/discover");
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium text-xs shadow-sm"
                  >
                    <Compass size={14} />
                    <span>{translations[lang].explore}</span>
                  </button>

                  <button
                    onClick={() => {
                      navigate("/login");
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border border-neutral-200 dark:border-slate-800 text-neutral-800 dark:text-neutral-200 font-medium text-xs hover:bg-neutral-50 dark:hover:bg-slate-900 transition-colors"
                  >
                    <Store size={14} />
                    <span>{translations[lang].vendor}</span>
                  </button>

                  {/* DYNAMIC MOBILE AUTH ACTION BUTTON */}
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      handleAuthAction();
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center justify-center gap-2 rounded-xl py-3.5 text-xs font-bold transition-all duration-200 focus:outline-none focus:ring-2 ${
                      isAuthenticated
                        ? "bg-red-50 text-red-600 hover:bg-red-100/70 dark:bg-red-950/20 dark:text-red-400"
                        : scrolled || isMenuOpen
                          ? "bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700"
                          : "bg-white text-slate-900 shadow-md hover:bg-slate-50"
                    }`}
                  >
                    {isAuthenticated ? <LogOut size={14} /> : <LogIn size={14} />}
                    <span>{isAuthenticated ? translations[lang].logout : translations[lang].login}</span>
                  </motion.button>
                </div>

                <div className="h-px bg-neutral-100 dark:bg-slate-800/80" />

                {/* Mobile Social Action Footer Cluster row */}
                <div className="flex items-center justify-center gap-4 pt-2">
                  {socialLinks.map((social, idx) => (
                    <a
                      key={idx}
                      href={social.href}
                      aria-label={social.aria}
                      className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-slate-800 text-neutral-500 dark:text-neutral-400 flex items-center justify-center text-sm"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
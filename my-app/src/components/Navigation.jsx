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
  User,
  X
} from "lucide-react";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Navigation Language State: 'en' | 'si'
  const [lang, setLang] = useState("en");
  
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();

  // Zustand Site User Auth Store
  const { isAuthenticated, logout } = useSiteUserAuthStore();

  // Multi-Language Matrix
  const translations = useMemo(() => ({
    en: {
      home: "Home",
      places: "Places",
      foods: "Foods",
      about: "About",
      join: "Join Us",
      contact: "Contact",
      vendor: "Shop Login",
      explore: "Explore Places",
      login: "User Login",
      logout: "Log Out",
      switchLang: "සිංහල"
    },
    si: {
      home: "මුල් පිටුව",
      places: "ස්ථාන",
      foods: "ආහාර",
      about: "අප ගැන",
      join: "එක්වන්න",
      contact: "සම්බන්ධ වන්න",
      vendor: "විකුණුම්කරු පිවිසුම",
      explore: "ගවේෂණය කරන්න",
      login: "පරිශීලක පිවිසුම",
      logout: "නික්ම වන්න",
      switchLang: "English"
    }
  }), []);

  // Main navigation items
  const navLinks = useMemo(() => [
    { id: "header", label: translations[lang].home },
    { label: translations[lang].places, path: "/shops" },
    { label: translations[lang].foods, path: "/foods" },
    { id: "about", label: translations[lang].about },
    { id: "join", label: translations[lang].join }, 
    { id: "contact", label: translations[lang].contact },
  ], [lang, translations]);

  // Social Channels
  const socialLinks = useMemo(() => [
    {
      href: "https://facebook.com/ceyloncalling",
      icon: <Facebook className="w-4 h-4 shrink-0" />,
      aria: "Visit Ceylon Calling on Facebook",
      title: "Facebook"
    },
    {
      href: "https://instagram.com/ceyloncalling",
      icon: <Instagram className="w-4 h-4 shrink-0" />,
      aria: "Visit Ceylon Calling on Instagram",
      title: "Instagram"
    },
    {
      href: "mailto:info@ceyloncalling.lk",
      icon: <Mail className="w-4 h-4 shrink-0" />,
      aria: "Email Ceylon Calling Support",
      title: "Email"
    }
  ], []);

  // Monitor Global Scroll State
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Escape Key Listener for Mobile Drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Lock Body Scroll when Mobile Menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isMenuOpen]);

  // Handle outside clicks on mobile drawer
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

  const handleAuthAction = async () => {
    if (isAuthenticated) {
      await toast.promise(
        (async () => {
          await logout();
          navigate("/");
        })(),
        {
          loading: "Logging out safely...",
          success: (
            <div className="flex flex-col text-left">
              <span className="font-bold text-slate-900 text-sm">Logged Out</span>
              <span className="text-xs text-slate-500 font-medium">Your session was closed safely.</span>
            </div>
          ),
          error: "Failed to log out safely.",
        },
        {
          success: { duration: 3000, icon: "🔒" },
        }
      );
    } else {
      navigate("/user/login");
    }
  };

  return (
    <>
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 z-[70] origin-[0%]"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Main Navbar */}
      <motion.nav
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled 
            ? "bg-slate-950/90 dark:bg-slate-950/95 border-b border-white/10 shadow-xl backdrop-blur-xl py-2.5" 
            : "bg-slate-950/60 border-b border-white/5 backdrop-blur-md py-3.5"
        }`}
      >
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* ================================================================= */}
          {/* 1. BRAND / LOGO AREA                                              */}
          {/* ================================================================= */}
          <div 
            onClick={() => navigate("/")} 
            className="flex items-center gap-3 cursor-pointer select-none shrink-0 group focus:outline-none"
            role="button"
            tabIndex={0}
            aria-label="Ceylon Calling Home"
            onKeyDown={(e) => { if (e.key === 'Enter') navigate("/"); }}
          >
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden ring-2 ring-emerald-500/30 group-hover:ring-emerald-400 transition-all shadow-md">
              <img
                src={Logo}
                alt="Ceylon Calling Emblem"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                  Ceylon <span className="text-emerald-400 font-semibold">Calling</span>
                </span>
              </div>
              <span className="text-[9px] text-emerald-400/80 font-bold uppercase tracking-widest -mt-0.5">
                North Central
              </span>
            </div>
          </div>

          {/* ================================================================= */}
          {/* 2. MAIN HORIZONTAL NAVIGATION LINKS                               */}
          {/* ================================================================= */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md shrink-0">
            {navLinks.map((item) => (
              item.path ? (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className="h-8 px-3.5 inline-flex items-center justify-center text-xs xl:text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-all duration-150 whitespace-nowrap cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  {item.label}
                </button>
              ) : (
                <ScrollLink
                  key={item.id}
                  to={item.id}
                  smooth={true}
                  duration={500}
                  spy={true}
                  offset={-90}
                  activeClass="!text-emerald-300 !bg-emerald-500/20 !border-emerald-500/30 font-semibold"
                  className="h-8 px-3.5 inline-flex items-center justify-center text-xs xl:text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-all duration-150 whitespace-nowrap cursor-pointer border border-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  {item.label}
                </ScrollLink>
              )
            ))}
          </div>

          {/* ================================================================= */}
          {/* 3. SOCIAL ICONS CLUSTER                                           */}
          {/* ================================================================= */}
          <div className="hidden xl:flex items-center gap-2 shrink-0">
            {socialLinks.map((social, idx) => (
              <a
                key={idx}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.aria}
                title={social.title}
                className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white/[0.12] border border-white/10 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-400 inline-flex items-center justify-center transition-all duration-200 shadow-sm shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                {social.icon}
              </a>
            ))}
          </div>

          {/* Subtle Vertical Divider */}
          <div className="hidden xl:block h-5 w-px bg-white/10 shrink-0" />

          {/* ================================================================= */}
          {/* 4. RIGHT-SIDE ACTION AREA (Vertically Centered)                   */}
          {/* ================================================================= */}
          <div className="hidden lg:flex items-center gap-2.5 xl:gap-3 shrink-0">
            
            {/* Language Switcher: [ සිංහල ] / [ English ] */}
            <button
              onClick={toggleLanguage}
              className="h-9 px-3.5 rounded-full bg-white/[0.04] hover:bg-white/[0.10] border border-white/10 hover:border-white/20 text-slate-200 hover:text-white inline-flex items-center justify-center gap-2 text-xs font-semibold whitespace-nowrap transition-all duration-200 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              aria-label={`Switch language to ${translations[lang].switchLang}`}
              title={`Switch language to ${translations[lang].switchLang}`}
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="font-sans leading-none">{translations[lang].switchLang}</span>
            </button>

            {/* Shop Login Button */}
            <button
              onClick={() => navigate("/login-shop")}
              className="h-9 px-3.5 rounded-full bg-white/[0.05] hover:bg-white/[0.12] border border-white/15 hover:border-emerald-500/40 text-slate-200 hover:text-white inline-flex items-center justify-center gap-2 text-xs font-semibold whitespace-nowrap transition-all duration-200 shadow-sm shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 group"
              title="Shop Owner Portal"
            >
              <Store className="w-3.5 h-3.5 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
              <span>{translations[lang].vendor}</span>
              <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-emerald-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>

            {/* User Login / Logout Button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleAuthAction}
              className={`h-9 px-4 rounded-full inline-flex items-center justify-center gap-2 text-xs font-bold whitespace-nowrap transition-all duration-200 shadow-sm shrink-0 focus:outline-none focus-visible:ring-2 ${
                isAuthenticated
                  ? "bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500 hover:text-white hover:border-rose-500"
                  : "bg-white/[0.08] hover:bg-white/[0.16] border border-white/20 text-white hover:border-white/30"
              }`}
            >
              {isAuthenticated ? (
                <>
                  <LogOut className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                  <span>{translations[lang].logout}</span>
                </>
              ) : (
                <>
                  <User className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                  <span>{translations[lang].login}</span>
                </>
              )}
            </motion.button>

            {/* Explore Places (Primary CTA Button) */}
            <button
              onClick={() => navigate("/discover")}
              className="h-9 px-4.5 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:to-teal-500 active:scale-[0.98] text-white inline-flex items-center justify-center gap-2 text-xs font-bold whitespace-nowrap shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-200 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              <Compass className="w-3.5 h-3.5 shrink-0 animate-spin-slow" />
              <span>{translations[lang].explore}</span>
            </button>
          </div>

          {/* ================================================================= */}
          {/* MOBILE / TABLET RIGHT CONTROLS                                    */}
          {/* ================================================================= */}
          <div className="flex lg:hidden items-center gap-2 shrink-0">
            {/* Mobile Language Button */}
            <button 
              onClick={toggleLanguage}
              className="h-8 px-2.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-slate-300 flex items-center gap-1.5 focus:outline-none"
              aria-label="Toggle language on mobile"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>{translations[lang].switchLang}</span>
            </button>
            
            {/* Hamburger / Close Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 text-white flex items-center justify-center active:scale-95 transition-all focus:outline-none"
              aria-label="Open navigation menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* ================================================================= */}
        {/* MOBILE CASCADING OVERLAY DRAWER                                   */}
        {/* ================================================================= */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Dim Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
                className="fixed inset-0 top-16 bg-slate-950/80 backdrop-blur-md z-30 lg:hidden"
              />

              {/* Drawer Sheet */}
              <motion.div
                ref={menuRef}
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 w-full bg-slate-900 border-b border-white/10 shadow-2xl z-40 rounded-b-3xl overflow-hidden lg:hidden"
              >
                <div className="px-6 py-6 flex flex-col space-y-5 max-h-[calc(100vh-80px)] overflow-y-auto">
                  
                  {/* Nav Links */}
                  <div className="space-y-1">
                    {navLinks.map((item) => (
                      <div key={item.id || item.label}>
                        {item.path ? (
                          <button
                            onClick={() => {
                              navigate(item.path);
                              setIsMenuOpen(false);
                            }}
                            className="w-full text-left py-2.5 px-3 rounded-xl text-sm font-medium text-slate-200 hover:text-emerald-400 hover:bg-white/5 transition-colors"
                          >
                            {item.label}
                          </button>
                        ) : (
                          <ScrollLink
                            to={item.id}
                            smooth={true}
                            duration={500}
                            offset={-80}
                            onClick={() => setIsMenuOpen(false)}
                            className="block py-2.5 px-3 rounded-xl text-sm font-medium text-slate-200 hover:text-emerald-400 hover:bg-white/5 transition-colors cursor-pointer"
                          >
                            {item.label}
                          </ScrollLink>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="h-px bg-white/10" />

                  {/* Actions in Mobile Sheet */}
                  <div className="flex flex-col gap-2.5">
                    <button
                      onClick={() => {
                        navigate("/discover");
                        setIsMenuOpen(false);
                      }}
                      className="h-11 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20"
                    >
                      <Compass size={16} />
                      <span>{translations[lang].explore}</span>
                    </button>

                    <button
                      onClick={() => {
                        navigate("/login-shop");
                        setIsMenuOpen(false);
                      }}
                      className="h-11 rounded-2xl bg-white/5 border border-white/10 text-white font-medium text-xs flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                    >
                      <Store size={15} className="text-emerald-400" />
                      <span>{translations[lang].vendor}</span>
                    </button>

                    <button
                      onClick={() => {
                        handleAuthAction();
                        setIsMenuOpen(false);
                      }}
                      className={`h-11 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                        isAuthenticated
                          ? "bg-rose-500/15 border border-rose-500/30 text-rose-300"
                          : "bg-white text-slate-950 hover:bg-slate-100"
                      }`}
                    >
                      {isAuthenticated ? <LogOut size={15} /> : <User size={15} />}
                      <span>{isAuthenticated ? translations[lang].logout : translations[lang].login}</span>
                    </button>
                  </div>

                  <div className="h-px bg-white/10" />

                  {/* Social Channel Links in Mobile Sheet */}
                  <div className="flex items-center justify-center gap-3 pt-1">
                    {socialLinks.map((social, idx) => (
                      <a
                        key={idx}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.aria}
                        className="w-9 h-9 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-emerald-400 flex items-center justify-center"
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
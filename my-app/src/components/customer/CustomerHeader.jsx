import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  User,
  LogOut,
  Settings,
  Compass,
  ChevronDown,
  Utensils,
  Hotel,
} from "lucide-react";
import Logo from "../../assets/Lion.jpg";
import { useSiteUserAuthStore } from "../../store/siteUserAuthStore";
import { useCartStore } from "../../store/useCartStore";

export default function CustomerHeader({ onSearchClick }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [headerSearchQuery, setHeaderSearchQuery] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);
  const searchInputRef = useRef(null);

  const { user, isAuthenticated, logout } = useSiteUserAuthStore();
  const { toggleCart, getTotalItems } = useCartStore();
  const cartItemCount = getTotalItems();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
    setIsSearchOpen(false);
    setHeaderSearchQuery("");
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  // Quick nav-bar search: submits straight into the Discover page's own
  // search + filter experience via the shared "q" query param.
  const handleHeaderSearchSubmit = (e) => {
    e.preventDefault();
    const query = headerSearchQuery.trim();
    setIsSearchOpen(false);
    setHeaderSearchQuery("");
    if (onSearchClick) {
      onSearchClick(query);
      return;
    }
    navigate(query ? `/discover?q=${encodeURIComponent(query)}` : "/discover");
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Customer Navigation Links
  const navLinks = [
    { label: "Discover", path: "/discover", icon: Compass },
    { label: "Restaurants", path: "/shops?type=restaurant", icon: Utensils },
    { label: "Hotels & Stays", path: "/shops?type=stays", icon: Hotel },
    { label: "Foods", path: "/foods", icon: ShoppingBag },
  ];

  const isActive = (path) => {
    if (path === "/discover") {
      return location.pathname === "/discover" || location.pathname === "/user/dashboard";
    }
    if (path === "/foods") {
      return location.pathname.startsWith("/foods");
    }
    if (path === "/shops?type=restaurant") {
      return location.pathname === "/shops" && location.search.includes("type=restaurant");
    }
    if (path === "/shops?type=stays") {
      return (
        location.pathname === "/shops" &&
        (location.search.includes("type=stays") ||
          location.search.includes("type=hotel") ||
          location.search.includes("type=villa") ||
          location.search.includes("type=guesthouse"))
      );
    }
    return location.pathname + location.search === path;
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80"
            : "bg-white/90 backdrop-blur-sm border-b border-slate-100"
        }`}
      >
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-4">
          
          {/* ================================================================= */}
          {/* 1. BRAND LOGO (Links to Home Page '/') */}
          {/* ================================================================= */}
          <Link
            to="/"
            className="flex items-center gap-2.5 sm:gap-3 group shrink-0 focus:outline-none select-none"
            title="Go to Ceylon Calling Home"
          >
            <div className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-full overflow-hidden ring-2 ring-emerald-500/25 group-hover:ring-emerald-400 transition-all duration-300 shadow-sm shrink-0">
              <img
                src={Logo}
                alt="Ceylon Calling Logo"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 leading-tight group-hover:text-emerald-600 transition-colors">
                Ceylon <span className="text-emerald-600">Calling</span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400 -mt-0.5">
                North Central Index
              </span>
            </div>
          </Link>

          {/* ================================================================= */}
          {/* 2. MAIN NAVIGATION ITEMS (Clean Rail, Vertically Centered) */}
          {/* ================================================================= */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-slate-100/70 border border-slate-200/60 backdrop-blur-md shrink-0">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.label}
                  to={link.path}
                  className={`h-8.5 px-3.5 inline-flex items-center justify-center gap-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                    active
                      ? "bg-white text-emerald-700 font-bold shadow-xs border border-slate-200/50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                  }`}
                >
                  <Icon size={14} className={active ? "text-emerald-600" : "text-slate-400"} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* ================================================================= */}
          {/* 3. RIGHT ACTIONS AREA (Search, Cart, User Account / Sign In) */}
          {/* ================================================================= */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Quick Search Action: expands into a real search field in place */}
            {isSearchOpen ? (
              <form onSubmit={handleHeaderSearchSubmit} className="relative">
                <Search
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={headerSearchQuery}
                  onChange={(e) => setHeaderSearchQuery(e.target.value)}
                  onBlur={() => {
                    if (!headerSearchQuery.trim()) setIsSearchOpen(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setIsSearchOpen(false);
                      setHeaderSearchQuery("");
                    }
                  }}
                  placeholder="Search places, food..."
                  aria-label="Search places and foods"
                  className="h-9 w-36 sm:w-56 pl-9 pr-3 rounded-full bg-white border border-emerald-500/60 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-2xs transition-all"
                />
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="h-9 px-3.5 rounded-full bg-slate-100/70 hover:bg-slate-200/70 border border-slate-200/80 text-xs font-medium text-slate-600 hover:text-slate-900 transition shadow-2xs inline-flex items-center gap-2 whitespace-nowrap"
                aria-label="Search places and foods"
              >
                <Search size={14} className="text-slate-400" />
                <span className="hidden sm:inline text-xs font-medium">Search places...</span>
              </button>
            )}

            {/* Cart Trigger */}
            <button
              onClick={toggleCart}
              className="relative h-9 w-9 rounded-full bg-slate-100/70 hover:bg-emerald-50 border border-slate-200/80 text-slate-700 hover:text-emerald-700 transition shadow-2xs inline-flex items-center justify-center shrink-0"
              aria-label="Open Shopping Cart"
            >
              <ShoppingBag size={16} />
              {cartItemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 flex h-4.5 min-w-[18px] px-1 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-extrabold text-white shadow-sm ring-2 ring-white"
                >
                  {cartItemCount}
                </motion.span>
              )}
            </button>

            {/* Authenticated User Menu vs Guest Sign In Button */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="h-9 px-2.5 sm:px-3 rounded-full bg-slate-100/70 hover:bg-slate-200/70 border border-slate-200/80 text-xs font-semibold text-slate-800 transition shadow-2xs inline-flex items-center gap-2 whitespace-nowrap"
                  aria-label="User Account Menu"
                >
                  <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center text-[11px] font-black uppercase shadow-xs shrink-0">
                    {user?.name ? user.name.charAt(0) : "U"}
                  </div>
                  <span className="hidden sm:inline font-bold truncate max-w-[90px]">
                    {user?.name?.split(" ")[0] || "Account"}
                  </span>
                  <ChevronDown size={13} className="text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-60 rounded-2xl bg-white p-2 shadow-2xl border border-slate-100 z-50 divide-y divide-slate-100"
                    >
                      <div className="p-3">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {user?.name || "Explorer"}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">{user?.email}</p>
                        <span className="inline-block mt-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                          Verified Traveler
                        </span>
                      </div>

                      <div className="py-1.5 space-y-0.5">
                        <Link
                          to="/profile"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition"
                        >
                          <User size={14} className="text-slate-400" />
                          <span>My Profile & Bookings</span>
                        </Link>
                        <Link
                          to="/cart"
                          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition"
                        >
                          <div className="flex items-center gap-2.5">
                            <ShoppingBag size={14} className="text-slate-400" />
                            <span>My Cart</span>
                          </div>
                          {cartItemCount > 0 && (
                            <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              {cartItemCount}
                            </span>
                          )}
                        </Link>
                        <Link
                          to="/usersetting"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition"
                        >
                          <Settings size={14} className="text-slate-400" />
                          <span>Account Settings</span>
                        </Link>
                      </div>

                      <div className="pt-1.5">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
                        >
                          <span>Sign Out</span>
                          <LogOut size={14} />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/user/login"
                className="h-9 px-4 rounded-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.98] text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all inline-flex items-center gap-2 whitespace-nowrap"
              >
                <User size={14} />
                <span>Sign In</span>
              </Link>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex md:hidden h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition shrink-0"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Sheet */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 top-16 bg-slate-950/40 backdrop-blur-xs z-30 md:hidden"
              />

              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 z-40 bg-white border-b border-slate-200 shadow-2xl overflow-hidden md:hidden"
              >
                <div className="p-4 space-y-4 max-h-[calc(100vh-80px)] overflow-y-auto">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block">
                      Explore Categories
                    </span>
                    {navLinks.map((link) => {
                      const Icon = link.icon;
                      const active = isActive(link.path);
                      return (
                        <Link
                          key={link.label}
                          to={link.path}
                          className={`flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition ${
                            active
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-xs"
                              : "bg-slate-50/80 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl ${active ? "bg-emerald-600 text-white" : "bg-white text-slate-500 shadow-xs"}`}>
                              <Icon size={16} />
                            </div>
                            <span>{link.label}</span>
                          </div>
                          {active && <span className="h-2 w-2 rounded-full bg-emerald-600 mr-1" />}
                        </Link>
                      );
                    })}
                  </div>

                  {/* Account Actions in Mobile Drawer */}
                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    {isAuthenticated ? (
                      <>
                        <Link
                          to="/profile"
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-50 text-xs font-semibold text-slate-800 hover:bg-slate-100"
                        >
                          <div className="flex items-center gap-2.5">
                            <User size={15} className="text-slate-400" />
                            <span>My Profile & Bookings</span>
                          </div>
                        </Link>
                        <Link
                          to="/usersetting"
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-50 text-xs font-semibold text-slate-800 hover:bg-slate-100"
                        >
                          <div className="flex items-center gap-2.5">
                            <Settings size={15} className="text-slate-400" />
                            <span>Account Settings</span>
                          </div>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center justify-between p-3 rounded-xl text-rose-600 bg-rose-50 text-xs font-semibold hover:bg-rose-100 transition"
                        >
                          <span>Sign Out</span>
                          <LogOut size={15} />
                        </button>
                      </>
                    ) : (
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <Link
                          to="/user/login"
                          className="py-3 text-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition"
                        >
                          Sign In
                        </Link>
                        <Link
                          to="/user/signup"
                          className="py-3 text-center rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold transition shadow-xs"
                        >
                          Register Free
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

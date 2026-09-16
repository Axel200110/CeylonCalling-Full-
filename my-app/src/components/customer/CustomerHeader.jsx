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
  MapPin,
  ChevronDown,
  Utensils,
  Hotel,
  Home,
  Bed,
  Store,
} from "lucide-react";
import Logo from "../../assets/Lion.jpg";
import { useSiteUserAuthStore } from "../../store/siteUserAuthStore";
import { useCartStore } from "../../store/useCartStore";

export default function CustomerHeader({ onSearchClick }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  const { user, isAuthenticated, logout } = useSiteUserAuthStore();
  const { toggleCart, getTotalItems } = useCartStore();
  const cartItemCount = getTotalItems();

  // Scroll detection for navbar blur and shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  // Click outside to close user dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/discover");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // 4 Core Establishment Types + Discover (Strictly NO Hidden Gems)
  const navLinks = [
    { label: "Discover", path: "/discover", icon: Compass },
    { label: "Restaurants", path: "/shops?type=restaurant", icon: Utensils },
    { label: "Hotels", path: "/shops?type=hotel", icon: Hotel },
    { label: "Villas", path: "/shops?type=villa", icon: Home },
    { label: "Guest Houses", path: "/shops?type=guesthouse", icon: Bed },
  ];

  const isActive = (path) => {
    if (path === "/discover") {
      return location.pathname === "/discover" || location.pathname === "/user/dashboard";
    }
    return location.pathname + location.search === path;
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3"
            : "bg-white/80 backdrop-blur-sm border-b border-slate-100 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Brand Logo */}
            <Link
              to="/discover"
              className="flex items-center gap-3 group shrink-0 focus:outline-none"
            >
              <div className="relative h-10 w-10 rounded-2xl overflow-hidden ring-2 ring-emerald-500/20 shadow-sm transition-transform duration-300 group-hover:scale-105">
                <img
                  src={Logo}
                  alt="Ceylon Calling"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-lg font-black tracking-tight text-slate-900 leading-tight">
                  Ceylon <span className="text-emerald-600">Calling</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Tourism & Dining
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.label}
                    to={link.path}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                      active
                        ? "bg-emerald-50 text-emerald-700 font-bold border border-emerald-100 shadow-sm"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <Icon size={14} className={active ? "text-emerald-600" : "text-slate-400"} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Actions: Search, Cart, User Profile */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Quick Search Action */}
              <button
                onClick={() => (onSearchClick ? onSearchClick() : navigate("/shops"))}
                className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-xs font-medium text-slate-500 hover:text-slate-800 transition shadow-sm"
                aria-label="Search"
              >
                <Search size={14} className="text-slate-400" />
                <span className="hidden md:inline">Search places...</span>
              </button>

              {/* Cart Drawer Trigger */}
              <button
                onClick={toggleCart}
                className="relative flex items-center justify-center h-10 w-10 rounded-full bg-slate-50 hover:bg-emerald-50 border border-slate-200/80 text-slate-700 hover:text-emerald-700 transition shadow-sm"
                aria-label="View Cart"
              >
                <ShoppingBag size={17} />
                {cartItemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-extrabold text-white shadow-md ring-2 ring-white"
                  >
                    {cartItemCount}
                  </motion.span>
                )}
              </button>

              {/* User Account / Auth Area */}
              {isAuthenticated ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 transition"
                  >
                    <div className="h-7 w-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold uppercase shadow-sm">
                      {user?.name ? user.name.charAt(0) : "U"}
                    </div>
                    <span className="hidden sm:inline font-bold truncate max-w-[100px]">
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
                        className="absolute right-0 mt-2 w-56 rounded-2xl bg-white p-2 shadow-xl border border-slate-100 z-50 divide-y divide-slate-50"
                      >
                        <div className="p-3">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {user?.name || "Customer"}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                        </div>

                        <div className="py-1.5 space-y-0.5">
                          <Link
                            to="/user/profile"
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition"
                          >
                            <User size={14} className="text-slate-400" />
                            <span>My Profile</span>
                          </Link>
                          <Link
                            to="/cart"
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition"
                          >
                            <ShoppingBag size={14} className="text-slate-400" />
                            <span>My Cart ({cartItemCount})</span>
                          </Link>
                          <Link
                            to="/user/placepage"
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition"
                          >
                            <MapPin size={14} className="text-slate-400" />
                            <span>My Travel Places</span>
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
                            className="flex w-full items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition"
                          >
                            <LogOut size={14} />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/user/login"
                    className="px-4 py-2 rounded-full text-xs font-bold text-slate-700 hover:text-emerald-600 hover:bg-slate-50 transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/partner-with-us"
                    className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold shadow-sm transition"
                  >
                    <Store size={13} />
                    <span>Partner</span>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="flex lg:hidden h-10 w-10 items-center justify-center rounded-full bg-slate-50 border border-slate-200/80 text-slate-700"
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="fixed top-[65px] left-0 right-0 z-30 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-xl overflow-hidden lg:hidden"
          >
            <div className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-2">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.path);
                  return (
                    <Link
                      key={link.label}
                      to={link.path}
                      className={`flex items-center gap-2.5 p-3 rounded-2xl text-xs font-bold transition ${
                        active
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm"
                          : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <Icon size={16} className={active ? "text-emerald-600" : "text-slate-400"} />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                {!isAuthenticated ? (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/user/login"
                      className="py-2.5 text-center rounded-xl bg-slate-100 text-slate-800 text-xs font-bold"
                    >
                      User Login
                    </Link>
                    <Link
                      to="/partner-with-us"
                      className="py-2.5 text-center rounded-xl bg-slate-900 text-white text-xs font-bold"
                    >
                      Partner With Us
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Link
                      to="/user/profile"
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 text-xs font-semibold text-slate-800"
                    >
                      <span>My Profile</span>
                      <User size={14} className="text-slate-400" />
                    </Link>
                    <Link
                      to="/cart"
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 text-xs font-semibold text-slate-800"
                    >
                      <span>My Cart ({cartItemCount})</span>
                      <ShoppingBag size={14} className="text-slate-400" />
                    </Link>
                    <Link
                      to="/user/placepage"
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 text-xs font-semibold text-slate-800"
                    >
                      <span>My Travel Places</span>
                      <MapPin size={14} className="text-slate-400" />
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl text-red-600 bg-red-50 text-xs font-semibold"
                    >
                      <span>Sign Out</span>
                      <LogOut size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

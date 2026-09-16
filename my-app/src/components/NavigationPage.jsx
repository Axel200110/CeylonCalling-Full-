import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Compass,
  Heart,
  Home,
  LogIn,
  LogOut,
  Menu,
  Settings,
  User,
  X
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/Lion.jpg";
import { useSiteUserAuthStore } from "../store/siteUserAuthStore";

function SidebarNavigation() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarRef = useRef(null);

  const { user, isAuthenticated, logout } = useSiteUserAuthStore();
  const wishlistCount = 3;

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMobileOpen) return;
    const handleOutsideClick = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isMobileOpen]);

  // Advanced Async Notification System Callback
  const handleLogoutAction = async () => {
    // Uses react-hot-toast's promise feature to handle the loading -> success state seamlessly
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
  };

  const isActivePath = (path) => location.pathname === path;

  const tooltipDetails = {
    home: { title: "Go to Home", desc: "Return to main dashboard and discovery features." },
    wishlist: { title: "Your Wishlist", desc: `View your ${wishlistCount} saved custom itineraries.` },
    settings: { title: "Account Settings", desc: "Manage your personal profile configurations." },
    logout: { title: "Sign Out", desc: "Safely clear and close your active system session." }
  };

  const sidebarLinks = [
    { name: "Home Page", path: "/", icon: Home, key: "home" },
    ...(isAuthenticated 
      ? [
          { name: `My Wishlist (${wishlistCount})`, path: "/user/wishlist", icon: Heart, key: "wishlist", isWishlist: true },
          { name: "Account Settings", path: "/usersetting", icon: Settings, key: "settings" }
        ]
      : [])
  ];

  return (
    <>
      {/* --- MOBILE TOP NAVBAR BAR --- */}
      <div className="flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/90 px-4 shadow-sm backdrop-blur-md md:hidden fixed top-0 left-0 z-40">
        <button onClick={() => navigate("/")} className="flex items-center gap-2">
          <img src={Logo} alt="Logo" className="h-8 w-8 rounded-full object-cover" />
          <span className="text-sm font-bold tracking-tight text-slate-900">
            Ceylon <span className="text-emerald-500">Calling</span>
          </span>
        </button>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700"
        >
          {isMobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* --- SIDEBAR RESPONSIVE CONTAINER --- */}
      <aside
        ref={sidebarRef}
        className={`fixed bottom-0 top-0 left-0 z-40 flex flex-col border-r border-slate-200/80 bg-white text-slate-900 transition-all duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"} 
          md:translate-x-0 ${isSidebarExpanded ? "md:w-64" : "md:w-20"}
          ${isMobileOpen ? "pt-4" : "pt-0"} md:pt-0`}
      >
        {/* HEADER BRAND LOGO */}
        <div className="relative flex h-20 items-center px-4 border-b border-slate-100">
          <button
            onClick={() => navigate("/")}
            className="group flex items-center gap-3 rounded-xl p-1 focus:outline-none"
          >
            <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center">
              <img
                src={Logo}
                alt="Logo"
                className="h-10 w-10 rounded-full object-cover ring-2 ring-emerald-500/20 shadow-md"
              />
            </div>
            {isSidebarExpanded && (
              <div className="flex flex-col text-left whitespace-nowrap">
                <span className="text-sm font-bold tracking-tight text-slate-900">
                  Ceylon <span className="text-emerald-500">Calling</span>
                </span>
                <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
                  Stays & Dining
                </span>
              </div>
            )}
          </button>

          <button
            onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
            className="absolute -right-3 top-7 hidden h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-transform hover:text-slate-800 md:flex"
          >
            {isSidebarExpanded ? <ArrowLeft size={12} /> : <ArrowRight size={12} />}
          </button>
        </div>

        {/* LINK RENDER SYSTEM MIDDLE */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {sidebarLinks.map((link) => {
            const IconComponent = link.icon;
            const active = isActivePath(link.path);

            return (
              <div key={link.key} className="relative">
                <button
                  onClick={() => navigate(link.path)}
                  onMouseEnter={() => !isSidebarExpanded && setActiveTooltip(link.key)}
                  onMouseLeave={() => setActiveTooltip(null)}
                  className={`group flex w-full items-center gap-3 rounded-xl p-3 text-left font-semibold transition-all focus:outline-none
                    ${!isSidebarExpanded && "justify-center md:justify-start"}
                    ${active 
                      ? "bg-emerald-50 text-emerald-700 font-bold" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                >
                  <div className="relative flex flex-shrink-0 items-center justify-center">
                    <IconComponent 
                      size={18} 
                      className={`${active ? "text-emerald-600" : "text-slate-400 group-hover:text-slate-600"} 
                        ${link.isWishlist && "group-hover:text-red-500"}`} 
                    />
                    {link.isWishlist && wishlistCount > 0 && !isSidebarExpanded && (
                      <span className="absolute -right-1 -top-1 flex h-2 w-2 rounded-full bg-red-500" />
                    )}
                  </div>
                  
                  {isSidebarExpanded && (
                    <span className="text-xs tracking-wide flex-1">{link.name}</span>
                  )}

                  {link.isWishlist && wishlistCount > 0 && isSidebarExpanded && (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600">
                      {wishlistCount}
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </nav>

        {/* FOOTER AREA */}
        <div className="border-t border-slate-100 p-3 bg-slate-50/50">
          {isAuthenticated && user ? (
            <div className="flex flex-col gap-2">
              <div className={`flex items-center gap-3 rounded-xl p-2 ${isSidebarExpanded ? "bg-white border border-slate-200/60 shadow-sm" : "justify-center"}`}>
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold text-xs shadow-sm">
                  {user.name ? user.name.charAt(0).toUpperCase() : <User size={12} />}
                </div>
                {isSidebarExpanded && (
                  <div className="flex flex-col text-left overflow-hidden">
                    <span className="text-xs font-bold text-slate-800 truncate">{user.name}</span>
                    <span className="text-[10px] text-slate-400 font-medium truncate">{user.email}</span>
                  </div>
                )}
              </div>

              <button
                onClick={handleLogoutAction}
                onMouseEnter={() => !isSidebarExpanded && setActiveTooltip('logout')}
                onMouseLeave={() => setActiveTooltip(null)}
                className={`group flex w-full items-center gap-3 rounded-xl p-3 text-left font-semibold text-red-600 transition-all hover:bg-red-50
                  ${!isSidebarExpanded && "justify-center"}`}
              >
                <LogOut size={18} className="text-red-500 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
                {isSidebarExpanded && <span className="text-xs tracking-wide">Sign Out Session</span>}
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate("/user/login")}
              className={`flex w-full items-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs font-bold tracking-wide text-white transition-all hover:bg-slate-800
                ${!isSidebarExpanded ? "justify-center px-0" : "justify-center px-4"}`}
            >
              <LogIn size={14} />
              {isSidebarExpanded && <span>Access Account</span>}
            </button>
          )}

          {isSidebarExpanded && (
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-3 py-2 text-white shadow-sm">
              <Compass size={12} className="animate-spin-slow flex-shrink-0" />
              <span className="text-[9px] font-bold uppercase tracking-wider">
                Travel Desk Active
              </span>
            </div>
          )}
        </div>

        {/* --- DESKTOP HOVER TOOLTIPS --- */}
        <AnimatePresence>
          {activeTooltip && !isSidebarExpanded && (
            <motion.div
              initial={{ opacity: 0, x: -10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 w-56 rounded-xl border border-slate-100 bg-white p-3 shadow-xl pointer-events-none text-slate-800"
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                {tooltipDetails[activeTooltip].title}
              </p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500 font-medium">
                {tooltipDetails[activeTooltip].desc}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </aside>

      {/* --- BACKGROUND DIM BACKDROP FOR MOBILE --- */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-xs md:hidden"
        />
      )}
    </>
  );
}

export default SidebarNavigation;
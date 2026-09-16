import { AnimatePresence, motion } from "framer-motion";
import {
    ArrowLeft,
    ArrowRight,
    Home,
    LogOut,
    Menu,
    MessageSquare,
    PlusCircle,
    Settings,
    ShoppingBag,
    X
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../../assets/Lion.jpg";
import { useAuthStore } from "../store/authStore";

function SidebarNavigation() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarRef = useRef(null);
  
  const { shop, user, logout } = useAuthStore();

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

  const isActivePath = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Successfully signed out");
      navigate("/login");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  const tooltipDetails = {
    home: { title: "Dashboard Hub", desc: "View your store analytics and performance charts." },
    myshop: { title: "Manage Shop", desc: "Edit your menu items, categories, and settings." },
    messages: { title: "Admin Messages", desc: "Chat with Ceylon Calling system administrator." },
    settings: { title: "Account Settings", desc: "Update your profile security and password." },
    profile: { title: "Edit Shop Profile", desc: "Update your store branding, logo, and contact info." },
    password: { title: "Change Password", desc: "Update your account login credentials." },
    logout: { title: "Sign Out", desc: "Sign out of your merchant account." }
  };

  const structuralGroups = [
    {
      groupHeading: "Operations Hub",
      items: [
        { name: "Dashboard Hub", path: "/dashboard", icon: Home, key: "home" },
        { name: "Manage Shop", path: "/myshop", icon: PlusCircle, key: "myshop" },
        { name: "Admin Messages", path: "/messages", icon: MessageSquare, key: "messages" },
      ]
    },
    {
      groupHeading: "Settings & Profile",
      items: [
        { name: "Account Settings", path: "/settings", icon: Settings, key: "settings" },
      
      ]
    }
  ];

  const getShopPhoto = () => {
    if (shop?.photo) {
      return shop.photo.startsWith("http") ? shop.photo : shop.photo;
    }
    return null;
  };

  return (
    <>
      {/* --- MOBILE TOP NAVBAR BAR --- */}
      <div className="flex h-16 w-full items-center justify-between border-b border-white/[0.06] bg-neutral-950/80 backdrop-blur-md px-4 shadow-md md:hidden fixed top-0 left-0 z-40">
        <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2">
          <img src={Logo} alt="Logo" className="h-8 w-8 rounded-xl object-cover ring-2 ring-emerald-500/20" />
          <span className="text-sm font-black tracking-tight text-white">
            Ceylon <span className="text-emerald-500">Calling</span>
          </span>
        </button>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-neutral-900 text-neutral-250 active:scale-95 transition"
        >
          {isMobileOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {/* --- SIDEBAR RESPONSIVE CONTAINER --- */}
      <aside
        ref={sidebarRef}
        className={`fixed bottom-0 top-0 left-0 z-40 flex flex-col border-r border-white/[0.06] bg-neutral-950/70 backdrop-blur-xl text-neutral-250 transition-all duration-300 ease-in-out shadow-2xl
          ${isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"} 
          md:translate-x-0 ${isSidebarExpanded ? "md:w-64" : "md:w-20"}
          ${isMobileOpen ? "pt-4" : "pt-0"} md:pt-0`}
      >
        {/* HEADER BRAND LOGO ZONE */}
        <div className="relative flex h-20 items-center px-4 border-b border-white/[0.06]">
          <button
            onClick={() => navigate("/dashboard")}
            className="group flex items-center gap-3 rounded-xl p-1 focus:outline-none"
          >
            <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center">
              <img
                src={Logo}
                alt="Logo"
                className="h-10 w-10 rounded-xl object-cover ring-2 ring-emerald-500/30 shadow-md group-hover:scale-105 transition duration-300"
              />
              <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-emerald-500 border-2 border-neutral-950 rounded-full" />
            </div>
            {isSidebarExpanded && (
              <div className="flex flex-col text-left whitespace-nowrap">
                <span className="text-sm font-black tracking-tight text-white">
                  Ceylon <span className="text-emerald-500">Calling</span>
                </span>
                <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-400">
                  Merchant Suite
                </span>
              </div>
            )}
          </button>

          <button
            onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
            className="absolute -right-3.5 top-6.5 hidden h-7 w-7 items-center justify-center rounded-full border border-white/[0.08] bg-neutral-900 text-neutral-400 shadow-md transition-transform hover:text-white md:flex hover:bg-neutral-800"
          >
            {isSidebarExpanded ? <ArrowLeft size={13} /> : <ArrowRight size={13} />}
          </button>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 space-y-6 px-3 py-6 overflow-y-auto scrollbar-none bg-transparent">
          {structuralGroups.map((group, groupIdx) => {
            if (group.items.length === 0) return null;

            return (
              <div key={groupIdx} className="space-y-2">
                {isSidebarExpanded ? (
                  <p className="px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                    {group.groupHeading}
                  </p>
                ) : (
                  <div className="h-px bg-white/[0.06] mx-2 my-2" />
                )}

                <div className="space-y-1">
                  {group.items.map((link) => {
                    const IconComponent = link.icon;
                    const active = link.key === "home" ? isActivePath(link.path) :
                                   link.key === "myshop" ? isActivePath(link.path) :
                                   link.key === "messages" ? isActivePath(link.path) :
                                   link.key === "settings" ? (isActivePath(link.path) && !location.state?.openProfile && !location.state?.openPassword) :
                                   link.key === "profile" ? (isActivePath(link.path) && location.state?.openProfile) :
                                   link.key === "password" ? (isActivePath(link.path) && location.state?.openPassword) :
                                   isActivePath(link.path);

                    return (
                      <div key={link.key} className="relative">
                        <button
                          onClick={() => navigate(link.path, link.state ? { state: link.state } : undefined)}
                          onMouseEnter={() => !isSidebarExpanded && setActiveTooltip(link.key)}
                          onMouseLeave={() => setActiveTooltip(null)}
                          className={`group flex w-full items-center gap-3 rounded-xl p-3 text-left font-semibold transition-all duration-200 focus:outline-none
                            ${!isSidebarExpanded && "justify-center"}
                            ${active 
                              ? "bg-emerald-500/[0.08] text-emerald-400 border-l-2 border-emerald-500 shadow-[inset_0_0_12px_rgba(16,185,129,0.08)]" 
                              : "text-neutral-400 hover:bg-white/[0.04] hover:text-white"
                            }`}
                        >
                          <div className="relative flex flex-shrink-0 items-center justify-center">
                            <IconComponent 
                              size={18} 
                              className={`${active ? "text-emerald-400" : "text-neutral-400 group-hover:text-neutral-200"} transition-colors`} 
                            />
                          </div>
                          
                          {isSidebarExpanded && (
                            <span className="text-xs tracking-wide flex-1 truncate">{link.name}</span>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* BOTTOM USER PROFILE & LOGOUT */}
        <div className="border-t border-white/[0.06] p-3 bg-black/20">
          <div className="flex flex-col gap-2">
            {/* Merchant Info block */}
            <div className={`flex items-center gap-3 p-2 rounded-xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-md ${!isSidebarExpanded && "justify-center"}`}>
              {getShopPhoto() ? (
                <img
                  src={getShopPhoto()}
                  alt={shop?.name || "Store"}
                  className="w-8 h-8 rounded-lg object-cover ring-1 ring-white/10 shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-emerald-600/20 flex items-center justify-center text-emerald-400 font-bold text-xs shrink-0 border border-emerald-500/10">
                  <ShoppingBag size={14} />
                </div>
              )}
              {isSidebarExpanded && (
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-xs font-semibold text-white truncate capitalize">{shop?.name || "Merchant"}</span>
                  <span className="text-[10px] text-neutral-500 truncate">{user?.email || "Account Owner"}</span>
                </div>
              )}
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              onMouseEnter={() => !isSidebarExpanded && setActiveTooltip("logout")}
              onMouseLeave={() => setActiveTooltip(null)}
              className={`group flex items-center gap-3 rounded-xl p-3 text-left font-semibold transition-all duration-200 text-rose-400 hover:bg-rose-950/20 hover:text-rose-300 focus:outline-none
                ${!isSidebarExpanded && "justify-center"}`}
            >
              <LogOut size={18} className="text-rose-400/80 group-hover:text-rose-300" />
              {isSidebarExpanded && (
                <span className="text-xs tracking-wide flex-1 truncate">Sign Out</span>
              )}
            </button>
          </div>
        </div>

        {/* --- DESKTOP TOOLTIPS --- */}
        <AnimatePresence>
          {activeTooltip && !isSidebarExpanded && (
            <motion.div
              initial={{ opacity: 0, x: -6, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -6, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute left-full ml-3.5 top-1/2 -translate-y-1/2 z-50 w-56 rounded-xl border border-white/[0.08] bg-neutral-900/90 backdrop-blur-md p-3.5 shadow-xl pointer-events-none text-neutral-300"
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                {tooltipDetails[activeTooltip]?.title}
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-neutral-400">
                {tooltipDetails[activeTooltip]?.desc}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </aside>

      {/* --- BACKGROUND DIM BACKDROP FOR MOBILE MATRIX --- */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-30 bg-neutral-950/60 backdrop-blur-xs md:hidden"
        />
      )}
    </>
  );
}

export default SidebarNavigation;
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
  Tag,
  Bell,
  MessageCircle,
  Bed,
  Layers,
  Store,
  X
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Logo from "../../assets/Lion.jpg";
import { useAuthStore } from "../store/authStore";

function SidebarNavigation() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarRef = useRef(null);
  
  const { shop, user, logout } = useAuthStore();

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

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

  const isAccommodation =
    shop?.capabilities?.hasAccommodation ||
    ["hotel", "villa", "guesthouse"].includes(shop?.shopType?.toLowerCase());

  const structuralGroups = [
    {
      groupHeading: "Operations Hub",
      items: [
        { name: "Dashboard Hub", path: "/dashboard", icon: Home, key: "home" },
        { name: "Food Menu & Stock", path: "/myshop", icon: PlusCircle, key: "myshop" },
        { name: "Orders & Live Queue", path: "/dashboard/orders", icon: ShoppingBag, key: "orders" },
        ...(isAccommodation
          ? [{ name: "Rooms & Lodging", path: "/dashboard/rooms", icon: Bed, key: "rooms" }]
          : []),
      ],
    },
    {
      groupHeading: "Marketing & Engagement",
      items: [
        { name: "Promos & Deals", path: "/dashboard/promotions", icon: Tag, key: "promotions" },
        { name: "Announcements", path: "/dashboard/announcements", icon: Bell, key: "announcements" },
        { name: "Customer Feedback", path: "/dashboard/reviews", icon: MessageCircle, key: "reviews" },
        { name: "Admin Messages", path: "/messages", icon: MessageSquare, key: "messages" },
      ],
    },
    {
      groupHeading: "Business Configuration",
      items: [
        { name: "Business Settings", path: "/settings", icon: Settings, key: "settings" },
      ],
    },
  ];

  return (
    <>
      {/* --- MOBILE TOP NAVBAR --- */}
      <div className="flex h-16 w-full items-center justify-between border-b border-white/[0.06] bg-neutral-950/80 backdrop-blur-md px-4 shadow-md md:hidden fixed top-0 left-0 z-40">
        <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2">
          <img src={Logo} alt="Logo" className="h-8 w-8 rounded-xl object-cover ring-2 ring-emerald-500/20" />
          <span className="text-sm font-black tracking-tight text-white">
            Ceylon <span className="text-emerald-500">Calling</span>
          </span>
        </button>
        <button onClick={() => setIsMobileOpen(true)} className="text-white p-2 rounded-xl bg-neutral-900">
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* --- DESKTOP SIDEBAR --- */}
      <aside
        className={`hidden md:flex flex-col border-r border-neutral-900 bg-neutral-950 h-screen sticky top-0 transition-all duration-300 ${
          isSidebarExpanded ? "w-64" : "w-20"
        } shrink-0 z-30`}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-neutral-900">
          <div className="flex items-center gap-2.5 truncate">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center font-black text-white shrink-0">
              CC
            </div>
            {isSidebarExpanded && (
              <div className="truncate">
                <span className="font-bold text-sm text-white block truncate">
                  {shop?.name || "Merchant"}
                </span>
                <span className="text-[10px] text-emerald-400 capitalize block">
                  {shop?.shopType || "Tourism Partner"}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
            className="text-neutral-500 hover:text-white p-1 rounded-lg"
          >
            {isSidebarExpanded ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-5 overflow-y-auto scrollbar-hide">
          {structuralGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {isSidebarExpanded && (
                <span className="px-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                  {group.groupHeading}
                </span>
              )}
              {group.items.map((item) => {
                const ItemIcon = item.icon;
                const active = isActivePath(item.path);
                return (
                  <Link
                    key={item.key}
                    to={item.path}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      active
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-md shadow-emerald-500/5"
                        : "text-neutral-400 hover:text-white hover:bg-neutral-900/60"
                    }`}
                  >
                    <ItemIcon className={`h-4 w-4 shrink-0 ${active ? "text-emerald-400" : "text-neutral-400"}`} />
                    {isSidebarExpanded && <span className="truncate">{item.name}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-neutral-900">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {isSidebarExpanded && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* --- MOBILE DRAWER --- */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
          <aside className="relative flex flex-col w-72 max-w-[80%] bg-neutral-950 border-r border-neutral-900 z-10 p-4">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-900 mb-4">
              <span className="font-bold text-sm text-white">Merchant Menu</span>
              <button onClick={() => setIsMobileOpen(false)} className="text-neutral-400">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 space-y-4 overflow-y-auto">
              {structuralGroups.map((group, gIdx) => (
                <div key={gIdx} className="space-y-1">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
                    {group.groupHeading}
                  </span>
                  {group.items.map((item) => {
                    const ItemIcon = item.icon;
                    const active = isActivePath(item.path);
                    return (
                      <Link
                        key={item.key}
                        to={item.path}
                        onClick={() => setIsMobileOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold ${
                          active ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "text-neutral-400"
                        }`}
                      >
                        <ItemIcon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}

export default SidebarNavigation;

import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Lock,
  LogOut,
  Palette,
  ShieldCheck,
  Sliders,
  Sparkles,
  Store,
  User
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import SideNavbar from "../../shopowner/components/SideNavbar";
import ChangePasswordModal from "../components/ChangePasswordModel";
import ShopEditModal from "../components/ShopEdit";
import UpdateProfileModal from "../components/UpdateProfileModel";
import { useAuthStore } from "../store/authStore";

const Settings = () => {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const [shop, setShop] = useState(null);
  const [showShopEdit, setShowShopEdit] = useState(false);
  const [loadingShop, setLoadingShop] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setLoggingOut(false);
    }
  };

  const fetchShop = async () => {
    try {
      setLoadingShop(true);
      const res = await axios.get("/api/shops/my-shop", {
        withCredentials: true,
      });
      setShop(res.data.shop);
      return res.data.shop;
    } catch (error) {
      console.error("Failed to fetch shop", error);
      return null;
    } finally {
      setLoadingShop(false);
    }
  };

  const handleOpenProfile = async () => {
    const fetchedShop = await fetchShop();
    if (fetchedShop) {
      setShowUpdateProfile(true);
    }
  };

  const settingsOptions = [
    {
      id: "profile",
      icon: User,
      title: "Shop & Account Profile",
      description: "Manage shop details, owner info, and contact credentials",
      badge: "Core Setup",
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      iconBg: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      onClick: handleOpenProfile,
      isLoading: loadingShop,
    },
    {
      id: "password",
      icon: Lock,
      title: "Security & Authentication",
      description: "Update your password and manage account access security",
      badge: "Encrypted",
      badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      iconBg: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      onClick: () => setShowChangePassword(true),
    },
    {
      id: "notifications",
      icon: Bell,
      title: "Notification Preferences",
      description: "Control operational alerts, booking updates, and system emails",
      badge: "Realtime",
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      iconBg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      onClick: () => {},
    },
    {
      id: "theme",
      icon: Palette,
      title: "Workspace Theme",
      description: "Customize your visual appearance and interface styling",
      badge: "Dark Mode",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      iconBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      onClick: () => {},
    },
    {
      id: "logout",
      icon: LogOut,
      title: "Terminate Session",
      description: "Safely sign out from Ceylon Calling partner platform",
      badge: "Action",
      badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      iconBg: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      isLogout: true,
      onClick: handleLogout,
      isLoading: loggingOut,
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#07090E] text-slate-100 font-sans antialiased selection:bg-emerald-500/20 selection:text-emerald-300 relative overflow-hidden">
      {/* Background Glow Elements */}
      <div className="fixed top-0 left-1/3 w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="fixed bottom-0 right-10 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[150px] pointer-events-none" />

      <SideNavbar />

      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto relative z-10 md:pl-64 scrollbar-thin scrollbar-thumb-white/10">
        {/* ================= HEADER CONTROL BAR ================= */}
        <header className="h-20 shrink-0 border-b border-white/[0.08] bg-[#07090E]/80 backdrop-blur-xl px-6 md:px-8 flex items-center justify-between shadow-2xl sticky top-0 z-20">
          <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 to-teal-600" />

          <div className="flex items-center gap-4 pl-2">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/5">
                <Sliders className="w-5 h-5" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#07090E] rounded-full shadow-md shadow-emerald-500/50" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-tight">System Preferences</h1>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  <ShieldCheck className="w-3 h-3" /> Account Control
                </span>
              </div>
              <p className="text-xs text-slate-400 font-normal mt-0.5 flex items-center gap-1.5">
                <span>Ceylon Calling Shop Portal</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400 font-medium">Configured & Secure</span>
              </p>
            </div>
          </div>
        </header>

        {/* ================= MAIN CONTENT AREA ================= */}
        <div className="flex-1 p-6 sm:p-8 max-w-5xl mx-auto w-full space-y-8">
          {/* USER QUICK PROFILE HEADER CARD */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-6 rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-2xl shadow-2xl relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-xl font-bold shadow-xl">
                {user?.name ? user.name.charAt(0).toUpperCase() : <Store className="w-7 h-7" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-white tracking-tight">{user?.name || "Shop Administrator"}</h2>
                  <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> Verified Partner
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{user?.email || "owner@ceyloncalling.com"}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-white/[0.06]">
              <span className="text-[11px] font-semibold text-slate-400 bg-white/[0.04] border border-white/[0.08] px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Active Session
              </span>
            </div>
          </motion.div>

          {/* SETTINGS OPTIONS GRID */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">General Preferences</h3>

            <div className="grid gap-4">
              {settingsOptions.map((option, idx) => {
                const IconComponent = option.icon;
                return (
                  <motion.button
                    key={option.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    whileHover={{ scale: 1.01, x: 2 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={option.onClick}
                    disabled={option.isLoading}
                    className={`w-full text-left p-5 rounded-2xl border transition-all duration-200 backdrop-blur-xl relative group flex items-center justify-between gap-4 ${
                      option.isLogout
                        ? "bg-rose-500/[0.02] hover:bg-rose-500/[0.06] border-rose-500/20 hover:border-rose-500/40"
                        : "bg-white/[0.02] hover:bg-white/[0.05] border-white/[0.08] hover:border-white/[0.15]"
                    } disabled:opacity-50 disabled:pointer-events-none shadow-xl`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${option.iconBg}`}>
                        {option.isLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <IconComponent className="w-5 h-5" />
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className={`text-sm font-bold tracking-tight ${option.isLogout ? "text-rose-400" : "text-white"}`}>
                            {option.title}
                          </h4>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wider ${option.badgeColor}`}>
                            {option.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-normal leading-relaxed">{option.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {option.isLoading ? (
                        <span className="text-xs text-emerald-400 font-medium hidden sm:inline">Fetching data...</span>
                      ) : (
                        <ChevronRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${option.isLogout ? "text-rose-400/70" : "text-slate-500"}`} />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* ================= MODALS OVERLAY ================= */}
      <AnimatePresence>
        {showShopEdit && shop && (
          <ShopEditModal shop={shop} onClose={() => setShowShopEdit(false)} />
        )}
        {showUpdateProfile && shop && (
          <UpdateProfileModal shop={shop} onClose={() => setShowUpdateProfile(false)} />
        )}
        {showChangePassword && (
          <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Settings;
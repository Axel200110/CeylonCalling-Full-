import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { 
  Shield, LayoutDashboard, ShoppingBag, Users, MapPin, 
  Settings, LogOut, Bell, Menu, X, ArrowUpRight, CheckCircle,
  MessageSquare
} from "lucide-react";
import toast from "react-hot-toast";
import { useAdminStore } from "../store/adminStore";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { logs, logout, checkAuth } = useAdminStore();

  // Sync session authentication state with the backend on layout load
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Route security guard checking local storage
  useEffect(() => {
    const adminToken = localStorage.getItem("admin_token");
    if (!adminToken) {
      toast.error("Authentication required to access admin panel.");
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Backend logout failed:", err);
    } finally {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      toast.success("Successfully logged out");
      navigate("/admin/login");
    }
  };

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Shops & Merchants", path: "/admin/shops", icon: ShoppingBag },
    { name: "Private Messages", path: "/admin/messages", icon: MessageSquare },
    { name: "Users Directory", path: "/admin/users", icon: Users },
    { name: "Listings Directory", path: "/admin/listings", icon: MapPin },
    { name: "Global Settings", path: "/admin/settings", icon: Settings },
  ];

  // Helper to determine active path
  const isActive = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  // Get current path readable name
  const getCurrentPageName = () => {
    const matched = menuItems.find((item) => isActive(item.path));
    return matched ? matched.name : "Admin Panel";
  };

  // Filter logs for notification list (max 4 items)
  const notifications = logs.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#080B11] text-gray-100 flex font-sans">
      
      {/* --- DESKTOP SIDEBAR --- */}
      <aside 
        className={`hidden md:flex flex-col border-r border-gray-900 bg-[#0B0F17] transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-20"
        } shrink-0`}
      >
        {/* Brand Logo Banner */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-gray-900 overflow-hidden">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
            <Shield className="h-5 w-5 text-white" />
          </div>
          {isSidebarOpen && (
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent truncate">
              Ceylon Calling
            </span>
          )}
        </div>

        {/* Navigation Sidebar List */}
        <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto scrollbar-hide">
          {menuItems.map((item) => {
            const ActiveIcon = item.icon;
            const itemActive = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 py-3 px-3.5 rounded-xl transition-all duration-200 group ${
                  itemActive 
                    ? "bg-gradient-to-r from-blue-600/15 to-indigo-600/10 text-blue-400 border border-blue-500/20" 
                    : "text-gray-400 hover:text-white hover:bg-gray-900/50 border border-transparent"
                }`}
              >
                <ActiveIcon className={`h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                  itemActive ? "text-blue-400" : "text-gray-400 group-hover:text-white"
                }`} />
                {isSidebarOpen && (
                  <span className="text-sm font-medium tracking-wide truncate">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer Account Options */}
        <div className="p-4 border-t border-gray-900">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 py-3 px-3.5 w-full rounded-xl text-gray-400 hover:text-rose-400 hover:bg-rose-500/5 border border-transparent hover:border-rose-500/10 transition-all duration-200 group`}
          >
            <LogOut className="h-5 w-5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
            {isSidebarOpen && <span className="text-sm font-semibold tracking-wide">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* --- MOBILE SIDEBAR DRAWER OVERLAY --- */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <aside 
            className="w-64 h-full bg-[#0B0F17] flex flex-col border-r border-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-16 flex items-center justify-between px-6 border-b border-gray-900">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center">
                  <Shield className="h-4.5 w-4.5 text-white" />
                </div>
                <span className="font-bold text-base text-white">Ceylon Calling</span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
              {menuItems.map((item) => {
                const ActiveIcon = item.icon;
                const itemActive = isActive(item.path);
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 ${
                      itemActive 
                        ? "bg-gradient-to-r from-blue-600/15 to-indigo-600/10 text-blue-400 border border-blue-500/20" 
                        : "text-gray-400 hover:text-white hover:bg-gray-900/50 border border-transparent"
                    }`}
                  >
                    <ActiveIcon className="h-5 w-5 shrink-0" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-gray-900">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 py-3 px-4 w-full rounded-xl text-gray-400 hover:text-rose-400 hover:bg-rose-500/5 transition-all duration-200"
              >
                <LogOut className="h-5 w-5 shrink-0" />
                <span className="text-sm font-semibold">Sign Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* --- MAIN PAGE WRAPPER --- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* TOP NAVBAR HEADER */}
        <header className="h-16 border-b border-gray-900 bg-[#080B11]/80 backdrop-blur-md flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-900"
            >
              <Menu className="h-6 w-6" />
            </button>

            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden md:block text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-gray-900/50"
            >
              <Menu className="h-5 w-5" />
            </button>

            <h1 className="text-lg font-bold text-white tracking-wide">
              {getCurrentPageName()}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Search Box Trigger Mock */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-900/60 border border-gray-800 text-gray-500 w-48 focus-within:w-60 transition-all duration-300">
              <span className="text-xs text-gray-500">Search...</span>
            </div>

            {/* Notification Bell Panel */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotificationOpen(!isNotificationOpen);
                  setIsAdminDropdownOpen(false);
                }}
                className={`p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-900/50 transition-all relative ${
                  isNotificationOpen ? "bg-gray-900/80 text-white" : ""
                }`}
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-500 ring-2 ring-[#080B11]" />
              </button>

              {/* Notification Overlay Menu */}
              {isNotificationOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsNotificationOpen(false)} />
                  <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-gray-800 bg-[#0B0F17] p-4 shadow-xl ring-1 ring-black/5 z-20 animate-scaleIn">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-900">
                      <span className="text-xs font-semibold uppercase text-gray-400 tracking-wider">System Alerts</span>
                      <span className="text-[10px] text-blue-400 cursor-pointer hover:underline">Mark all read</span>
                    </div>
                    <div className="mt-3 space-y-2 max-h-60 overflow-y-auto scrollbar-hide">
                      {notifications.map((log) => (
                        <div key={log.id} className="flex gap-2.5 p-2 rounded-lg hover:bg-gray-900/50 transition-colors">
                          <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs text-gray-200 font-medium">{log.text}</p>
                            <span className="text-[9px] text-gray-500 mt-0.5 block">
                              {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-gray-900 text-center">
                      <Link 
                        to="/admin" 
                        onClick={() => setIsNotificationOpen(false)}
                        className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
                      >
                        View all activity logs <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsAdminDropdownOpen(!isAdminDropdownOpen);
                  setIsNotificationOpen(false);
                }}
                className="flex items-center gap-2 focus:outline-none"
              >
                <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
                  A
                </div>
              </button>

              {isAdminDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsAdminDropdownOpen(false)} />
                  <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-gray-800 bg-[#0B0F17] p-2 shadow-xl ring-1 ring-black/5 z-20 animate-scaleIn">
                    <div className="px-3 py-2 border-b border-gray-900">
                      <p className="text-xs font-semibold text-gray-400">Logged in as</p>
                      <p className="text-xs text-white truncate font-medium mt-0.5">admin@ceyloncalling.com</p>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/admin/settings"
                        onClick={() => setIsAdminDropdownOpen(false)}
                        className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-gray-900 rounded-lg transition-colors"
                      >
                        <Settings className="h-4 w-4 text-gray-500" />
                        Admin Settings
                      </Link>
                      <button
                        onClick={() => {
                          setIsAdminDropdownOpen(false);
                          handleLogout();
                        }}
                        className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 rounded-lg transition-colors text-left"
                      >
                        <LogOut className="h-4 w-4 text-rose-500/70" />
                        Log Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>
        </header>

        {/* LAYOUT CONTENT OUTLET */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;

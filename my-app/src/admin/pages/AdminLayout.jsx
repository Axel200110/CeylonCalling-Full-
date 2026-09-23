import {
    Bell,
    FileText,
    LayoutDashboard,
    LogOut,
    MapPin,
    Menu,
    MessageCircle,
    MessageSquare,
    Settings,
    Shield,
    ShoppingBag, Users,
    X
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAdminStore } from "../store/adminStore";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { logs, logout, adminUser } = useAdminStore();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Successfully logged out");
      navigate("/admin/login");
    } catch (err) {
      console.error("Backend logout failed:", err);
      toast.error("Logout error");
    }
  };

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Shops & Merchants", path: "/admin/shops", icon: ShoppingBag },
    { name: "Reviews Moderation", path: "/admin/reviews", icon: MessageCircle },
    { name: "Private Messages", path: "/admin/messages", icon: MessageSquare },
    { name: "Users Directory", path: "/admin/users", icon: Users },
    { name: "Listings Directory", path: "/admin/listings", icon: MapPin },
    { name: "Audit Logs", path: "/admin/audit-logs", icon: FileText },
    { name: "Global Settings & Backups", path: "/admin/settings", icon: Settings },
  ];

  const isActive = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  const getCurrentPageName = () => {
    const matched = menuItems.find((item) => isActive(item.path));
    return matched ? matched.name : "Admin Governance";
  };

  const notifications = logs.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#080B11] text-gray-100 flex font-sans">
      
      {/* --- DESKTOP SIDEBAR --- */}
      <aside 
        className={`hidden md:flex flex-col border-r border-gray-900 bg-[#0B0F17] transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-20"
        } shrink-0`}
      >
        <div className="h-16 flex items-center gap-3 px-6 border-b border-gray-900 overflow-hidden">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
            <Shield className="h-5 w-5 text-white" />
          </div>
          {isSidebarOpen && (
            <div className="truncate">
              <span className="font-bold text-base tracking-tight text-white block">
                Ceylon Calling
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
                Admin Console
              </span>
            </div>
          )}
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto scrollbar-hide">
          {menuItems.map((item) => {
            const ActiveIcon = item.icon;
            const itemActive = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                  itemActive
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "text-gray-400 hover:text-white hover:bg-gray-900/60"
                }`}
              >
                <ActiveIcon
                  className={`h-5 w-5 shrink-0 transition-colors ${
                    itemActive ? "text-emerald-400" : "text-gray-400 group-hover:text-white"
                  }`}
                />
                {isSidebarOpen && <span className="truncate">{item.name}</span>}
                {!isSidebarOpen && (
                  <div className="absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-xs rounded-md shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-900">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all border border-transparent hover:border-rose-500/20"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {isSidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* --- MOBILE DRAWER --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsMobileMenuOpen(false)} 
          />
          <aside className="relative flex flex-col w-72 max-w-[80%] bg-[#0B0F17] border-r border-gray-900 z-10">
            <div className="h-16 flex items-center justify-between px-6 border-b border-gray-900">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-base text-white">Ceylon Calling</span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
              {menuItems.map((item) => {
                const ActiveIcon = item.icon;
                const itemActive = isActive(item.path);
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                      itemActive
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "text-gray-400 hover:text-white hover:bg-gray-900"
                    }`}
                  >
                    <ActiveIcon className="h-5 w-5 shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-gray-900">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-16 border-b border-gray-900 bg-[#0B0F17]/80 backdrop-blur sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-gray-900"
            >
              <Menu className="h-5 w-5" />
            </button>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden md:flex text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-gray-900"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-sm sm:text-base font-semibold text-white tracking-wide truncate">
              {getCurrentPageName()}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">System Active</span>
            </div>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="text-gray-400 hover:text-white p-2 rounded-xl hover:bg-gray-900 relative"
              >
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-[#0B0F17]" />
                )}
              </button>

              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#0F141F] border border-gray-800 shadow-2xl p-4 z-50">
                  <div className="flex items-center justify-between border-b border-gray-800 pb-2 mb-3">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Recent Activity</span>
                    <Link 
                      to="/admin/audit-logs" 
                      onClick={() => setIsNotificationOpen(false)}
                      className="text-[11px] text-emerald-400 hover:underline"
                    >
                      View All
                    </Link>
                  </div>
                  <div className="space-y-2.5">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-gray-500 py-2 text-center">No recent alerts</p>
                    ) : (
                      notifications.map((n, i) => (
                        <div key={i} className="text-xs text-gray-300 p-2 rounded-lg bg-gray-950/40 border border-gray-900/80">
                          <p className="font-medium text-white line-clamp-1">{n.text}</p>
                          <span className="text-[10px] text-gray-500 block mt-1">
                            {new Date(n.timestamp || Date.now()).toLocaleTimeString()}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Admin Profile Chip */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-gray-800">
              <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                A
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-white leading-none">Admin</p>
                <p className="text-[10px] text-emerald-400 mt-0.5">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

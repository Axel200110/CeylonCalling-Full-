import { motion } from "framer-motion";
import { useState } from "react";
import {
  FaArrowDown,
  FaArrowUp,
  FaBell,
  FaChartLine,
  FaChevronRight,
  FaCog,
  FaExchangeAlt,
  FaSearch,
  FaSignInAlt,
  FaStore,
  FaUserPlus,
  FaUsers,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Quiz from "../../assets/Restaurent.jpg";

// Motion Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

const hoverScale = {
  hover: { scale: 1.02, transition: { duration: 0.2, ease: "easeOut" } },
  tap: { scale: 0.98 },
};

// Reusable Metric Card
const MetricCard = ({ title, value, change, isPositive, icon: Icon }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ y: -3 }}
    className="relative overflow-hidden rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-slate-800/80 p-6 shadow-xl group transition-colors duration-300 hover:border-slate-700/80"
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all duration-500" />
    <div className="flex items-center justify-between mb-4">
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {title}
      </span>
      <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-300">
        <Icon className="text-base" />
      </div>
    </div>
    <div className="flex items-baseline justify-between">
      <h3 className="text-2xl font-bold text-slate-100 tracking-tight">{value}</h3>
      <span
        className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${
          isPositive
            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
            : "bg-rose-500/10 border-rose-500/20 text-rose-400"
        }`}
      >
        {isPositive ? <FaArrowUp className="mr-1 text-[10px]" /> : <FaArrowDown className="mr-1 text-[10px]" />}
        {change}
      </span>
    </div>
  </motion.div>
);

function EnterpriseDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const navItems = [
    { id: "overview", label: "Overview", icon: FaChartLine },
    { id: "shops", label: "Shops & Outlets", icon: FaStore },
    { id: "users", label: "Account Access", icon: FaUsers },
    { id: "settings", label: "System Config", icon: FaCog },
  ];

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-100 font-sans overflow-x-hidden selection:bg-blue-500/30 selection:text-blue-200">
      {/* Background Image Layer with Ambient Glass Darkening */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-20 pointer-events-none scale-105 transform"
        style={{ backgroundImage: `url(${Quiz})` }}
      />
      <div className="fixed inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/90 to-slate-900/80 backdrop-blur-3xl pointer-events-none" />

      {/* Decorative Glow Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Layout Grid */}
      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar Navigation */}
        <aside className="hidden lg:flex flex-col w-72 border-r border-slate-800/60 bg-slate-900/40 backdrop-blur-2xl p-6 justify-between">
          <div>
            {/* Logo / Brand Header */}
            <div className="flex items-center gap-3 px-2 mb-10">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/25 border border-blue-400/30">
                <FaStore className="text-white text-lg" />
              </div>
              <div>
                <h2 className="font-bold text-slate-100 tracking-tight text-base leading-none">
                  Nexus Food SaaS
                </h2>
                <span className="text-[11px] text-slate-400 font-medium tracking-wide">
                  Enterprise Suite v2.4
                </span>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative ${
                      isActive
                        ? "text-white bg-slate-800/80 border border-slate-700/60 shadow-lg shadow-black/20"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
                    }`}
                  >
                    <Icon className={`text-base ${isActive ? "text-blue-400" : "text-slate-400"}`} />
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute right-3 w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa]"
                      />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* User Profile Card */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 border border-slate-500/30 flex items-center justify-center text-xs font-bold text-white">
                AD
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-slate-200 truncate">Admin Console</p>
                <p className="text-[11px] text-slate-400 truncate">system@nexusfood.io</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/login")}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-lg transition-colors"
            >
              Switch Tenant
            </button>
          </div>
        </aside>

        {/* Central Content Canvas */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Header Bar */}
          <header className="sticky top-0 z-30 h-20 border-b border-slate-800/60 bg-slate-950/60 backdrop-blur-xl px-6 lg:px-10 flex items-center justify-between">
            {/* Search Input */}
            <div className="relative w-72 hidden md:block">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <input
                type="text"
                placeholder="Search shops, metrics, transactions..."
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
              />
            </div>

            {/* Quick Actions Header Controls */}
            <div className="flex items-center gap-3 ml-auto">
              <button className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors relative">
                <FaBell className="text-xs" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500" />
              </button>

              <div className="h-4 w-[1px] bg-slate-800 my-auto" />

              <motion.button
                variants={hoverScale}
                whileHover="hover"
                whileTap="tap"
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600/90 hover:bg-blue-600 border border-blue-400/30 shadow-lg shadow-blue-500/20 transition-all"
              >
                <FaSignInAlt /> Shop Login
              </motion.button>

              <motion.button
                variants={hoverScale}
                whileHover="hover"
                whileTap="tap"
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all"
              >
                <FaUserPlus /> Request Access
              </motion.button>
            </div>
          </header>

          {/* Main Dashboard Content */}
          <div className="p-6 lg:p-10 space-y-8 overflow-y-auto">
            {/* Title Section */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">
                  Platform Overview
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  Manage vendor onboarding, cross-chain food sales, and live operations.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start md:self-auto">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-medium text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Sync
                </span>
              </div>
            </motion.div>

            {/* Metrics Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            >
              <MetricCard
                title="Total Food Volume"
                value="$148,920.00"
                change="+14.2%"
                isPositive={true}
                icon={FaExchangeAlt}
              />
              <MetricCard
                title="Active Vendors"
                value="1,248"
                change="+8.1%"
                isPositive={true}
                icon={FaStore}
              />
              <MetricCard
                title="Daily Merchants"
                value="892"
                change="-2.4%"
                isPositive={false}
                icon={FaUsers}
              />
              <MetricCard
                title="Conversion Rate"
                value="4.85%"
                change="+1.1%"
                isPositive={true}
                icon={FaChartLine}
              />
            </motion.div>

            {/* Content Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Activity Glass Panel */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-2 rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-slate-800/80 p-6 lg:p-8 shadow-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-100">Store Onboarding Flow</h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Performance metrics across new restaurant partner requests
                      </p>
                    </div>
                    <button className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1">
                      View Reports <FaChevronRight className="text-[10px]" />
                    </button>
                  </div>

                  {/* Visual Analytics Representation */}
                  <div className="h-56 w-full rounded-2xl bg-slate-950/50 border border-slate-800/60 p-4 flex items-end gap-3 justify-between">
                    {[45, 65, 35, 85, 55, 95, 70, 80, 100, 60, 75, 90].map((height, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                        <div
                          style={{ height: `${height}%` }}
                          className="w-full rounded-lg bg-gradient-to-t from-blue-600/40 to-blue-500/80 group-hover:from-blue-500 group-hover:to-indigo-400 transition-all duration-300 relative"
                        >
                          <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-[10px] text-slate-200 px-2 py-0.5 rounded border border-slate-700 pointer-events-none transition-opacity">
                            {height}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-6 mt-6 border-t border-slate-800/60">
                  <div>
                    <span className="text-[11px] text-slate-400 font-medium">Avg Order Time</span>
                    <p className="text-base font-bold text-slate-200 mt-0.5">18.4 mins</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 font-medium">Platform Uptime</span>
                    <p className="text-base font-bold text-slate-200 mt-0.5">99.98%</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 font-medium">Active Requests</span>
                    <p className="text-base font-bold text-blue-400 mt-0.5">24 Pending</p>
                  </div>
                </div>
              </motion.div>

              {/* Side Status Glass Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-slate-800/80 p-6 lg:p-8 shadow-2xl flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-bold text-slate-100 mb-1">Recent Onboardings</h3>
                  <p className="text-xs text-slate-400 mb-6">Latest registered food outlets</p>

                  <div className="space-y-4">
                    {[
                      { name: "Urban Bistro Kitchen", category: "Gourmet / Italian", status: "Active", time: "2m ago" },
                      { name: "Saffron Spice Hub", category: "Asian Fusion", status: "Pending", time: "14m ago" },
                      { name: "Green Leaf Cafe", category: "Organic Bakery", status: "Active", time: "1h ago" },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800/50 hover:border-slate-700/60 transition-colors"
                      >
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-slate-200 truncate">{item.name}</p>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">{item.category}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span
                            className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              item.status === "Active"
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                            }`}
                          >
                            {item.status}
                          </span>
                          <p className="text-[10px] text-slate-500 mt-1">{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => navigate("/login")}
                  className="w-full mt-6 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-xs font-semibold text-slate-200 transition-all flex items-center justify-center gap-2"
                >
                  Manage All Vendors <FaChevronRight className="text-[10px]" />
                </button>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default EnterpriseDashboard;
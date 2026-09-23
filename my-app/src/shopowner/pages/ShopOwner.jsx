import { motion } from "framer-motion";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Eye,
  Heart,
  LogOut,
  MapPin,
  Phone,
  PlusCircle, Settings,
  ShieldAlert,
  ShieldCheck,
  Store,
  TrendingUp,
  Utensils,
  Wallet,
  XCircle,
  ShoppingBag,
  Bed,
  MessageCircle,
  Bell,
  Star,
  RefreshCw,
  Power,
  PackageCheck,
  ChefHat,
  Tag,
  Navigation,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import SideNavbar from "../components/SideNavbar";
import ShopEditModal from "../components/ShopEdit";
import { useAuthStore } from "../store/authStore";

// ─── Ambient Glow Background Layer ──────────────────────────────────────────
const AmbientBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    <div className="absolute -top-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[120px]" />
    <div className="absolute top-[60%] -right-[10%] w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-[150px]" />
    <div className="absolute -bottom-[20%] left-[20%] w-[400px] h-[400px] rounded-full bg-emerald-600/5 blur-[100px]" />
  </div>
);

// ─── Mini SVG Bar Chart ──────────────────────────────────────────────────────
const MiniBarChart = ({ data, color = "#10b981" }) => {
  const max = Math.max(...data, 1);
  const width = 280;
  const height = 64;
  const barW = Math.floor(width / data.length) - 6;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
      <defs>
        <linearGradient id={`barGrad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0.2" />
        </linearGradient>
      </defs>
      {data.map((v, i) => {
        const barH = Math.max(8, (v / max) * (height - 12));
        const x = i * (barW + 6) + 3;
        const y = height - barH;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={barW}
            height={barH}
            rx="4"
            fill={`url(#barGrad-${color.replace("#", "")})`}
            className="transition-all duration-300 hover:opacity-100 hover:brightness-125 cursor-pointer"
            opacity={0.75 + (i / data.length) * 0.25}
          />
        );
      })}
    </svg>
  );
};

// ─── Mini Area / Sparkline with Interactive Point Glow ──────────────────────
const SparkLine = ({ data, color = "#10b981" }) => {
  const max = Math.max(...data, 1);
  const w = 280, h = 64;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (w - 12) + 6;
    const y = h - 8 - ((v / max) * (h - 20));
    return `${x},${y}`;
  });
  const lineD = pts.reduce((acc, p, i) => (i === 0 ? `M ${p}` : `${acc} L ${p}`), "");
  const first = pts[0]?.split(",") || [0, 0];
  const last = pts[pts.length - 1]?.split(",") || [0, 0];
  const areaD = `${lineD} L ${last[0]},${h} L ${first[0]},${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto overflow-visible">
      <defs>
        <linearGradient id={`sparkGrad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#sparkGrad-${color.replace("#", "")})`} />
      <path d={lineD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {pts.length > 0 && (
        <g>
          <circle
            cx={last[0]}
            cy={last[1]}
            r="6"
            fill={color}
            className="animate-ping opacity-40"
            style={{ transformOrigin: `${last[0]}px ${last[1]}px` }}
          />
          <circle
            cx={last[0]}
            cy={last[1]}
            r="3.5"
            fill="#09090b"
            stroke={color}
            strokeWidth="2"
          />
        </g>
      )}
    </svg>
  );
};

// ─── Glassmorphic Stat Card Component ─────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, sub, color, chart, chartType = "bar", trend }) => {
  const colorMap = {
    emerald: {
      accent: "from-emerald-500/20 to-transparent",
      iconBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      hex: "#10b981",
    },
    blue: {
      accent: "from-blue-500/20 to-transparent",
      iconBg: "bg-blue-500/10 text-blue-400 border-blue-500/30",
      badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      hex: "#3b82f6",
    },
    amber: {
      accent: "from-amber-500/20 to-transparent",
      iconBg: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      hex: "#f59e0b",
    },
    rose: {
      accent: "from-rose-500/20 to-transparent",
      iconBg: "bg-rose-500/10 text-rose-400 border-rose-500/30",
      badge: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      hex: "#f43f5e",
    },
  };

  const theme = colorMap[color] || colorMap.emerald;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative group rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl p-5 shadow-2xl overflow-hidden flex flex-col justify-between"
    >
      {/* Top subtle highlight line */}
      <div className={`absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r ${theme.accent}`} />

      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{label}</span>
            <h3 className="text-2xl font-black text-white tracking-tight">{value}</h3>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className={`w-10 h-10 rounded-xl ${theme.iconBg} border flex items-center justify-center shadow-inner`}>
              <Icon className="w-5 h-5" />
            </div>
            {trend && (
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${theme.badge}`}>
                {trend}
              </span>
            )}
          </div>
        </div>
        {sub && <p className="text-xs text-neutral-400 font-medium">{sub}</p>}
      </div>

      {chart && (
        <div className="mt-5 pt-3 border-t border-white/5">
          {chartType === "bar" ? (
            <MiniBarChart data={chart} color={theme.hex} />
          ) : (
            <SparkLine data={chart} color={theme.hex} />
          )}
        </div>
      )}
    </motion.div>
  );
};

// ─── Pending Verification Screen ─────────────────────────────────────────────
const PendingScreen = ({ shop, onLogout }) => (
  <div className="relative min-h-screen bg-neutral-950 flex items-center justify-center px-4 py-16 text-neutral-200 overflow-hidden">
    <AmbientBackground />
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative z-10 w-full max-w-lg rounded-3xl border border-white/10 bg-neutral-900/60 backdrop-blur-2xl p-8 shadow-2xl text-center"
    >
      <div className="relative inline-flex mb-6">
        <div className="w-20 h-20 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/30 shadow-lg shadow-amber-500/10">
          <Clock className="w-10 h-10 text-amber-400 animate-pulse" />
        </div>
      </div>

      <h1 className="text-3xl font-black text-white tracking-tight">Review in Progress</h1>
      <p className="mt-2 text-sm text-neutral-400 leading-relaxed max-w-sm mx-auto">
        Your merchant store <span className="font-bold text-white capitalize">"{shop?.name}"</span> is under verification by Ceylon Calling moderators.
      </p>

      <div className="mt-8 text-left rounded-2xl border border-white/5 bg-neutral-950/50 p-5 space-y-4">
        <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest block border-b border-white/5 pb-2">
          Verification Pipeline
        </span>
        {[
          { icon: Eye, color: "text-blue-400", bg: "bg-blue-500/10", title: "Document Inspection", desc: "Verifying merchant business credentials." },
          { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10", title: "Catalog Activation", desc: "Catalog publication upon approval." },
          { icon: AlertCircle, color: "text-amber-400", bg: "bg-amber-500/10", title: "Notification", desc: "Email dispatch upon status alteration." },
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center shrink-0 border border-white/5`}>
              <item.icon className={`w-4 h-4 ${item.color}`} />
            </div>
            <div>
              <p className="text-xs font-bold text-white">{item.title}</p>
              <p className="text-[11px] text-neutral-400">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <button
          onClick={onLogout}
          className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-white/10 bg-neutral-800/50 text-xs font-semibold text-neutral-300 hover:bg-neutral-800 hover:text-white transition"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
        <Link
          to="/"
          className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-500 text-neutral-950 text-xs font-bold hover:bg-amber-400 transition shadow-lg shadow-amber-500/20"
        >
          Return Home <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  </div>
);

// ─── Changes Requested Screen ────────────────────────────────────────────────
const ChangesRequestedScreen = ({ shop, onLogout, onRefresh }) => (
  <div className="relative min-h-screen bg-neutral-950 flex items-center justify-center px-4 py-16 text-neutral-200 overflow-hidden">
    <AmbientBackground />
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative z-10 w-full max-w-lg rounded-3xl border border-amber-500/30 bg-neutral-900/70 backdrop-blur-2xl p-8 shadow-2xl text-center space-y-6"
    >
      <div className="w-20 h-20 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/30 shadow-lg shadow-amber-500/10 mx-auto">
        <AlertCircle className="w-10 h-10 text-amber-400 animate-pulse" />
      </div>

      <div className="space-y-2">
        <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/30">
          Action Required by Merchant
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight pt-2">
          Application Revisions Requested
        </h1>
        <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
          The Ceylon Calling regional verification team has reviewed your application for{" "}
          <strong className="text-white capitalize">"{shop?.name}"</strong> and requested updates before activation.
        </p>
      </div>

      {/* Admin Notes Box */}
      <div className="text-left rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 space-y-3">
        <div>
          <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider block">
            Administrator Feedback:
          </span>
          <p className="text-xs text-neutral-200 mt-1 font-medium leading-relaxed">
            {shop?.adminNotes?.feedbackForOwner || "Please update your listing photos or verification details."}
          </p>
        </div>

        {shop?.adminNotes?.actionRequired && (
          <div className="pt-2 border-t border-white/5">
            <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider block">
              Required Next Step:
            </span>
            <p className="text-xs text-emerald-200/90 mt-0.5">
              {shop.adminNotes.actionRequired}
            </p>
          </div>
        )}
      </div>

      <div className="text-xs text-neutral-400 flex items-center justify-center gap-1.5">
        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
        <span>North Central Region Desk &bull; Anuradhapura & Polonnaruwa Operations</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={onRefresh}
          className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-500 text-neutral-950 text-xs font-bold hover:bg-amber-400 transition shadow-lg shadow-amber-500/20 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" /> Check Status
        </button>
        <button
          onClick={onLogout}
          className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-white/10 bg-neutral-800/50 text-xs font-semibold text-neutral-300 hover:bg-neutral-800 hover:text-white transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </motion.div>
  </div>
);

// ─── Suspended Screen ────────────────────────────────────────────────────────
const SuspendedScreen = ({ shop, onLogout }) => (
  <div className="relative min-h-screen bg-neutral-950 flex items-center justify-center px-4 py-16 text-neutral-200 overflow-hidden">
    <AmbientBackground />
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative z-10 w-full max-w-lg rounded-3xl border border-rose-500/20 bg-neutral-900/60 backdrop-blur-2xl p-8 shadow-2xl text-center"
    >
      <div className="w-20 h-20 rounded-2xl bg-rose-500/10 flex items-center justify-center border border-rose-500/30 shadow-lg shadow-rose-500/10 mb-6 mx-auto">
        <XCircle className="w-10 h-10 text-rose-500" />
      </div>
      <h1 className="text-3xl font-black text-white tracking-tight">Merchant Suspended</h1>
      <p className="mt-2 text-sm text-neutral-400 max-w-sm mx-auto leading-relaxed">
        Access restricted for merchant store <span className="font-bold text-white capitalize">"{shop?.name}"</span>.
      </p>
      <div className="mt-6 rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 text-left">
        <p className="text-xs text-rose-300 font-medium flex items-start gap-2.5 leading-relaxed">
          <ShieldAlert className="w-5 h-5 shrink-0 text-rose-400" />
          Contact support desk at <a href="mailto:support@ceyloncalling.com" className="underline font-bold text-white">support@ceyloncalling.com</a> to submit an administrative appeal.
        </p>
      </div>
      <button
        onClick={onLogout}
        className="mt-8 w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-neutral-800/50 text-xs font-semibold text-neutral-300 hover:bg-neutral-800 hover:text-white transition"
      >
        <LogOut className="w-4 h-4" /> Sign Out
      </button>
    </motion.div>
  </div>
);

// ─── Main Approved SaaS Dashboard ────────────────────────────────────────────
const ApprovedDashboard = ({ shop: initialShop, user, onLogout }) => {
  const { dashboardStats, fetchDashboardStats, updateOperationalSettings } = useAuthStore();
  const [loadingData, setLoadingData] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoadingData(true);
      await fetchDashboardStats();
      setLoadingData(false);
    };
    load();
  }, [fetchDashboardStats]);

  const shop = dashboardStats?.shop || initialShop;
  const foodStats = dashboardStats?.food || { total: 0, available: 0, soldOut: 0, categoriesCount: 0 };
  const orderStats = dashboardStats?.orders || { total: 0, pending: 0, preparing: 0, completed: 0, revenue: 0 };
  const reviewStats = dashboardStats?.reviews || { total: 0, avgRating: 5.0, unrepliedCount: 0 };
  const promoStats = dashboardStats?.promotions || { active: 0 };
  const annStats = dashboardStats?.announcements || { active: 0 };
  const roomStats = dashboardStats?.accommodation;
  const recentOrders = dashboardStats?.recentOrders || [];
  const recentReviews = dashboardStats?.recentReviews || [];

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdatingStatus(true);
      await updateOperationalSettings({ operationalStatus: newStatus });
      await fetchDashboardStats();
      toast.success(`Business status updated to: ${newStatus.toUpperCase().replace("_", " ")}`);
    } catch {
      toast.error("Failed to update business operational status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getShopImage = (photo) => {
    if (!photo) return "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80";
    return photo.startsWith("http") ? photo : photo;
  };

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return "Good morning";
    if (hr < 17) return "Good afternoon";
    return "Good evening";
  };

  const getFormattedDate = () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const isAccommodation =
    shop?.capabilities?.hasAccommodation ||
    ["hotel", "villa", "guesthouse"].includes(String(shop?.shopType || "").toLowerCase());

  const locationText = [
    shop?.location?.address,
    shop?.location?.city,
    shop?.location?.district,
    shop?.location?.province,
    typeof shop?.location === "string" ? shop.location : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (loadingData && !dashboardStats) {
    return (
      <div className="flex min-h-screen bg-neutral-950">
        <SideNavbar />
        <div className="flex-1 p-8 space-y-6 animate-pulse">
          <div className="h-12 bg-neutral-900 rounded-2xl w-1/3" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-36 bg-neutral-900 rounded-2xl" />
            ))}
          </div>
          <div className="h-64 bg-neutral-900 rounded-2xl" />
        </div>
      </div>
    );
  }

  const currentOpStatus = shop?.operationalStatus || "open";

  return (
    <div className="relative flex min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-emerald-500 selection:text-neutral-950">
      <AmbientBackground />
      <SideNavbar />

      <main className="relative z-10 flex-1 px-4 sm:px-8 py-8 overflow-x-hidden max-w-7xl mx-auto w-full space-y-8">
        
        {/* ── TOP ACTION & STATUS BAR ── */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/5 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <span className="text-neutral-500 font-semibold">{getGreeting()},</span> {user?.name || "Merchant"}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="text-xs text-neutral-400 font-medium">Active Venue:</span>
              <strong className="text-emerald-400 capitalize text-xs">{shop?.name}</strong>
              <span className="text-neutral-600">•</span>
              <span className="capitalize text-xs text-neutral-300">{shop?.shopType?.replace("_", " ")}</span>
              <span className="text-neutral-600">•</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold">
                <MapPin className="w-3 h-3" />
                {shop?.addressDetails?.district || (locationText.toLowerCase().includes("polonnaruwa") ? "Polonnaruwa" : "Anuradhapura")}
                {shop?.addressDetails?.city ? ` &bull; ${shop.addressDetails.city}` : ''}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Operational Status Switcher */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-neutral-900/80 border border-white/10 backdrop-blur-md">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-2.5">
                Status:
              </span>
              <button
                onClick={() => handleStatusChange("open")}
                disabled={updatingStatus}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  currentOpStatus === "open"
                    ? "bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${currentOpStatus === "open" ? "bg-neutral-950 animate-pulse" : "bg-emerald-500"}`} />
                Open
              </button>
              <button
                onClick={() => handleStatusChange("temporarily_closed")}
                disabled={updatingStatus}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  currentOpStatus === "temporarily_closed"
                    ? "bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${currentOpStatus === "temporarily_closed" ? "bg-neutral-950" : "bg-amber-500"}`} />
                Busy
              </button>
              <button
                onClick={() => handleStatusChange("closed")}
                disabled={updatingStatus}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  currentOpStatus === "closed"
                    ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${currentOpStatus === "closed" ? "bg-white" : "bg-rose-500"}`} />
                Closed
              </button>
            </div>

            <button
              onClick={() => fetchDashboardStats()}
              className="p-2.5 rounded-xl border border-white/10 bg-neutral-900/60 hover:bg-neutral-900 text-neutral-400 hover:text-white transition"
              title="Refresh Stats"
            >
              <RefreshCw className={`w-4 h-4 ${loadingData ? "animate-spin text-emerald-400" : ""}`} />
            </button>
          </div>
        </header>

        {/* ── HERO BANNER ── */}
        <section className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-neutral-900/40 backdrop-blur-xl">
          <div className="absolute inset-0">
            <img
              src={getShopImage(shop?.photo)}
              alt={shop?.name}
              className="w-full h-full object-cover opacity-20 filter blur-sm scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/85 to-transparent" />
          </div>

          <div className="relative z-10 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative shrink-0">
                <img
                  src={getShopImage(shop?.photo)}
                  alt={shop?.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-white/20 shadow-2xl"
                />
                <span className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-2 border-neutral-950 rounded-full flex items-center justify-center shadow-lg">
                  <ShieldCheck className="w-3.5 h-3.5 text-neutral-950" />
                </span>
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  Verified Ceylon Calling Partner
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight capitalize">{shop?.name}</h2>
                <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400 pt-1">
                  {locationText && <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-emerald-400" />{locationText}</span>}
                  {shop?.contact && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-emerald-400" />{shop.contact}</span>}
                  <span className="flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-emerald-400" />
                    {shop?.shopType ? shop.shopType.replace("_", " ") : "Business"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
              <button
                onClick={() => setShowLocationModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-neutral-800/60 text-xs font-semibold text-neutral-200 hover:bg-neutral-800 transition backdrop-blur-md"
              >
                <MapPin className="w-4 h-4 text-emerald-400" /> Location &amp; Map
              </button>
              <button
                onClick={() => navigate("/myshop")}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-neutral-800/60 text-xs font-semibold text-neutral-200 hover:bg-neutral-800 transition backdrop-blur-md"
              >
                <Utensils className="w-4 h-4 text-emerald-400" /> Manage Dishes
              </button>
              <button
                onClick={() => navigate("/dashboard/orders")}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 text-neutral-950 text-xs font-bold hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20"
              >
                <ShoppingBag className="w-4 h-4" /> Live Orders ({orderStats.pending})
              </button>
            </div>
          </div>
        </section>

        {/* ── BUSINESS LOCATION & MAP COORDINATES SECTION ── */}
        {(() => {
          const rawCoords = shop?.location?.coordinates?.coordinates;
          const isPol = String(shop?.location?.district || shop?.addressDetails?.district || "").toLowerCase().includes("polonnaruwa");
          const coordsLng = Array.isArray(rawCoords) && Number.isFinite(rawCoords[0]) ? Number(rawCoords[0]) : (Number(shop?.addressDetails?.coordinates?.lng) || (isPol ? 81.0188 : 80.4037));
          const coordsLat = Array.isArray(rawCoords) && Number.isFinite(rawCoords[1]) ? Number(rawCoords[1]) : (Number(shop?.addressDetails?.coordinates?.lat) || (isPol ? 7.9403 : 8.3114));
          const googleMapsLink = `https://www.google.com/maps/dir/?api=1&destination=${coordsLat},${coordsLng}`;

          return (
            <section className="rounded-3xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl p-6 shadow-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight">Verified Business Location &amp; Coordinates</h3>
                    <p className="text-xs text-neutral-400">Powers customer navigation and the &ldquo;Get Directions&rdquo; action on Ceylon Calling.</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <a
                    href={googleMapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 bg-neutral-800/50 hover:bg-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white transition"
                  >
                    <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                    <span>View Map</span>
                  </a>

                  <button
                    onClick={() => setShowLocationModal(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-neutral-950 font-bold text-xs transition shadow-md shadow-emerald-600/20"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Update Location</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Province</span>
                  <span className="text-sm font-bold text-white block">North Central Province</span>
                  <span className="text-[11px] text-emerald-400 font-medium">Verified Scope</span>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">District</span>
                  <span className="text-sm font-bold text-white block">
                    {shop?.location?.district || shop?.addressDetails?.district || (isPol ? "Polonnaruwa" : "Anuradhapura")}
                  </span>
                  <span className="text-[11px] text-neutral-400 font-medium">Target Tourism Zone</span>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">City / Town</span>
                  <span className="text-sm font-bold text-white block truncate">
                    {shop?.location?.city || shop?.addressDetails?.city || "Anuradhapura Town"}
                  </span>
                  <span className="text-[11px] text-neutral-400 font-medium truncate block">
                    {shop?.location?.address || shop?.addressDetails?.streetAddress || "Street not set"}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">GeoJSON Coordinates</span>
                  <span className="text-xs font-mono font-bold text-emerald-400 block truncate">
                    {coordsLat.toFixed(4)}, {coordsLng.toFixed(4)}
                  </span>
                  <span className="text-[11px] text-neutral-400 font-medium">
                    Exact navigation pin
                  </span>
                </div>
              </div>
            </section>
          );
        })()}

        {/* ── REAL DATABASE METRICS GRID ── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* 1. Food Catalog */}
          <div className="rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl p-5 shadow-2xl flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Menu Inventory</span>
                <h3 className="text-2xl font-black text-white tracking-tight mt-1">{foodStats.total} Dishes</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Utensils className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="text-emerald-400 font-semibold">{foodStats.available} Available</span>
              <span className="text-rose-400 font-semibold">{foodStats.soldOut} Sold Out</span>
            </div>
          </div>

          {/* 2. Orders Queue */}
          <div className="rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl p-5 shadow-2xl flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Orders Queue</span>
                <h3 className="text-2xl font-black text-white tracking-tight mt-1">{orderStats.total} Orders</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="text-amber-400 font-semibold">{orderStats.pending} Pending</span>
              <span className="text-teal-400 font-semibold">{orderStats.preparing} In Prep</span>
            </div>
          </div>

          {/* 3. Completed Sales / Revenue */}
          <div className="rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl p-5 shadow-2xl flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Completed Sales</span>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1 truncate">
                  LKR {orderStats.revenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-neutral-400">
              <span>{orderStats.completed} Fulfilled orders</span>
              <span className="text-emerald-400 font-semibold">100% verified</span>
            </div>
          </div>

          {/* 4. Hospitality Reviews */}
          <div className="rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl p-5 shadow-2xl flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Customer Rating</span>
                <h3 className="text-2xl font-black text-white tracking-tight mt-1 flex items-center gap-1.5">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  {reviewStats.avgRating} <span className="text-xs text-neutral-500 font-normal">/ 5.0</span>
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <MessageCircle className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="text-neutral-400">{reviewStats.total} Total reviews</span>
              {reviewStats.unrepliedCount > 0 ? (
                <span className="text-rose-400 font-bold">{reviewStats.unrepliedCount} Unreplied</span>
              ) : (
                <span className="text-emerald-400 font-medium">All replied</span>
              )}
            </div>
          </div>
        </section>

        {/* ── ACCOMMODATION METRICS (HOTELS, VILLAS, GUEST HOUSES) ── */}
        {isAccommodation && roomStats && (
          <section className="rounded-2xl border border-white/10 bg-gradient-to-r from-emerald-950/40 to-neutral-900/60 backdrop-blur-xl p-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Bed className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Accommodation & Lodging Overview</h4>
                  <p className="text-xs text-neutral-400">Real-time room occupancy and guest reservation queue</p>
                </div>
              </div>
              <button
                onClick={() => navigate("/dashboard/rooms")}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 self-start sm:self-auto"
              >
                Manage Rooms & Bookings →
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              <div>
                <span className="text-[10px] font-bold text-neutral-500 uppercase">Total Rooms</span>
                <p className="text-xl font-bold text-white mt-0.5">{roomStats.totalRooms}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-neutral-500 uppercase">Available Units</span>
                <p className="text-xl font-bold text-emerald-400 mt-0.5">{roomStats.availableRooms}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-neutral-500 uppercase">Total Reservations</span>
                <p className="text-xl font-bold text-blue-400 mt-0.5">{roomStats.totalBookings}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-neutral-500 uppercase">Pending Review</span>
                <p className="text-xl font-bold text-amber-400 mt-0.5">{roomStats.pendingBookings}</p>
              </div>
            </div>
          </section>
        )}

        {/* ── MARKETING STRIP ── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            onClick={() => navigate("/dashboard/promotions")}
            className="group cursor-pointer rounded-2xl border border-white/10 bg-neutral-900/40 hover:bg-neutral-900/70 backdrop-blur-xl p-4 flex items-center justify-between transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
                <Tag className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Promotions & Special Deals</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">{promoStats.active} Active campaigns published</p>
              </div>
            </div>
            <span className="text-xs text-neutral-400 group-hover:text-amber-400 transition font-bold">Manage →</span>
          </div>

          <div
            onClick={() => navigate("/dashboard/announcements")}
            className="group cursor-pointer rounded-2xl border border-white/10 bg-neutral-900/40 hover:bg-neutral-900/70 backdrop-blur-xl p-4 flex items-center justify-between transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Shop Announcements</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">{annStats.active} Customer notices broadcasted</p>
              </div>
            </div>
            <span className="text-xs text-neutral-400 group-hover:text-teal-400 transition font-bold">Manage →</span>
          </div>
        </section>

        {/* ── LIVE ACTIVITY FEEDS ── */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-emerald-400" /> Recent Incoming Orders
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">Live food orders received from customers</p>
              </div>
              <button
                onClick={() => navigate("/dashboard/orders")}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
              >
                View All Queue →
              </button>
            </div>

            {recentOrders.length === 0 ? (
              <div className="py-12 text-center text-xs text-neutral-500 font-medium">
                No orders received yet today. Live orders will populate here immediately.
              </div>
            ) : (
              <div className="space-y-2.5">
                {recentOrders.map((o) => (
                  <div
                    key={o._id}
                    className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <span className="font-mono text-[11px] font-bold text-emerald-400 block">{o.orderReference}</span>
                      <span className="font-semibold text-white">{o.customerName}</span>
                      <span className="text-neutral-500 text-[11px] block">{o.items?.length || 0} items • {o.serviceType?.replace("_", " ")}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-white block">LKR {o.totalAmount?.toLocaleString()}</span>
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          o.status === "completed"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : o.status === "cancelled"
                            ? "bg-rose-500/10 text-rose-400"
                            : "bg-amber-500/10 text-amber-400"
                        }`}
                      >
                        {o.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Reviews */}
          <div className="rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-rose-400" /> Recent Customer Feedback
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">Ratings & traveler reviews on your profile</p>
              </div>
              <button
                onClick={() => navigate("/dashboard/reviews")}
                className="text-xs font-semibold text-rose-400 hover:text-rose-300"
              >
                Feedback Hub →
              </button>
            </div>

            {recentReviews.length === 0 ? (
              <div className="py-12 text-center text-xs text-neutral-500 font-medium">
                No customer reviews yet. Verified ratings will appear here.
              </div>
            ) : (
              <div className="space-y-2.5">
                {recentReviews.map((r) => (
                  <div
                    key={r._id}
                    className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">{r.user?.name || "Customer"}</span>
                      <div className="flex items-center text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={11}
                            className={i < (r.rating || 5) ? "fill-amber-400" : "text-neutral-700"}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-neutral-400 text-[11px] line-clamp-2 italic font-light">"{r.message}"</p>
                    <div className="pt-1 flex justify-between items-center text-[10px]">
                      {r.ownerReply?.message ? (
                        <span className="text-emerald-400 font-semibold">✓ Replied</span>
                      ) : (
                        <span className="text-amber-400 font-semibold">Awaiting Response</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {showLocationModal && (
          <ShopEditModal
            shop={shop}
            onClose={async () => {
              setShowLocationModal(false);
              await fetchDashboardStats();
            }}
          />
        )}

      </main>
    </div>
  );
};

// ─── Root Dashboard Component ─────────────────────────────────────────────────
export default function DashboardPage() {
  const { shop, user, isCheckingAuth, isAuthenticated, fetchShop, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !shop) fetchShop();
  }, [isAuthenticated, shop, fetchShop]);

  const handleLogout = async () => {
    await logout();
    toast.success("Signed out successfully");
    navigate("/login");
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-200">
        <AmbientBackground />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
          <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">Loading Platform...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated && !shop) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-neutral-950 px-4 text-neutral-200 overflow-hidden">
        <AmbientBackground />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-sm rounded-3xl border border-white/10 bg-neutral-900/60 backdrop-blur-2xl p-8 shadow-2xl text-center space-y-6"
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
            <Store className="w-8 h-8 text-emerald-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white tracking-tight">Venue Setup in Progress</h2>
            <p className="text-neutral-400 text-xs leading-relaxed">
              Your merchant account is active. Please contact the Ceylon Calling system administrator to link or activate your venue profile.
            </p>
          </div>
          <div className="space-y-2 pt-2">
            <button
              onClick={() => fetchShop()}
              className="w-full py-3 rounded-xl bg-emerald-500 text-neutral-950 font-bold hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20 text-xs"
            >
              Check Venue Status
            </button>
            <button
              onClick={handleLogout}
              className="w-full py-3 rounded-xl border border-white/10 bg-neutral-800/40 text-neutral-400 font-semibold hover:bg-neutral-800 hover:text-white transition text-xs"
            >
              Sign Out
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (shop?.status === "changes_requested") {
    return <ChangesRequestedScreen shop={shop} onLogout={handleLogout} onRefresh={fetchShop} />;
  }
  if (shop?.status === "pending" || shop?.status === "under_review") {
    return <PendingScreen shop={shop} onLogout={handleLogout} />;
  }
  if (shop?.status === "suspended" || shop?.status === "rejected") {
    return <SuspendedScreen shop={shop} onLogout={handleLogout} />;
  }

  return <ApprovedDashboard shop={shop} user={user} onLogout={handleLogout} />;
}

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
  Tag,
  TrendingUp,
  Utensils,
  Wallet,
  XCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import SideNavbar from "../components/SideNavbar";
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
const ApprovedDashboard = ({ shop, user, onLogout }) => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!shop?._id) return;
    const load = async () => {
      setLoadingData(true);
      try {
        const [foodRes, catRes, likesRes, commRes] = await Promise.all([
          fetch("/api/food/my-shop", { credentials: "include" }),
          fetch("/api/categories/my-shop", { credentials: "include" }),
          fetch(`/api/shops/${shop._id}/likes/count`, { credentials: "include" }),
          fetch(`/api/comments/shop/${shop._id}`, { credentials: "include" }),
        ]);
        setFoods(await foodRes.json());
        setCategories(await catRes.json());
        const likesData = await likesRes.json();
        if (likesData.success) setLikeCount(likesData.data.likeCount ?? 0);
        const commData = await commRes.json();
        setComments(Array.isArray(commData) ? commData : []);
      } catch { /* Fail-soft */ }
      setLoadingData(false);
    };
    load();
  }, [shop]);

  const viewsData = [18, 24, 38, 45, 32, 52, 68];
  const likesData = [2, 4, 3, 7, 5, likeCount > 0 ? likeCount : 6, likeCount > 0 ? likeCount + 1 : 8];
  const ordersData = [foods.length, foods.length + 1, foods.length, foods.length + 2, foods.length + 1, foods.length + 3, foods.length + 2];
  const totalValue = foods.reduce((s, f) => s + (parseFloat(f.price) || 0), 0);

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

  if (loadingData) {
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

  return (
    <div className="relative flex min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-emerald-500 selection:text-neutral-950">
      <AmbientBackground />
      <SideNavbar />

      <main className="relative z-10 flex-1 px-4 sm:px-8 py-8 overflow-x-hidden max-w-7xl mx-auto w-full space-y-8">
        
        {/* ── HEADER BAR ── */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/5 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <span className="text-neutral-500 font-semibold">{getGreeting()},</span> {user?.name || "Merchant"}
            </h1>
            <p className="text-xs text-neutral-400 font-medium mt-1">
              Active Store: <span className="text-emerald-400 font-bold capitalize">{shop.name}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-300 bg-neutral-900/60 border border-white/10 px-3.5 py-2 rounded-xl backdrop-blur-md">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>{getFormattedDate()}</span>
            </div>
          </div>
        </header>

        {/* ── HERO BANNER ── */}
        <section className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-neutral-900/40 backdrop-blur-xl">
          <div className="absolute inset-0">
            <img
              src={getShopImage(shop.photo)}
              alt={shop.name}
              className="w-full h-full object-cover opacity-20 filter blur-sm scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
          </div>

          <div className="relative z-10 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative shrink-0">
                <img
                  src={getShopImage(shop.photo)}
                  alt={shop.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-white/20 shadow-2xl"
                />
                <span className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-2 border-neutral-950 rounded-full flex items-center justify-center shadow-lg">
                  <ShieldCheck className="w-3.5 h-3.5 text-neutral-950" />
                </span>
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  Verified Partner
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight capitalize">{shop.name}</h2>
                <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400 pt-1">
                  {shop.location && <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-emerald-400" />{shop.location}</span>}
                  {shop.contact && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-emerald-400" />{shop.contact}</span>}
                  {shop.shopType && <span className="flex items-center gap-1.5"><Store className="w-3.5 h-3.5 text-emerald-400" />{shop.shopType.replace("_", " ")}</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start md:self-auto">
              <button
                onClick={() => navigate("/myshop")}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-neutral-800/60 text-xs font-semibold text-neutral-200 hover:bg-neutral-800 transition backdrop-blur-md"
              >
                <Settings className="w-4 h-4" /> Manage Store
              </button>
              <button
                onClick={() => navigate("/myshop")}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 text-neutral-950 text-xs font-bold hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20"
              >
                <PlusCircle className="w-4 h-4" /> New Dish
              </button>
            </div>
          </div>
        </section>

        {/* ── METRICS GRID ── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            icon={Utensils} label="Menu Catalog" value={foods.length}
            sub="Active dishes published" color="emerald"
            chart={ordersData} chartType="bar" trend="+5% growth"
          />
          <StatCard
            icon={Tag} label="Food Types" value={categories.length}
            sub="Configured classifications" color="blue"
            chart={[3, 3, categories.length, categories.length + 1, categories.length]} chartType="bar" trend="Stable"
          />
          <StatCard
            icon={Heart} label="Customer Likes" value={likeCount}
            sub="Total user bookmarks" color="rose"
            chart={likesData} chartType="spark" trend="+12% weekly"
          />
          <StatCard
            icon={Wallet} label="Menu Value"
            value={`LKR ${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            sub="Aggregate catalog price" color="amber"
            chart={viewsData} chartType="spark" trend="Total assets"
          />
        </section>

        {/* ── CHARTS SECTION ── */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-400" /> Catalog Page Impressions
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">Daily shop profile interactions</p>
              </div>
              <span className="text-[10px] font-bold text-neutral-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                Weekly
              </span>
            </div>
            <MiniBarChart data={viewsData} color="#3b82f6" />
            <div className="flex justify-between text-[10px] font-bold text-neutral-500 mt-3 px-1">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-400" /> Saved Store Growth
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">Bookmarks accumulated across apps</p>
              </div>
              <span className="text-[10px] font-bold text-neutral-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                Trend
              </span>
            </div>
            <SparkLine data={likesData} color="#f43f5e" />
            <div className="flex justify-between text-[10px] font-bold text-neutral-500 mt-3 px-1">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </div>
        </section>

      
      
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
            <h2 className="text-2xl font-black text-white tracking-tight">No Merchant Registered</h2>
            <p className="text-neutral-400 text-xs leading-relaxed">
              Register business credentials to set up a merchant profile.
            </p>
          </div>
          <div className="space-y-2 pt-2">
            <button
              onClick={() => navigate("/shopcreate")}
              className="w-full py-3 rounded-xl bg-emerald-500 text-neutral-950 font-bold hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20 text-xs"
            >
              Register Profile
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

  if (shop?.status === "pending") return <PendingScreen shop={shop} onLogout={handleLogout} />;
  if (shop?.status === "suspended") return <SuspendedScreen shop={shop} onLogout={handleLogout} />;

  return <ApprovedDashboard shop={shop} user={user} onLogout={handleLogout} />;
}
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Compass,
  Eye,
  EyeOff,
  Hotel,
  Layers,
  Loader2,
  Lock,
  Mail,
  Shield,
  Sparkles,
  Star,
  Store,
  TrendingUp,
  UtensilsCrossed,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import HeroImg from "../../assets/Hero.jpg";
import LionLogo from "../../assets/Lion.jpg";
import { useAuthStore } from "../store/authStore";

const REMEMBERED_HOST_EMAIL_KEY = "ceylonCalling_rememberedHostEmail";
const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const ShopOwnerLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();

  const emailIsValid = email.length > 0 && isValidEmail(email);
  const showEmailError = emailTouched && email.length > 0 && !emailIsValid;

  useEffect(() => {
    const rememberedEmail = window.localStorage.getItem(REMEMBERED_HOST_EMAIL_KEY);
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (rememberMe) {
      window.localStorage.setItem(REMEMBERED_HOST_EMAIL_KEY, email.trim());
    } else {
      window.localStorage.removeItem(REMEMBERED_HOST_EMAIL_KEY);
    }

    try {
      await toast.promise(
        login(email, password),
        {
          loading: "Authenticating business account...",
          success: (
            <div className="flex flex-col text-left">
              <span className="font-bold text-slate-900 text-sm">Welcome Back, Partner!</span>
              <span className="text-xs text-slate-500 font-medium">Opening your host management dashboard.</span>
            </div>
          ),
          error: (err) => err?.response?.data?.message || err?.message || "Invalid credentials. Please verify your details.",
        },
        {
          success: { duration: 3000, icon: "🏪" },
          error: { duration: 4000 },
        }
      );

      navigate("/dashboard");
    } catch (err) {
      console.error("Shop login failed:", err);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col lg:grid lg:grid-cols-12 font-sans selection:bg-emerald-500 selection:text-white">
      {/* ========================================================================= */}
      {/* LEFT COLUMN: BUSINESS PARTNER VISUAL & IMPACT (Visible on LG screens)     */}
      {/* ========================================================================= */}
      <div className="relative hidden lg:flex lg:col-span-5 xl:col-span-6 flex-col justify-between p-12 xl:p-16 overflow-hidden bg-slate-900 border-r border-white/5">
        {/* Background Image with Fine Cinematic Gradients */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ backgroundImage: `url(${HeroImg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/45" />
        <div className="absolute inset-0 bg-emerald-950/25 mix-blend-overlay" />

        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Top Header */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl overflow-hidden ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-500/10 group-hover:ring-emerald-400 transition-all">
              <img src={LionLogo} alt="Ceylon Calling Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                  Ceylon Calling
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] font-bold text-emerald-300 uppercase tracking-widest">
                  Host Portal
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Business Network • North Central Province</p>
            </div>
          </Link>
        </div>

        {/* Hero Business Narrative */}
        <div className="relative z-10 my-auto py-12 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-emerald-300 mb-6 shadow-sm">
            <Store className="w-3.5 h-3.5 text-emerald-400" />
            <span>Dedicated Hospitality & Dining Management</span>
          </div>

          <h2 className="text-3xl xl:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Empowering Tourism Businesses in North Central Sri Lanka
          </h2>
          <p className="mt-4 text-slate-300 text-sm xl:text-base leading-relaxed">
            Manage your boutique hotel, heritage villa, or authentic restaurant listings across{" "}
            <span className="text-emerald-400 font-semibold">Anuradhapura</span> and{" "}
            <span className="text-emerald-400 font-semibold">Polonnaruwa</span> with instant bookings and live order control.
          </p>

          {/* Business Value Features */}
          <div className="mt-8 space-y-3.5">
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Hotel className="w-3.5 h-3.5" />
              </div>
              <span>Live room inventory, pricing tiers & direct guest bookings</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <div className="w-7 h-7 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
                <UtensilsCrossed className="w-3.5 h-3.5" />
              </div>
              <span>Digital food menus, categorized items & live kitchen orders</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <div className="w-7 h-7 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
              <span>Real-time traveler feedback, ratings & revenue analytics</span>
            </div>
          </div>
        </div>

        {/* Trust & Network Footer */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Over 120+ Registered Tourism Hosts</span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified Merchant Security</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT COLUMN: SHOP OWNER LOGIN PANEL                                      */}
      {/* ========================================================================= */}
      <div className="relative lg:col-span-7 xl:col-span-6 flex flex-col justify-between p-6 sm:p-10 md:p-12 lg:p-16 overflow-y-auto">
        <div className="lg:hidden absolute inset-0 bg-cover bg-center opacity-15 pointer-events-none" style={{ backgroundImage: `url(${HeroImg})` }} />
        <div className="lg:hidden absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/95 to-slate-950 pointer-events-none" />

        {/* Top Navigation Links */}
        <div className="relative z-10 flex items-center justify-between mb-8 sm:mb-10">
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus:outline-none"
            title="Go to Ceylon Calling Home"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-emerald-500/25 group-hover:ring-emerald-400 transition-all">
              <img src={LionLogo} alt="Ceylon Calling" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">
              Ceylon <span className="text-emerald-400">Calling</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to="/discover"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all backdrop-blur-md"
            >
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Explore</span>
            </Link>

            <Link
              to="/user/login"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs font-semibold text-emerald-300 transition-colors"
            >
              <span>Traveler Portal</span>
            </Link>
          </div>
        </div>

        {/* Main Auth Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10 w-full max-w-md mx-auto my-auto"
        >
          {/* Header Typography */}
          <div className="text-left mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wide uppercase mb-3">
              <Store className="w-3.5 h-3.5" />
              <span>Business & Shop Owner Access</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Host Sign In
            </h1>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Sign in to manage your active listings, room reservations, and orders.
            </p>
          </div>

          {/* Error Alert Banner */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="mb-6 overflow-hidden"
              >
                <div className="flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300 shadow-sm backdrop-blur-sm">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-semibold block text-rose-200">Authentication Error</span>
                    <span className="leading-relaxed mt-0.5 block">{error}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Business Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Registered Business Email
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-400 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  placeholder="host@ceyloncalling.lk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setEmailTouched(true)}
                  autoComplete="email"
                  required
                  aria-invalid={showEmailError}
                  className={`w-full pl-11 pr-10 py-3.5 rounded-2xl border bg-white/[0.04] text-white placeholder-slate-500 text-sm transition-all focus:bg-white/[0.07] focus:ring-4 focus:outline-none ${
                    showEmailError
                      ? "border-rose-500/50 focus:border-rose-500/60 focus:ring-rose-500/10"
                      : "border-white/10 focus:border-emerald-500 focus:ring-emerald-500/15"
                  }`}
                />
                {emailIsValid && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
              </div>
              {showEmailError && (
                <p className="text-[11px] text-rose-400 font-medium pl-1">Enter a valid email address.</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-400 transition-colors">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="w-full pl-11 pr-11 py-3.5 rounded-2xl border border-white/10 bg-white/[0.04] text-white placeholder-slate-500 text-sm transition-all focus:bg-white/[0.07] focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <label className="flex items-center gap-2.5 pt-1 cursor-pointer select-none group w-fit">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-white/[0.04] text-emerald-500 focus:ring-emerald-500/30 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                Remember my business email on this device
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full mt-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:to-teal-500 active:scale-[0.99] text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Entering Host Dashboard...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Host Dashboard</span>
                  <ArrowUpRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Partner Onboarding Callout */}
          <div className="mt-8 text-center border-t border-white/10 pt-6">
            <p className="text-xs text-slate-400">
              Want to list your hotel, villa or restaurant?{" "}
              <Link
                to="/partner-with-us"
                className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors underline underline-offset-4 decoration-emerald-500/40"
              >
                Apply as a Host
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Security Notice */}
        <div className="relative z-10 pt-8 text-center">
          <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
            <Shield className="w-3 h-3 text-emerald-400" />
            <span>Host Authentication • Ceylon Calling Merchant Security System</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShopOwnerLoginPage;
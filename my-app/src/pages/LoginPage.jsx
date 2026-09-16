import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, Loader2, Lock, Mail, Sparkles } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import Quiz from "../assets/Restaurent.jpg";
import { useSiteUserAuthStore } from "../store/siteUserAuthStore";
import { useCartStore } from "../store/useCartStore";

const SiteUserLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error } = useSiteUserAuthStore();
  const { consumePendingAuthItem } = useCartStore();

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await toast.promise(
        login(email, password),
        {
          loading: "Verifying credentials securely...",
          success: (
            <div className="flex flex-col text-left">
              <span className="font-bold text-slate-900 text-sm">Welcome Back!</span>
              <span className="text-xs text-slate-400 font-medium">Session initialized successfully.</span>
            </div>
          ),
          error: (err) => err?.message || "Authentication failed. Please check your credentials.",
        },
        {
          success: { duration: 3000, icon: "⚡" },
          error: { duration: 4000 },
        }
      );

      // Check if there is a pending cart item to consume or return destination
      const consumedReturn = consumePendingAuthItem();
      const returnDestination =
        consumedReturn ||
        location.state?.returnTo ||
        searchParams.get("redirect") ||
        "/discover";

      navigate(returnDestination, { replace: true });
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 md:p-8 overflow-hidden bg-slate-950">
      {/* Background layer */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-1000 scale-105 pointer-events-none"
        style={{ backgroundImage: `url(${Quiz})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/80 to-slate-950/40 mix-blend-multiply" />
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[3px]" />

      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/3 translate-x-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 70, damping: 15, mass: 0.8 }}
        className="relative w-full max-w-[460px] rounded-[2rem] border border-white/[0.08] bg-white/[0.03] p-8 sm:p-10 md:p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] backdrop-blur-2xl overflow-hidden"
      >
        <div className="absolute inset-0 rounded-[2rem] border border-t-white/15 border-x-transparent border-b-transparent pointer-events-none" />

        <Link
          to="/discover"
          className="group absolute top-6 left-6 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white"
          title="Back to Discovery"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
        </Link>

        <div className="mt-4 flex flex-col items-center text-center">
          <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md">
            <Sparkles className="text-emerald-400 w-3 h-3" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300">
              Ceylon Calling
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Welcome Back
          </h1>

          <div className="mt-2.5">
            <p className="text-sm font-medium text-slate-300/90 tracking-wide">
              Sign in to manage cart and orders
            </p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="mt-9 space-y-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-3.5 flex items-center justify-center text-slate-400 group-focus-within:text-emerald-400 transition-colors duration-200">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-white/5 bg-white/[0.03] text-white placeholder-slate-500 text-sm transition-all duration-200 focus:bg-white/[0.05] focus:border-emerald-500/40 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Password
              </label>
              <Link
                to="/user/forgot-password"
                className="text-xs font-medium text-slate-400 hover:text-emerald-400 transition-colors duration-150"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative group">
              <div className="absolute left-4 top-3.5 flex items-center justify-center text-slate-400 group-focus-within:text-emerald-400 transition-colors duration-200">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="w-full pl-11 pr-11 py-3.5 rounded-xl border border-white/5 bg-white/[0.03] text-white placeholder-slate-600 text-sm transition-all duration-200 focus:bg-white/[0.05] focus:border-emerald-500/40 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors duration-150"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-xs font-medium text-red-400 antialiased">
                  {error}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.01, y: -0.5 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={isLoading}
            className="relative w-full mt-2 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3.5 text-sm font-semibold tracking-wide text-white shadow-[0_20px_40px_-10px_rgba(16,185,129,0.3)] transition-all duration-300 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing request...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-1.5">
                Sign In
              </span>
            )}
          </motion.button>
        </form>

        <div className="mt-8 text-center border-t border-white/[0.06] pt-6">
          <p className="text-xs font-medium text-slate-400 tracking-wide">
            Don’t have an account?{" "}
            <Link
              to="/user/signup"
              state={location.state}
              className="inline-block ml-1 font-bold text-emerald-400 hover:text-emerald-300 transition-colors duration-150 decoration-emerald-500/30 hover:underline underline-offset-4"
            >
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SiteUserLoginPage;
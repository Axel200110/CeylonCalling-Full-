import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft, Eye, EyeOff, Loader2, Lock, Mail, Sparkles } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Quiz from "../../assets/Restaurent.jpg";
import { useAuthStore } from "../store/authStore";

const ShopOwnerLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success("Welcome back! Loading your dashboard...");
      navigate("/dashboard");
    } catch (err) {
      // error handled by store
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 md:p-8 overflow-hidden bg-slate-950">

      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-1000 scale-105 pointer-events-none"
        style={{ backgroundImage: `url(${Quiz})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/80 to-slate-950/40 mix-blend-multiply" />
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[3px]" />

      {/* Ambient glow orbs */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/3 translate-x-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 70, damping: 15, mass: 0.8 }}
        className="relative w-full max-w-[460px] rounded-[2rem] border border-white/[0.08] bg-white/[0.03] p-8 sm:p-10 md:p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] backdrop-blur-2xl overflow-hidden"
      >
        {/* Top glass border */}
        <div className="absolute inset-0 rounded-[2rem] border border-t-white/15 border-x-transparent border-b-transparent pointer-events-none" />

        {/* Back button */}
        <Link
          to="/shopform"
          className="group absolute top-6 left-6 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white"
          title="Go Back"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
        </Link>

        {/* Brand header */}
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
          <p className="mt-2.5 text-sm font-medium text-slate-300/90 tracking-wide">
            Sign in to manage your active store profile
          </p>
        </div>

        {/* Error message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-sm text-rose-400"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Login form */}
        <form onSubmit={handleLogin} className="mt-9 space-y-5">

          {/* Email */}
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

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
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

          {/* Submit button */}
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
                Authenticating...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-1.5">
                Sign In to Dashboard
              </span>
            )}
          </motion.button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-400">
          New accounts are created by the administrator. Please contact your admin if you need access.
        </p>
      </motion.div>
    </div>
  );
};

export default ShopOwnerLoginPage;
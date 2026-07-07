import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, Loader2, Lock, Mail, Sparkles, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Quiz from "../assets/Restaurent.jpg";
import Input from "../shopowner/components/Input";
import PasswordStrengthMeter from "../shopowner/components/PasswordStrengthMeter";
import { useSiteUserAuthStore } from "../store/siteUserAuthStore";

const SiteUserSignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { signup, error, isLoading } = useSiteUserAuthStore();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      return;
    }

    try {
      await signup(email, password, name);
      navigate("/verify-email1");
      setTimeout(() => window.location.reload(), 100);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 md:p-8 overflow-hidden bg-slate-950">
      
      {/* 1. Cinematic Background Layer with Luxury Scrims */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-1000 scale-105 pointer-events-none"
        style={{ backgroundImage: `url(${Quiz})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/80 to-slate-950/40 mix-blend-multiply" />
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[3px]" />

      {/* 2. Soft Fluid Ambient Backdrop Glow Orbs */}
      <div className="absolute bottom-1/4 left-1/3 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/4 right-1/3 translate-x-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* 3. Primary Registration Card Canvas */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 70, damping: 15, mass: 0.8 }}
        className="relative w-full max-w-[480px] rounded-[2rem] border border-white/[0.08] bg-white/[0.03] p-6 sm:p-10 md:p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] backdrop-blur-2xl overflow-hidden"
      >
        {/* Subtle top internal glass accent border line */}
        <div className="absolute inset-0 rounded-[2rem] border border-t-white/15 border-x-transparent border-b-transparent pointer-events-none" />

        {/* Global Navigation Action - Back Button */}
        <Link
          to="/discover"
          className="group absolute top-6 left-6 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white"
          title="Go Home"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
        </Link>

        {/* Brand Tagline Header Container */}
        <div className="mt-4 flex flex-col items-center text-center">
          <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md">
            <Sparkles className="text-emerald-400 w-3 h-3" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300">
              Ceylon Calling
            </span>
          </div>
          
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Create Account
          </h1>

          <div className="mt-2.5 space-y-0.5">
            <p className="text-sm font-medium text-slate-300/90 tracking-wide">
              Join Ceylon Calling and explore Sri Lanka
            </p>
            <p className="text-xs font-light text-slate-400/80 leading-normal antialiased">
              Ceylon Calling සමඟ එක්වී ශ්‍රී ලංකාව සොයා ගන්න
            </p>
          </div>
        </div>

        {/* Identity Creation Form Segment */}
        <form onSubmit={handleSignUp} className="mt-8 space-y-5">
          
          {/* Name Field Input Wrapper */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Full Name / සම්පූර්ණ නම
            </label>
            <div className="relative group">
              <Input
                icon={User}
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-white/5 bg-white/[0.03] text-white placeholder-slate-500 text-sm transition-all duration-200 focus:bg-white/[0.05] focus:border-emerald-500/40 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none"
              />
            </div>
          </div>

          {/* Email Field Input Wrapper */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Email Address / විද්‍යුත් තැපෑල
            </label>
            <div className="relative group">
              <Input
                icon={Mail}
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

          {/* Password Field Input Wrapper */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Password / මුරපදය
            </label>
            <div className="relative group">
              <Input
                icon={Lock}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
                className="w-full pl-11 pr-11 py-3.5 rounded-xl border border-white/5 bg-white/[0.03] text-white placeholder-slate-600 text-sm transition-all duration-200 focus:bg-white/[0.05] focus:border-emerald-500/40 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors duration-150"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Dynamic Metrics Profiler Block */}
          <div className="pt-1">
            <PasswordStrengthMeter password={password} />
          </div>

          {/* Error Message Animation Banner */}
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

          {/* Action Gateway Submit Trigger */}
          <motion.button
            whileHover={{ scale: 1.01, y: -0.5 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={isLoading}
            className="relative w-full mt-3 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3.5 text-sm font-semibold tracking-wide text-white shadow-[0_20px_40px_-10px_rgba(16,185,129,0.3)] transition-all duration-300 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating your profile...
              </span>
            ) : (
              "Sign Up / ලියාපදිංචි වන්න"
            )}
          </motion.button>
        </form>

        {/* Footer Identity Redirection Wrapper */}
        <div className="mt-8 text-center border-t border-white/[0.06] pt-6">
          <p className="text-xs font-medium text-slate-400 tracking-wide">
            Already have an account? / ගිණුමක් තිබේද?{" "}
            <Link
              to="/user/login"
              className="inline-block ml-1 font-bold text-emerald-400 hover:text-emerald-300 transition-colors duration-150 decoration-emerald-500/30 hover:underline underline-offset-4"
            >
              Login / පිවිසෙන්න
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SiteUserSignUpPage;
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Compass,
  Eye,
  EyeOff,
  Hotel,
  Loader2,
  Lock,
  Mail,
  Shield,
  Sparkles,
  Star,
  User,
  UtensilsCrossed,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HeroImg from "../assets/Hero.jpg";
import LionLogo from "../assets/Lion.jpg";
import PasswordStrengthMeter from "../shopowner/components/PasswordStrengthMeter";
import { useSiteUserAuthStore } from "../store/siteUserAuthStore";

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const SiteUserSignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [nameTouched, setNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

  const navigate = useNavigate();
  const { signup, error, isLoading } = useSiteUserAuthStore();

  const nameIsValid = name.trim().length >= 2;
  const emailIsValid = email.length > 0 && isValidEmail(email);
  const showNameError = nameTouched && name.length > 0 && !nameIsValid;
  const showEmailError = emailTouched && email.length > 0 && !emailIsValid;

  const handleSignUp = async (e) => {
    e.preventDefault();
    setNameTouched(true);
    setEmailTouched(true);

    if (!nameIsValid || !emailIsValid || !password.trim()) {
      return;
    }

    try {
      await signup(email, password, name);
      navigate("/discover");
      setTimeout(() => window.location.reload(), 100);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col lg:grid lg:grid-cols-12 font-sans selection:bg-emerald-500 selection:text-white">
      {/* ========================================================================= */}
      {/* LEFT COLUMN: HERO VISUAL & BRAND EXPERIENCE (Visible on LG screens)       */}
      {/* ========================================================================= */}
      <div className="relative hidden lg:flex lg:col-span-5 xl:col-span-6 flex-col justify-between p-12 xl:p-16 overflow-hidden bg-slate-900 border-r border-white/5">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ backgroundImage: `url(${HeroImg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/40" />
        <div className="absolute inset-0 bg-emerald-950/20 mix-blend-overlay" />

        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <Link to="/discover" className="inline-flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl overflow-hidden ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-500/10 group-hover:ring-emerald-400 transition-all">
              <img src={LionLogo} alt="Ceylon Calling Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                  Ceylon Calling
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] font-bold text-emerald-300 uppercase tracking-widest">
                  Smart Tourism
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">North Central Province • Sri Lanka</p>
            </div>
          </Link>
        </div>

        <div className="relative z-10 my-auto py-12 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-emerald-300 mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Join Our Traveler Community</span>
          </div>

          <h2 className="text-3xl xl:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Begin Your North Central Sri Lanka Adventure
          </h2>
          <p className="mt-4 text-slate-300 text-sm xl:text-base leading-relaxed">
            Create an account to unlock verified boutique accommodations, authentic Sri Lankan dining, and curated regional itineraries.
          </p>

          <div className="mt-8 space-y-3.5">
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Hotel className="w-3.5 h-3.5" />
              </div>
              <span>Exclusive access to local villas & boutique heritage stays</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <div className="w-7 h-7 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
                <UtensilsCrossed className="w-3.5 h-3.5" />
              </div>
              <span>Order authentic meals and beverages for pickup or dine-in</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <div className="w-7 h-7 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <Compass className="w-3.5 h-3.5" />
              </div>
              <span>Direct communication with verified local hosts</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-[11px] text-slate-400">4.9/5 Rating from Explorer Community</p>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Free & Secure</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT COLUMN: REGISTRATION AUTH PANEL                                      */}
      {/* ========================================================================= */}
      <div className="relative lg:col-span-7 xl:col-span-6 flex flex-col justify-between p-6 sm:p-10 md:p-12 lg:p-16 overflow-y-auto">
        <div className="lg:hidden absolute inset-0 bg-cover bg-center opacity-15 pointer-events-none" style={{ backgroundImage: `url(${HeroImg})` }} />
        <div className="lg:hidden absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/95 to-slate-950 pointer-events-none" />

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
              to="/login-shop"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs font-semibold text-emerald-300 transition-colors"
            >
              <span>Host Portal</span>
            </Link>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10 w-full max-w-md mx-auto my-auto"
        >
          <div className="text-left mb-7">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wide uppercase mb-3">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Free Traveler Registration</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Create Account
            </h1>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Sign up in seconds to start exploring North Central Sri Lanka.
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSignUp} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-400 transition-colors">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. Anura Perera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => setNameTouched(true)}
                  autoComplete="name"
                  required
                  aria-invalid={showNameError}
                  className={`w-full pl-11 pr-10 py-3.5 rounded-2xl border bg-white/[0.04] text-white placeholder-slate-500 text-sm transition-all focus:bg-white/[0.07] focus:ring-4 focus:outline-none ${
                    showNameError
                      ? "border-rose-500/50 focus:border-rose-500/60 focus:ring-rose-500/10"
                      : "border-white/10 focus:border-emerald-500 focus:ring-emerald-500/15"
                  }`}
                />
                {nameIsValid && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
              </div>
              {showNameError && (
                <p className="text-[11px] text-rose-400 font-medium pl-1">Enter your full name.</p>
              )}
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-400 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  placeholder="name@example.com"
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
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Password
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-400 transition-colors">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
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

            {/* Password Strength Meter */}
            <div className="pt-0.5">
              <PasswordStrengthMeter password={password} />
            </div>

            {/* Error Message Banner */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden pt-1"
                >
                  <p className="rounded-xl border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-center text-xs font-semibold text-rose-300">
                    {error}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full mt-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:to-teal-500 active:scale-[0.99] text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Complete Free Registration</span>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center border-t border-white/10 pt-6">
            <p className="text-xs text-slate-400">
              Already have an account?{" "}
              <Link
                to="/user/login"
                className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors underline underline-offset-4 decoration-emerald-500/40"
              >
                Sign In here
              </Link>
            </p>
          </div>
        </motion.div>

        <div className="relative z-10 pt-8 text-center">
          <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
            <Shield className="w-3 h-3 text-emerald-400" />
            <span>End-to-end encrypted session • Ceylon Calling North Central Province</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SiteUserSignUpPage;
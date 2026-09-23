import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Shield, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import LionLogo from "../../assets/Lion.jpg";
import { useAdminStore } from "../store/adminStore";

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const navigate = useNavigate();

  const { login } = useAdminStore();

  const emailIsValid = email.length > 0 && isValidEmail(email);
  const showEmailError = emailTouched && email.length > 0 && !emailIsValid;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success("Welcome back, Administrator!");
      setIsLoading(false);
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Invalid administrator email or password.");
      toast.error("Access Denied");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080B11] px-4 py-12 sm:px-6 lg:px-8 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Decorative gradient glowing spheres — matches the Admin Console's emerald/teal palette */}
      <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-emerald-600/15 blur-[100px]" />
      <div className="absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-teal-600/15 blur-[100px]" />

      {/* Back to main site */}
      <Link
        to="/"
        className="absolute top-6 left-6 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white transition-all backdrop-blur-md z-10"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Back to Ceylon Calling</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md space-y-8 relative z-10"
      >
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl overflow-hidden ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-500/20">
            <img src={LionLogo} alt="Ceylon Calling" className="h-full w-full object-cover" />
          </div>
          <h2 className="mt-6 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Ceylon Calling
          </h2>
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold uppercase tracking-widest">
            <Shield className="h-3 w-3" />
            <span>Admin Console</span>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl border border-gray-800 bg-gray-900/40 p-8 shadow-2xl backdrop-blur-xl">
          <form className="space-y-6" onSubmit={handleLogin}>
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3.5 text-sm text-rose-400">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <span>{error}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Admin Email
                </label>
                <div className="relative mt-1.5">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setEmailTouched(true)}
                    placeholder="admin@ceyloncalling.com"
                    aria-invalid={showEmailError}
                    className={`block w-full rounded-2xl border bg-gray-950/60 py-3 pl-10 pr-10 text-white placeholder-gray-600 outline-none transition-all duration-300 focus:ring-2 ${
                      showEmailError
                        ? "border-rose-500/50 focus:border-rose-500/60 focus:ring-rose-500/10"
                        : "border-gray-800 focus:border-emerald-500/50 focus:ring-emerald-500/10"
                    }`}
                  />
                  {emailIsValid && (
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-emerald-500">
                      <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                {showEmailError && (
                  <p className="mt-1.5 text-[11px] text-rose-400 font-medium">
                    Enter a valid email address.
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Password
                </label>
                <div className="relative mt-1.5">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full rounded-2xl border border-gray-800 bg-gray-950/60 py-3 pl-10 pr-10 text-white placeholder-gray-600 outline-none transition-all duration-300 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-300 transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:brightness-110 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Authorizing...</span>
                </>
              ) : (
                <span>Authorize Access</span>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-gray-500 flex items-center justify-center gap-1.5">
          <Shield className="h-3 w-3 text-emerald-500" />
          <span>Restricted to authorized administrators only • Ceylon Calling</span>
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useAdminStore } from "../store/adminStore";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { login } = useAdminStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      localStorage.setItem("admin_token", "mock-admin-session-xyz");
      localStorage.setItem("admin_user", JSON.stringify({ email, name: "System Admin" }));
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0B0F17] px-4 py-12 sm:px-6 lg:px-8">
      {/* Decorative gradient glowing spheres */}
      <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-blue-600/20 blur-[100px]" />
      <div className="absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-indigo-600/20 blur-[100px]" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20 animate-pulse">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Ceylon Calling
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Administrative Control Panel
          </p>
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl border border-gray-800 bg-gray-900/40 p-8 shadow-2xl backdrop-blur-xl">
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3.5 text-sm text-rose-400 animate-shake">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

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
                    placeholder="admin@ceyloncalling.com"
                    className="block w-full rounded-2xl border border-gray-800 bg-gray-950/60 py-3 pl-10 pr-3 text-white placeholder-gray-600 outline-none transition-all duration-300 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10"
                  />
                </div>
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
                    className="block w-full rounded-2xl border border-gray-800 bg-gray-950/60 py-3 pl-10 pr-10 text-white placeholder-gray-600 outline-none transition-all duration-300 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-400"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-2 rounded-xl bg-blue-500/5 border border-blue-500/10 p-3 text-xs text-blue-400/90 leading-relaxed">
              <span className="font-semibold">Demo Access:</span> Use <code className="bg-blue-500/10 px-1 py-0.5 rounded text-white">admin@ceyloncalling.com</code> and <code className="bg-blue-500/10 px-1 py-0.5 rounded text-white">admin123</code> to access the templates.
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:brightness-110 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
            >
              {isLoading ? (
                <div className="mx-auto h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                "Authorize Access"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;

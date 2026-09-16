import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { LogIn, UserPlus, X, Lock, ShoppingBag } from "lucide-react";
import { useCartStore } from "../../store/useCartStore";

export default function AuthPromptModal({
  isOpen,
  onClose,
  pendingItem = null,
  pendingShop = null,
  customTitle = "Sign in to continue",
  customSubtitle = "Create an account or sign in to add delicious items to your cart.",
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { setPendingAuthItem } = useCartStore();

  if (!isOpen) return null;

  const handleSignIn = () => {
    if (pendingItem) {
      setPendingAuthItem({
        item: pendingItem,
        shop: pendingShop,
        returnUrl: location.pathname + location.search,
      });
    }
    onClose();
    navigate("/user/login", {
      state: {
        returnTo: location.pathname + location.search,
        pendingItem,
        pendingShop,
      },
    });
  };

  const handleSignUp = () => {
    if (pendingItem) {
      setPendingAuthItem({
        item: pendingItem,
        shop: pendingShop,
        returnUrl: location.pathname + location.search,
      });
    }
    onClose();
    navigate("/user/signup", {
      state: {
        returnTo: location.pathname + location.search,
        pendingItem,
        pendingShop,
      },
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/65 backdrop-blur-xs"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className="relative w-full max-w-sm bg-white rounded-3xl p-6 sm:p-7 shadow-2xl z-10 text-center space-y-5 text-slate-800"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
          >
            <X size={15} />
          </button>

          {/* Icon Header */}
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
            <Lock size={26} />
          </div>

          {/* Texts */}
          <div className="space-y-1.5">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              {customTitle}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-light">
              {customSubtitle}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={handleSignIn}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-extrabold shadow-lg shadow-slate-950/10 transition"
            >
              <LogIn size={15} />
              <span>Sign In</span>
            </button>

            <button
              type="button"
              onClick={handleSignUp}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition"
            >
              <UserPlus size={15} />
              <span>Create Account</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-slate-600 font-semibold pt-1"
            >
              Continue Browsing
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

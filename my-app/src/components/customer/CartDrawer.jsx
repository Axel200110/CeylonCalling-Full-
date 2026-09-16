import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Store,
  ArrowRight,
  AlertCircle,
  UtensilsCrossed,
} from "lucide-react";
import { resolveImageUrl, formatLKR } from "../../utils/formatters";
import { useCartStore } from "../../store/useCartStore";
import { useSiteUserAuthStore } from "../../store/siteUserAuthStore";
import AuthPromptModal from "./AuthPromptModal";

export default function CartDrawer() {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const {
    items,
    currentShop,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalPrice,
    getTotalItems,
    conflictModal,
    closeConflictModal,
    confirmSwitchShopAndAdd,
  } = useCartStore();

  const isAuthenticated = useSiteUserAuthStore((state) => state.isAuthenticated);

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  const handleCheckout = () => {
    closeCart();
    if (!isAuthenticated) {
      navigate("/user/login", { state: { returnTo: "/checkout" } });
      return;
    }
    navigate("/checkout");
  };

  return (
    <>
      {/* Slide-over Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeCart}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            />

            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 300 }}
                className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between text-slate-800"
              >
                {/* Header */}
                <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <ShoppingBag size={18} />
                    </div>
                    <div>
                      <h2 className="text-base font-black text-slate-900 tracking-tight">Your Cart</h2>
                      {currentShop && (
                        <p className="text-xs text-slate-400 font-medium flex items-center gap-1 truncate max-w-[200px]">
                          <Store size={11} className="text-emerald-500 shrink-0" />
                          <span>{currentShop.name}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={closeCart}
                    className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
                    aria-label="Close Cart"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-6 divide-y divide-slate-100">
                  {items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
                      <div className="w-16 h-16 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300">
                        <UtensilsCrossed size={28} />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-slate-800">Your cart is empty</h3>
                        <p className="text-xs text-slate-400 max-w-[220px]">
                          Browse our delicious food menus and add dishes to start your order.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          closeCart();
                          navigate("/discover");
                        }}
                        className="px-5 py-2.5 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-emerald-600 transition"
                      >
                        Explore Places
                      </button>
                    </div>
                  ) : (
                    items.map((item) => {
                      const img = resolveImageUrl(item.picture, "food");
                      const itemSubtotal = item.price * item.quantity;

                      return (
                        <div key={item.foodId} className="py-4 first:pt-0 last:pb-0 flex items-center gap-3.5">
                          {/* Thumbnail */}
                          <div className="h-16 w-16 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-100">
                            <img
                              src={img}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                              {item.name}
                            </h4>
                            <p className="text-[11px] text-slate-400 font-medium">
                              {formatLKR(item.price)} each
                            </p>
                            <p className="text-xs font-extrabold text-emerald-600 mt-0.5">
                              {formatLKR(itemSubtotal)}
                            </p>
                          </div>

                          {/* Controls */}
                          <div className="flex items-center gap-2 shrink-0">
                            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl p-1">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.foodId, -1)}
                                className="h-6 w-6 rounded-lg bg-white text-slate-700 hover:bg-slate-100 flex items-center justify-center transition"
                              >
                                <Minus size={11} />
                              </button>
                              <span className="text-xs font-black text-slate-900 min-w-[16px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.foodId, 1)}
                                className="h-6 w-6 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center transition"
                              >
                                <Plus size={11} />
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeItem(item.foodId)}
                              className="p-1.5 text-slate-400 hover:text-red-600 transition"
                              aria-label="Remove item"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Summary & Checkout Footer */}
                {items.length > 0 && (
                  <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-100 space-y-4">
                    {/* Bill Breakdown */}
                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div className="flex justify-between font-medium">
                        <span>Items Subtotal ({totalItems})</span>
                        <span className="font-bold text-slate-900">{formatLKR(totalPrice)}</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Estimated Service</span>
                        <span className="font-bold text-emerald-600">Included</span>
                      </div>
                      <div className="pt-2 border-t border-slate-200/60 flex justify-between text-sm font-black text-slate-900">
                        <span>Grand Total</span>
                        <span className="text-emerald-600">{formatLKR(totalPrice)}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={clearCart}
                        className="px-3.5 py-3 rounded-2xl border border-slate-200 hover:bg-white text-slate-600 text-xs font-bold transition"
                      >
                        Clear
                      </button>
                      <button
                        type="button"
                        onClick={handleCheckout}
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-lg shadow-emerald-900/20 transition"
                      >
                        <span>Checkout • {formatLKR(totalPrice)}</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>

                    <div className="text-center pt-1">
                      <Link
                        to="/cart"
                        onClick={closeCart}
                        className="text-xs text-slate-500 hover:text-emerald-600 font-bold hover:underline"
                      >
                        View Full Cart Page →
                      </Link>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Switch Restaurant Conflict Modal */}
      <AnimatePresence>
        {conflictModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeConflictModal}
              className="fixed inset-0 bg-slate-950/65 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl z-10 text-center space-y-4 text-slate-800"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mx-auto text-amber-500">
                <AlertCircle size={28} />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base font-extrabold text-slate-900">
                  Create new order?
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-light">
                  Your cart currently contains items from{" "}
                  <strong className="text-slate-800">{currentShop?.name}</strong>. Ordering from{" "}
                  <strong className="text-slate-800">{conflictModal.pendingShop?.name}</strong> will reset your cart.
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={confirmSwitchShopAndAdd}
                  className="w-full py-3 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-md transition"
                >
                  Start New Cart & Add Item
                </button>
                <button
                  type="button"
                  onClick={closeConflictModal}
                  className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition"
                >
                  Keep Current Cart
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AuthPromptModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        customTitle="Sign in for checkout"
        customSubtitle="Create an account or sign in to complete your checkout and place your order."
      />
    </>
  );
}

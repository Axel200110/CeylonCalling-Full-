import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Store,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  UtensilsCrossed,
  ShieldCheck,
} from "lucide-react";
import CustomerHeader from "../components/customer/CustomerHeader";
import CartDrawer from "../components/customer/CartDrawer";
import { resolveImageUrl, formatLKR } from "../utils/formatters";
import { useCartStore } from "../store/useCartStore";
import { useSiteUserAuthStore } from "../store/siteUserAuthStore";

export default function CartPage() {
  const navigate = useNavigate();
  const {
    items,
    currentShop,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalPrice,
    getTotalItems,
  } = useCartStore();

  const isAuthenticated = useSiteUserAuthStore((state) => state.isAuthenticated);
  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  const handleCheckout = () => {
    // Guest checkout is allowed — no login required to proceed.
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-slate-50/40 flex flex-col">
      <CustomerHeader />
      <CartDrawer />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-8">
        {/* Back and Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-emerald-600 mb-2 transition"
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <ShoppingBag className="text-emerald-600" size={28} />
              <span>Your Food Cart</span>
            </h1>
          </div>

          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="self-start sm:self-auto text-xs font-bold text-slate-500 hover:text-red-600 transition underline"
            >
              Clear Cart
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center space-y-4 shadow-sm max-w-md mx-auto my-12">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto text-slate-300">
              <UtensilsCrossed size={28} />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900">Your cart is empty</h2>
              <p className="text-xs text-slate-400">
                Explore popular Sri Lankan dining spots and add delicious dishes to your order.
              </p>
            </div>
            <Link
              to="/discover"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold shadow-md transition"
            >
              <span>Explore Restaurants</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Items List Column */}
            <div className="lg:col-span-7 space-y-4">
              {currentShop && (
                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <Store size={15} className="text-emerald-600" />
                    <span>Ordering from: <strong className="text-slate-900">{currentShop.name}</strong></span>
                  </div>
                  {currentShop.id && (
                    <Link
                      to={`/restaurant/${currentShop.id}/menu`}
                      className="text-xs font-extrabold text-emerald-600 hover:underline"
                    >
                      + Add More
                    </Link>
                  )}
                </div>
              )}

              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm divide-y divide-slate-100">
                {items.map((item) => {
                  const img = resolveImageUrl(item.picture, "food");
                  const itemSubtotal = item.price * item.quantity;

                  return (
                    <div key={item.foodId} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                      <div className="h-16 w-16 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-100">
                        <img src={img} alt={item.name} className="h-full w-full object-cover" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-slate-900 truncate">{item.name}</h3>
                        <p className="text-xs text-slate-400">{formatLKR(item.price)} each</p>
                        <p className="text-xs font-extrabold text-emerald-600 mt-0.5">{formatLKR(itemSubtotal)}</p>
                      </div>

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
                          className="p-2 text-slate-400 hover:text-red-600 transition"
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bill Summary Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-5 text-slate-800">
                <h3 className="font-extrabold text-slate-900 text-base pb-3 border-b border-slate-100">
                  Order Summary
                </h3>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between font-medium">
                    <span>Total Items ({totalItems})</span>
                    <span className="font-bold text-slate-900">{formatLKR(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Estimated Kitchen Time</span>
                    <span className="font-bold text-slate-700">15–25 mins</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Service & Handling</span>
                    <span className="font-bold text-emerald-600">Included</span>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex justify-between text-base font-black text-slate-900">
                    <span>Grand Total</span>
                    <span className="text-emerald-600">{formatLKR(totalPrice)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-lg shadow-emerald-950/20 transition"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={15} />
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium pt-1">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  <span>Secure ordering on Ceylon Calling</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

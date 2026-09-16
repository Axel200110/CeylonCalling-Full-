import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Store,
  MapPin,
  Phone,
  Clock,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Utensils,
  ShoppingBag as BagIcon,
} from "lucide-react";
import CustomerHeader from "../components/customer/CustomerHeader";
import { resolveImageUrl, formatLKR } from "../utils/formatters";
import { useCartStore } from "../store/useCartStore";
import { useSiteUserAuthStore } from "../store/siteUserAuthStore";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, currentShop, getTotalPrice, getTotalItems, clearCart } = useCartStore();
  const { user, isAuthenticated } = useSiteUserAuthStore();

  const [orderType, setOrderType] = useState("dine_in"); // 'dine_in', 'takeaway', 'delivery'
  const [contactNumber, setContactNumber] = useState(user?.phone || "");
  const [addressOrTable, setAddressOrTable] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(null);

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/user/login", { state: { returnTo: "/checkout" } });
    }
  }, [isAuthenticated, navigate]);

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsPlacingOrder(true);
    setTimeout(() => {
      const orderNum = "CC-" + Math.floor(100000 + Math.random() * 900000);
      setOrderConfirmed({
        orderNumber: orderNum,
        restaurantName: currentShop?.name || "Partner Restaurant",
        total: totalPrice,
        itemCount: totalItems,
        orderType,
      });
      clearCart();
      setIsPlacingOrder(false);
    }, 1200);
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-slate-50/40 flex flex-col">
      <CustomerHeader />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-8">
        {orderConfirmed ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl border border-slate-100 p-8 sm:p-12 shadow-sm text-center max-w-lg mx-auto space-y-6 text-slate-800 my-8"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
              <CheckCircle2 size={40} />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600">
                Order Confirmed
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                Thank You for Your Order!
              </h1>
              <p className="text-xs text-slate-400 font-medium">
                Reference ID: <strong className="text-slate-700">{orderConfirmed.orderNumber}</strong>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Restaurant:</span>
                <span className="font-bold text-slate-800">{orderConfirmed.restaurantName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Order Option:</span>
                <span className="font-bold text-slate-800 capitalize">{orderConfirmed.orderType.replace("_", " ")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Items:</span>
                <span className="font-bold text-slate-800">{orderConfirmed.itemCount}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-slate-900 text-sm">
                <span>Total Amount:</span>
                <span className="text-emerald-600">{formatLKR(orderConfirmed.total)}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                to="/discover"
                className="flex-1 py-3.5 rounded-2xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold transition shadow-md"
              >
                Back to Discovery
              </Link>
              <Link
                to="/user/profile"
                className="flex-1 py-3.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition"
              >
                View Account
              </Link>
            </div>
          </motion.div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center space-y-4 shadow-sm max-w-md mx-auto my-12">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900">Your cart is empty</h2>
              <p className="text-xs text-slate-400">Add dishes to your cart before proceeding to checkout.</p>
            </div>
            <Link
              to="/discover"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold shadow-md transition"
            >
              Explore Restaurants
            </Link>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="space-y-8">
            <div>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-emerald-600 mb-2 transition"
              >
                <ArrowLeft size={14} />
                <span>Back to Cart</span>
              </button>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                <ShoppingBag className="text-emerald-600" size={28} />
                <span>Complete Checkout</span>
              </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Order Options and Customer Info */}
              <div className="lg:col-span-7 space-y-6">
                {/* 1. Dining / Order Mode Selection */}
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                    1. Choose Service Option
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "dine_in", label: "Dine-In", icon: Utensils, desc: "Eat at table" },
                      { id: "takeaway", label: "Takeaway", icon: BagIcon, desc: "Self pickup" },
                      { id: "delivery", label: "Delivery", icon: Truck, desc: "Direct to door" },
                    ].map((opt) => {
                      const isSelected = orderType === opt.id;
                      const Icon = opt.icon;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setOrderType(opt.id)}
                          className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                            isSelected
                              ? "bg-emerald-50 border-emerald-500 text-emerald-950 ring-1 ring-emerald-500 shadow-xs"
                              : "bg-slate-50/50 hover:bg-slate-100/60 border-slate-200 text-slate-700"
                          }`}
                        >
                          <Icon size={18} className={isSelected ? "text-emerald-600" : "text-slate-400"} />
                          <div className="mt-3">
                            <span className="text-xs font-bold block">{opt.label}</span>
                            <span className="text-[10px] text-slate-400 font-light">{opt.desc}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Customer Contact & Location */}
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4 text-slate-800">
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                    2. Contact & Details
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Contact Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        placeholder="+94 77 123 4567"
                        required
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {orderType === "dine_in"
                          ? "Table Preference / Guest Count"
                          : orderType === "takeaway"
                          ? "Pickup Time Preference"
                          : "Delivery Address in Sri Lanka"}
                      </label>
                      <input
                        type="text"
                        value={addressOrTable}
                        onChange={(e) => setAddressOrTable(e.target.value)}
                        placeholder={
                          orderType === "dine_in"
                            ? "e.g. Table for 2, Outdoor seating if available"
                            : orderType === "takeaway"
                            ? "e.g. In 20 minutes"
                            : "e.g. No. 12, Main Street, Anuradhapura"
                        }
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Special Cooking Instructions (Optional)
                      </label>
                      <textarea
                        value={specialInstructions}
                        onChange={(e) => setSpecialInstructions(e.target.value)}
                        placeholder="Less spicy, allergy notes, extra sauce..."
                        rows={2}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary & Confirm */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-5 text-slate-800">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="font-extrabold text-slate-900 text-base">
                      Summary ({currentShop?.name})
                    </h3>
                    <span className="text-xs text-slate-400 font-medium">{totalItems} items</span>
                  </div>

                  {/* Micro list of items */}
                  <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 pr-1 text-xs">
                    {items.map((item) => (
                      <div key={item.foodId} className="py-2.5 flex items-center justify-between">
                        <div className="min-w-0 pr-2">
                          <p className="font-bold text-slate-900 truncate">{item.name}</p>
                          <p className="text-[10px] text-slate-400">Qty: {item.quantity}</p>
                        </div>
                        <span className="font-extrabold text-slate-800 shrink-0">
                          {formatLKR(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                    <div className="flex justify-between font-medium">
                      <span>Items Subtotal</span>
                      <span className="font-bold text-slate-900">{formatLKR(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Service Fee</span>
                      <span className="font-bold text-emerald-600">Included</span>
                    </div>
                    <div className="pt-2 border-t border-slate-100 flex justify-between text-base font-black text-slate-900">
                      <span>Grand Total</span>
                      <span className="text-emerald-600">{formatLKR(totalPrice)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isPlacingOrder}
                    className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-lg shadow-emerald-950/20 transition disabled:opacity-50"
                  >
                    {isPlacingOrder ? "Processing Order..." : `Confirm & Place Order • ${formatLKR(totalPrice)}`}
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium pt-1">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span>Verified Ceylon Calling Partner Kitchen</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}

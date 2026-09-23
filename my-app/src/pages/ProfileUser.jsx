import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { notify } from "../utils/toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  Hotel,
  Star,
  Settings,
  ShieldCheck,
  ChevronRight,
  Clock,
  MapPin,
  Utensils,
  Trash2,
  ExternalLink,
  RefreshCw,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Bed,
} from "lucide-react";
import CustomerHeader from "../components/customer/CustomerHeader";
import CartDrawer from "../components/customer/CartDrawer";
import EmptyState from "../components/customer/EmptyState";
import { useSiteUserAuthStore } from "../store/siteUserAuthStore";
import { formatLKR, resolveImageUrl } from "../utils/formatters";

export default function ProfileUser() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useSiteUserAuthStore();

  const [activeTab, setActiveTab] = useState("orders"); // 'orders', 'bookings', 'reviews', 'account'
  
  // Data states
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/user/login", { state: { returnTo: "/profile" } });
    }
  }, [isAuthenticated, navigate]);

  // Fetch Orders
  const fetchOrders = async (silent = false) => {
    if (!silent) setLoadingOrders(true);
    try {
      const res = await axios.get("/api/orders/my-orders", {
        withCredentials: true,
      });
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load orders:", err);
      if (!silent) setOrders([]);
    } finally {
      if (!silent) setLoadingOrders(false);
    }
  };

  // Polling for active orders every 15s (pending, confirmed, preparing, ready)
  useEffect(() => {
    const hasActiveOrders = orders.some((o) =>
      ["pending", "confirmed", "preparing", "ready"].includes(o.status?.toLowerCase())
    );
    if (!hasActiveOrders || !isAuthenticated) return;

    const interval = setInterval(() => {
      fetchOrders(true);
    }, 15000);

    return () => clearInterval(interval);
  }, [orders, isAuthenticated]);

  // Fetch Bookings
  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      const res = await axios.get("/api/bookings/my-bookings", {
        withCredentials: true,
      });
      setBookings(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load bookings:", err);
      setBookings([]);
    } finally {
      setLoadingBookings(false);
    }
  };

  // Fetch Reviews
  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
      const res = await axios.get("/api/comments/my-comments", {
        withCredentials: true,
      });
      setReviews(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load reviews:", err);
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
      fetchBookings();
      fetchReviews();
    }
  }, [isAuthenticated]);

  // Delete own review
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    setDeletingReviewId(reviewId);
    try {
      await axios.delete(`/api/comments/user/${reviewId}`, {
        withCredentials: true,
      });
      toast.success("Review deleted successfully");
      fetchReviews();
    } catch (err) {
      console.error("Failed to delete review:", err);
      toast.error(err.response?.data?.error || "Failed to delete review");
    } finally {
      setDeletingReviewId(null);
    }
  };

  if (!isAuthenticated || !user) return null;

  // Status helper styles
  const getOrderStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "confirmed":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "preparing":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "ready":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "completed":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getBookingStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "confirmed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "checked_in":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "checked_out":
      case "completed":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/40 flex flex-col">
      <CustomerHeader />
      <CartDrawer />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-8">
        {/* User Hero Identity Card */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center text-2xl sm:text-3xl font-black uppercase shadow-md shadow-emerald-500/10">
                {user.name ? user.name.charAt(0) : "U"}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full shadow-xs">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white" title="Verified Customer">
                  <ShieldCheck size={12} />
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {user.name || "Customer Explorer"}
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                  Verified Explorer
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Mail size={12} className="text-slate-400" />
                  {user.email}
                </span>
                {user.phone && (
                  <span className="flex items-center gap-1">
                    <Phone size={12} className="text-slate-400" />
                    {user.phone}
                  </span>
                )}
                <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <MapPin size={12} />
                  North Central Province
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
            <div className="flex-1 md:flex-initial px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <span className="block text-lg font-black text-slate-900">{orders.length}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Orders</span>
            </div>
            <div className="flex-1 md:flex-initial px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <span className="block text-lg font-black text-slate-900">{bookings.length}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Stays</span>
            </div>
            <div className="flex-1 md:flex-initial px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <span className="block text-lg font-black text-slate-900">{reviews.length}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Reviews</span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === "orders"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <ShoppingBag size={14} />
            <span>Food Orders</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === "orders" ? "bg-slate-800 text-slate-200" : "bg-slate-200 text-slate-700"}`}>
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("bookings")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === "bookings"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Hotel size={14} />
            <span>Stay Bookings</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === "bookings" ? "bg-slate-800 text-slate-200" : "bg-slate-200 text-slate-700"}`}>
              {bookings.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === "reviews"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Star size={14} />
            <span>My Reviews</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === "reviews" ? "bg-slate-800 text-slate-200" : "bg-slate-200 text-slate-700"}`}>
              {reviews.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("account")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === "account"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Settings size={14} />
            <span>Account Details</span>
          </button>
        </div>

        {/* Tab 1: Food Orders */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900">
                Recent Restaurant Orders
              </h2>
              <button
                onClick={fetchOrders}
                disabled={loadingOrders}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-600 transition"
              >
                <RefreshCw size={12} className={loadingOrders ? "animate-spin" : ""} />
                <span>Refresh</span>
              </button>
            </div>

            {loadingOrders ? (
              <div className="bg-white rounded-3xl p-12 text-center text-xs text-slate-400 animate-pulse border border-slate-100">
                Loading your food orders...
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center space-y-4 max-w-md mx-auto shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <ShoppingBag size={28} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">No Food Orders Yet</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Explore delicious authentic dining in Anuradhapura & Polonnaruwa and place your first order.
                  </p>
                </div>
                <Link
                  to="/shops?type=restaurant"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-900/10 transition"
                >
                  <Utensils size={14} />
                  <span>Discover Restaurants</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const shopName = order.shop?.name || "Restaurant Partner";
                  const shopId = order.shop?._id;
                  const dateStr = order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Recently";

                  return (
                    <div
                      key={order._id}
                      className="bg-white rounded-3xl border border-slate-100 p-5 sm:p-6 shadow-xs space-y-4 hover:border-slate-200 transition"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-slate-900">
                              {order.orderReference || `ORD-${order._id.slice(-6).toUpperCase()}`}
                            </span>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${getOrderStatusBadge(
                                order.status
                              )}`}
                            >
                              {order.status || "Pending"}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">{dateStr}</p>
                        </div>

                        <div className="flex items-center gap-2 sm:text-right">
                          {shopId ? (
                            <Link
                              to={`/restaurant/${shopId}`}
                              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:underline"
                            >
                              <span>{shopName}</span>
                              <ExternalLink size={12} />
                            </Link>
                          ) : (
                            <span className="text-xs font-bold text-slate-800">{shopName}</span>
                          )}
                        </div>
                      </div>

                      {/* Ready Notification Banner */}
                      {order.status?.toLowerCase() === "ready" && (
                        <div className="p-3.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-between shadow-md shadow-emerald-900/10">
                          <div className="flex items-center gap-2.5">
                            <Sparkles size={16} className="text-amber-300 animate-spin shrink-0" />
                            <span>Your order is ready! Please collect your items or await table service.</span>
                          </div>
                          <span className="hidden sm:inline-block text-[10px] px-2.5 py-0.5 rounded-full bg-white/20 uppercase tracking-wider font-black">
                            Ready for Pickup
                          </span>
                        </div>
                      )}

                      {/* Status Stepper / Progress Tracking */}
                      {order.status?.toLowerCase() === "cancelled" ? (
                        <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                          <AlertCircle size={15} className="shrink-0" />
                          <span>This order was cancelled.</span>
                        </div>
                      ) : (
                        <div className="py-2 px-1">
                          {(() => {
                            const steps = [
                              { key: "pending", label: "Placed" },
                              { key: "confirmed", label: "Confirmed" },
                              { key: "preparing", label: "Preparing" },
                              { key: "ready", label: "Ready" },
                              { key: "completed", label: "Completed" },
                            ];
                            const currentKey = (order.status || "pending").toLowerCase();
                            const stepIdx = steps.findIndex((s) => s.key === currentKey);
                            const activeIdx = stepIdx === -1 ? 0 : stepIdx;
                            const progressPct = (activeIdx / (steps.length - 1)) * 100;

                            return (
                              <div className="relative flex items-center justify-between">
                                <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-slate-100 rounded-full z-0" />
                                <div
                                  className="absolute top-1/2 left-0 -translate-y-1/2 h-1 bg-emerald-500 rounded-full transition-all duration-500 z-0"
                                  style={{ width: `${progressPct}%` }}
                                />
                                {steps.map((step, idx) => {
                                  const isDone = idx < activeIdx;
                                  const isCurrent = idx === activeIdx;
                                  return (
                                    <div key={step.key} className="flex flex-col items-center relative z-10">
                                      <div
                                        className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                                          isDone
                                            ? "bg-emerald-600 text-white shadow-xs"
                                            : isCurrent
                                            ? "bg-emerald-500 text-white ring-4 ring-emerald-100 shadow-sm"
                                            : "bg-white text-slate-400 border-2 border-slate-200"
                                        }`}
                                      >
                                        {isDone ? <CheckCircle2 size={13} /> : idx + 1}
                                      </div>
                                      <span
                                        className={`mt-1.5 text-[10px] font-bold ${
                                          isCurrent
                                            ? "text-emerald-700"
                                            : isDone
                                            ? "text-slate-700"
                                            : "text-slate-400"
                                        }`}
                                      >
                                        {step.label}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })()}
                        </div>
                      )}

                      {/* Items breakdown */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                          Ordered Items
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {Array.isArray(order.items) &&
                            order.items.map((it, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100"
                              >
                                <span className="font-semibold text-slate-800">
                                  {it.quantity}x {it.name}
                                </span>
                                <span className="font-bold text-slate-600">
                                  {formatLKR(it.price * it.quantity)}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* Summary footer */}
                      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-4 text-slate-500">
                          <span className="capitalize">
                            Service: <strong className="text-slate-800">{order.serviceType?.replace("_", " ") || "Dine in"}</strong>
                          </span>
                          {order.deliveryAddress && (
                            <span className="truncate max-w-[200px]" title={order.deliveryAddress}>
                              Location/Table: <strong className="text-slate-800">{order.deliveryAddress}</strong>
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 font-bold text-slate-900">
                          <span>Total Paid:</span>
                          <span className="text-base font-black text-emerald-600">
                            {formatLKR(order.totalAmount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Stay Bookings */}
        {activeTab === "bookings" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900">
                Accommodation Bookings & Stays
              </h2>
              <button
                onClick={fetchBookings}
                disabled={loadingBookings}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-600 transition"
              >
                <RefreshCw size={12} className={loadingBookings ? "animate-spin" : ""} />
                <span>Refresh</span>
              </button>
            </div>

            {loadingBookings ? (
              <div className="bg-white rounded-3xl p-12 text-center text-xs text-slate-400 animate-pulse border border-slate-100">
                Loading your bookings...
              </div>
            ) : bookings.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center space-y-4 max-w-md mx-auto shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <Hotel size={28} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">No Stay Bookings Yet</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Explore heritage hotels, serene lakeside villas, and pilgrim guest houses in North Central Province.
                  </p>
                </div>
                <Link
                  to="/shops?type=stays"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-900/10 transition"
                >
                  <Bed size={14} />
                  <span>Discover Stays & Hotels</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => {
                  const venueName = booking.shop?.name || "Boutique Hotel";
                  const venueId = booking.shop?._id;
                  const roomName = booking.room?.name || "Comfort Room";
                  const checkInStr = booking.checkInDate
                    ? new Date(booking.checkInDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "TBD";
                  const checkOutStr = booking.checkOutDate
                    ? new Date(booking.checkOutDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "TBD";

                  return (
                    <div
                      key={booking._id}
                      className="bg-white rounded-3xl border border-slate-100 p-5 sm:p-6 shadow-xs space-y-4 hover:border-slate-200 transition"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-slate-900">
                              {booking.bookingReference || `BKG-${booking._id.slice(-6).toUpperCase()}`}
                            </span>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${getBookingStatusBadge(
                                booking.status
                              )}`}
                            >
                              {booking.status || "Pending"}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            Booked at <strong className="text-slate-800">{venueName}</strong>
                          </p>
                        </div>

                        {venueId && (
                          <Link
                            to={`/restaurant/${venueId}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:underline"
                          >
                            <span>View Venue</span>
                            <ExternalLink size={12} />
                          </Link>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">
                            Room Category
                          </span>
                          <span className="font-bold text-slate-800 block truncate">{roomName}</span>
                          <span className="text-[11px] text-slate-500">
                            {booking.guestsCount} Guest(s)
                          </span>
                        </div>

                        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">
                            Stay Dates
                          </span>
                          <span className="font-bold text-slate-800 block">
                            {checkInStr} &rarr; {checkOutStr}
                          </span>
                          <span className="text-[11px] text-emerald-600 font-semibold">
                            Confirmed Dates
                          </span>
                        </div>

                        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">
                            Total Reservation Rate
                          </span>
                          <span className="text-base font-black text-emerald-600 block">
                            {formatLKR(booking.totalPrice)}
                          </span>
                          <span className="text-[10px] text-slate-400">Pay at check-in / cash</span>
                        </div>
                      </div>

                      {booking.specialRequests && (
                        <div className="p-3 rounded-xl bg-slate-50 text-xs text-slate-600 border border-slate-100">
                          <strong className="text-slate-800">Special Notes:</strong> {booking.specialRequests}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: My Reviews */}
        {activeTab === "reviews" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900">
                Your Shared Reviews & Ratings
              </h2>
              <button
                onClick={fetchReviews}
                disabled={loadingReviews}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-600 transition"
              >
                <RefreshCw size={12} className={loadingReviews ? "animate-spin" : ""} />
                <span>Refresh</span>
              </button>
            </div>

            {loadingReviews ? (
              <div className="bg-white rounded-3xl p-12 text-center text-xs text-slate-400 animate-pulse border border-slate-100">
                Loading your reviews...
              </div>
            ) : reviews.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center space-y-4 max-w-md mx-auto shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <Star size={28} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">No Reviews Written Yet</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Visited a restaurant or stayed in a heritage hotel? Share your feedback to help fellow travellers!
                  </p>
                </div>
                <Link
                  to="/discover"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-900/10 transition"
                >
                  <Sparkles size={14} />
                  <span>Explore & Review Venues</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => {
                  const shopName = rev.shop?.name || "Partner Venue";
                  const shopId = rev.shop?._id || rev.shop;
                  const dateStr = rev.createdAt
                    ? new Date(rev.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Recently";

                  return (
                    <div
                      key={rev._id}
                      className="bg-white rounded-3xl border border-slate-100 p-5 sm:p-6 shadow-xs space-y-3 hover:border-slate-200 transition"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          {shopId ? (
                            <Link
                              to={`/restaurant/${shopId}`}
                              className="text-sm font-extrabold text-slate-900 hover:text-emerald-600 transition inline-flex items-center gap-1.5"
                            >
                              <span>{shopName}</span>
                              <ExternalLink size={12} className="text-slate-400" />
                            </Link>
                          ) : (
                            <h3 className="text-sm font-extrabold text-slate-900">{shopName}</h3>
                          )}
                          <span className="text-[11px] text-slate-400 block">{dateStr}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={13}
                                className={i < (rev.rating || 5) ? "fill-amber-400" : "text-slate-200"}
                              />
                            ))}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteReview(rev._id)}
                            disabled={deletingReviewId === rev._id}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                            title="Delete this review"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed font-light whitespace-pre-wrap">
                        {rev.message}
                      </p>

                      {rev.ownerReply?.message && (
                        <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100/90 text-xs space-y-1">
                          <div className="flex items-center justify-between text-emerald-800 font-bold text-[11px]">
                            <span className="flex items-center gap-1">
                              <CheckCircle2 size={12} className="text-emerald-600" />
                              Response from Venue Host
                            </span>
                            {rev.ownerReply.repliedAt && (
                              <span className="text-[10px] text-emerald-600 font-normal">
                                {new Date(rev.ownerReply.repliedAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            )}
                          </div>
                          <p className="text-slate-700 font-normal leading-relaxed">
                            {rev.ownerReply.message}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Account Details */}
        {activeTab === "account" && (
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Account Information & Security
              </h2>
              <p className="text-xs text-slate-400 font-light mt-0.5">
                Your authenticated profile credentials and security preferences.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Full Name</span>
                <span className="font-bold text-slate-900 text-sm block">{user.name || "Explorer"}</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Email Address</span>
                <span className="font-bold text-slate-900 text-sm block">{user.email}</span>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <ShieldCheck size={12} /> Email Verified
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Phone Number</span>
                <span className="font-bold text-slate-900 text-sm block">{user.phone || "Not provided"}</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Region</span>
                <span className="font-bold text-slate-900 text-sm block">North Central Province</span>
                <span className="text-[10px] text-slate-400">Anuradhapura & Polonnaruwa</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
              <Link
                to="/usersetting"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold shadow-sm transition"
              >
                <Settings size={14} />
                <span>Manage Account Settings & Password</span>
              </Link>

              <button
                onClick={async () => {
                  await logout();
                  navigate("/discover");
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition"
              >
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

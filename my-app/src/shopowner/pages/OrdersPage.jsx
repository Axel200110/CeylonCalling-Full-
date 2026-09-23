import React, { useEffect, useState } from "react";
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  User, 
  Phone, 
  MapPin, 
  ChefHat, 
  PackageCheck, 
  Filter,
  RefreshCw,
  UserCheck,
  UserX
} from "lucide-react";
import { notify } from "../../utils/toast";
import SidebarNavigation from "../components/SideNavbar";
import { useAuthStore } from "../store/authStore";

const OrdersPage = () => {
  const { orders, fetchOrders, updateOrderStatus } = useAuthStore();
  const [activeStatus, setActiveStatus] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = async (silent = false) => {
    if (!silent) setRefreshing(true);
    try {
      await fetchOrders();
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      if (!silent) setRefreshing(false);
    }
  };

  useEffect(() => {
    loadOrders();
    // Auto-refresh orders every 20 seconds for the live kitchen display
    const timer = setInterval(() => {
      loadOrders(true);
    }, 20000);
    return () => clearInterval(timer);
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      await updateOrderStatus(orderId, newStatus);
      notify.success(`Order moved to ${newStatus.toUpperCase()}`);
    } catch (err) {
      notify.error(err, "Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = (orders || []).filter((o) => {
    if (activeStatus === "all") return true;
    return o.status === activeStatus;
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex font-sans">
      <SidebarNavigation />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full pt-20 md:pt-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-emerald-400" />
              Live Orders & Kitchen Queue
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Real-time queue for dine-in, takeaway, and delivery orders. Auto-syncs every 20 seconds.
            </p>
          </div>
          <button
            onClick={() => loadOrders(false)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white hover:border-neutral-700 transition self-start sm:self-auto"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin text-emerald-400" : ""}`} />
            <span>Refresh Queue</span>
          </button>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 bg-neutral-900/60 p-1 rounded-xl border border-neutral-800 overflow-x-auto w-fit">
          {["all", "pending", "confirmed", "preparing", "ready", "completed", "cancelled"].map((st) => (
            <button
              key={st}
              onClick={() => setActiveStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition ${
                activeStatus === st ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20" : "text-neutral-400 hover:text-white"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-neutral-900/30 rounded-2xl border border-neutral-900">
            <ShoppingBag className="h-10 w-10 text-neutral-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-neutral-300">No orders in this queue</p>
            <p className="text-xs text-neutral-500 mt-1">Incoming food orders will appear here automatically.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((order) => (
              <div
                key={order._id}
                className="p-5 rounded-2xl border border-neutral-900 bg-neutral-900/40 flex flex-col justify-between space-y-4 hover:border-emerald-500/30 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-emerald-400">
                          {order.orderReference || `ORD-${order._id.slice(-6).toUpperCase()}`}
                        </span>
                        {order.customer ? (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                            <UserCheck className="h-2.5 w-2.5" /> Registered
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                            <UserX className="h-2.5 w-2.5" /> Guest
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-white mt-1">{order.customerName}</h4>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          order.status === "completed"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : order.status === "cancelled"
                            ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse"
                        }`}
                      >
                        {order.status}
                      </span>
                      {order.createdAt && (
                        <p className="text-[10px] text-neutral-500 mt-1">
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-neutral-400 space-y-1 mb-3">
                    <p className="flex items-center gap-1.5">
                      <Phone className="h-3 w-3 text-neutral-500" /> {order.customerContact}
                    </p>
                    <p className="capitalize text-neutral-300">
                      Service: <strong className="text-white">{order.serviceType?.replace("_", " ") || "Dine in"}</strong>
                    </p>
                    {order.deliveryAddress && (
                      <p className="flex items-start gap-1.5 text-neutral-300">
                        <MapPin className="h-3 w-3 text-neutral-500 mt-0.5 shrink-0" />
                        <span>{order.deliveryAddress}</span>
                      </p>
                    )}
                  </div>

                  {/* Items list */}
                  <div className="p-3 rounded-xl bg-black/40 border border-neutral-800/80 space-y-2 text-xs">
                    <span className="text-[10px] font-bold uppercase text-neutral-500 block">Ordered Items:</span>
                    {order.items?.map((it, idx) => (
                      <div key={idx} className="flex justify-between items-center text-neutral-300">
                        <span>{it.quantity}x {it.name}</span>
                        <span className="font-mono">LKR {(it.price * it.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-neutral-800 flex justify-between font-bold text-white">
                      <span>Total Amount:</span>
                      <span className="text-emerald-400">LKR {order.totalAmount?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Status action buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-800">
                  {order.status === "pending" && (
                    <button
                      onClick={() => handleStatusChange(order._id, "confirmed")}
                      disabled={updatingId === order._id}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold"
                    >
                      {updatingId === order._id ? "Updating..." : "Confirm Order"}
                    </button>
                  )}
                  {order.status === "confirmed" && (
                    <button
                      onClick={() => handleStatusChange(order._id, "preparing")}
                      disabled={updatingId === order._id}
                      className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1"
                    >
                      <ChefHat className="h-3.5 w-3.5" />
                      <span>{updatingId === order._id ? "Updating..." : "Start Kitchen Prep"}</span>
                    </button>
                  )}
                  {order.status === "preparing" && (
                    <button
                      onClick={() => handleStatusChange(order._id, "ready")}
                      disabled={updatingId === order._id}
                      className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1"
                    >
                      <PackageCheck className="h-3.5 w-3.5" />
                      <span>{updatingId === order._id ? "Updating..." : "Mark Ready"}</span>
                    </button>
                  )}
                  {order.status === "ready" && (
                    <button
                      onClick={() => handleStatusChange(order._id, "completed")}
                      disabled={updatingId === order._id}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold"
                    >
                      {updatingId === order._id ? "Updating..." : "Complete Fulfillment"}
                    </button>
                  )}
                  {order.status !== "completed" && order.status !== "cancelled" && (
                    <button
                      onClick={() => handleStatusChange(order._id, "cancelled")}
                      disabled={updatingId === order._id}
                      className="px-3 py-1.5 rounded-lg bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 border border-rose-500/20 text-xs font-semibold ml-auto disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default OrdersPage;

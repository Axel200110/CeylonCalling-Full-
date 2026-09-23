import React, { useEffect, useState } from "react";
import { 
  Users, ShoppingBag, MapPin, AlertCircle, Check, X, ShieldAlert, 
  Eye, Clock, ArrowUpRight, MessageCircle, AlertTriangle 
} from "lucide-react";
import { useAdminStore } from "../store/adminStore";
import StatCard from "../components/StatCard";
import ChartWrapper from "../components/ChartWrapper";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { users, shops, listings, stats, fetchDashboardData, updateShopStatus } = useAdminStore();
  const navigate = useNavigate();

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const totalUsers = stats?.totalUsers ?? users.length;
  const approvedShops = stats?.approvedShops ?? shops.filter((s) => s.status === "approved").length;
  const pendingShops = shops.filter((s) => s.status === "pending");
  const pendingCount = stats?.pendingShops ?? pendingShops.length;
  const activeListings = stats?.totalPlaces ?? listings.filter((l) => l.status === "active").length;
  const totalReviews = stats?.totalReviews ?? 0;
  const openWarnings = stats?.openWarnings ?? 0;

  const handleApprove = async (shopId) => {
    try {
      await updateShopStatus(shopId, "approved");
      toast.success("Merchant shop verified & approved!");
      fetchDashboardData();
    } catch {
      toast.error("Failed to approve merchant");
    }
  };

  const handleOpenReject = (shop) => {
    setSelectedShop(shop);
    setRejectionReason("");
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason.");
      return;
    }
    try {
      setIsProcessing(true);
      await updateShopStatus(selectedShop.id || selectedShop._id, "rejected", rejectionReason);
      toast.error("Merchant request rejected.");
      setRejectModalOpen(false);
      fetchDashboardData();
    } catch {
      toast.error("Failed to reject shop");
    } finally {
      setIsProcessing(false);
    }
  };

  const monthlyCategories = stats?.monthlyRegistrations?.categories || ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const monthlyData = stats?.monthlyRegistrations?.data || [5, 12, 19, 25, 34, totalUsers];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Metric Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Platform Users"
          value={totalUsers}
          icon={Users}
          description="Registered traveler profiles"
          color="blue"
        />
        <StatCard
          title="Verified Merchants"
          value={approvedShops}
          icon={ShoppingBag}
          description="Active partner businesses"
          color="green"
        />
        <StatCard
          title="Pending Approvals"
          value={pendingCount}
          icon={AlertCircle}
          description="Awaiting verification"
          color="amber"
        />
        <StatCard
          title="Active Warnings"
          value={openWarnings}
          icon={AlertTriangle}
          description="Pending policy issues"
          color="red"
        />
      </div>

      {/* Real Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <ChartWrapper
          type="area"
          title="Platform User Registrations (Last 6 Months)"
          data={monthlyData}
          categories={monthlyCategories}
          color="emerald"
        />
        <ChartWrapper
          type="bar"
          title="Merchant Establishments By Category"
          data={
            stats?.shopTypeBreakdown?.map((b) => b.count) || [
              shops.filter((s) => s.category === "restaurant").length,
              shops.filter((s) => s.category === "hotel").length,
              shops.filter((s) => s.category === "villa").length,
              shops.filter((s) => s.category === "guesthouse").length,
            ]
          }
          categories={
            stats?.shopTypeBreakdown?.map((b) => b._id || "Other") || ["Restaurant", "Hotel", "Villa", "Guesthouse"]
          }
          color="teal"
        />
      </div>

      {/* Pending Approvals Fast-Action Queue */}
      <div className="rounded-2xl border border-gray-900 bg-[#0B0F17] p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4 border-b border-gray-900 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-400" />
              Pending Partner Applications Queue
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Review and verify newly submitted tourism businesses.
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/shops")}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            Manage All <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

        {pendingShops.length === 0 ? (
          <div className="text-center py-10">
            <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <Check className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-gray-300">All applications verified</p>
            <p className="text-xs text-gray-500 mt-1">No pending merchant requests requiring action.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-900">
            {pendingShops.slice(0, 5).map((shop) => (
              <div key={shop.id || shop._id} className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={shop.image || "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=100"}
                    alt={shop.name}
                    className="h-12 w-12 rounded-xl object-cover border border-gray-800 shrink-0"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white">{shop.name}</h4>
                    <p className="text-xs text-gray-400">
                      {shop.ownerName} • <span className="text-emerald-400 capitalize">{shop.category || shop.shopType}</span> • {shop.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => navigate("/admin/shops")}
                    className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-medium text-gray-200 transition"
                  >
                    Inspect Details
                  </button>
                  <button
                    onClick={() => handleApprove(shop.id || shop._id)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-medium text-white transition flex items-center gap-1 shadow-lg shadow-emerald-600/20"
                  >
                    <Check className="h-3.5 w-3.5" /> Approve
                  </button>
                  <button
                    onClick={() => handleOpenReject(shop)}
                    className="px-3 py-1.5 rounded-lg bg-rose-600/10 hover:bg-rose-600/20 border border-rose-500/30 text-xs font-medium text-rose-300 transition flex items-center gap-1"
                  >
                    <X className="h-3.5 w-3.5" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reject Modal with Reason */}
      {rejectModalOpen && selectedShop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0F141F] border border-gray-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-rose-500" />
                Reject Partner Application
              </h3>
              <button onClick={() => setRejectModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-gray-300">
              Please explain why <strong className="text-white">{selectedShop.name}</strong> is being rejected. This explanation will be logged and dispatched to the owner.
            </p>

            <div>
              <label className="text-xs font-medium text-gray-400 mb-1 block">Rejection Reason</label>
              <textarea
                rows={4}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g., Incomplete business details or invalid contact phone number."
                className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectModalOpen(false)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-300 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleConfirmReject}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white rounded-xl transition"
              >
                {isProcessing ? "Processing..." : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

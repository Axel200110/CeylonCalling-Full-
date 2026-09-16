import React from "react";
import { Users, ShoppingBag, MapPin, AlertCircle, Check, X, ShieldAlert } from "lucide-react";
import { useAdminStore } from "../store/adminStore";
import StatCard from "../components/StatCard";
import ChartWrapper from "../components/ChartWrapper";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { users, shops, listings, logs, updateShopStatus } = useAdminStore();

  // Compute metrics
  const totalUsers = users.length;
  const activeListings = listings.filter((l) => l.status === "active").length;
  const approvedShops = shops.filter((s) => s.status === "approved").length;
  const pendingShops = shops.filter((s) => s.status === "pending");
  const pendingCount = pendingShops.length;

  const handleApproveShop = (shopId) => {
    updateShopStatus(shopId, "approved");
    toast.success("Merchant shop approved successfully");
  };

  const handleRejectShop = (shopId) => {
    updateShopStatus(shopId, "suspended");
    toast.error("Merchant shop rejected and suspended");
  };

  // Mock analytics arrays
  const userGrowthData = [12, 19, 32, 45, 58, totalUsers * 10]; // Multiplied to show simulated historical scaling
  const userGrowthCategories = ["Feb", "Mar", "Apr", "May", "Jun", "Jul"];

  const visitorViewsData = [120, 190, 310, 480, 520, 710];
  const visitorViewsCategories = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Overview Metric Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Platform Users"
          value={totalUsers}
          icon={Users}
          description="Registered site accounts"
          trend={14.2}
          trendType="positive"
          color="blue"
        />
        <StatCard
          title="Approved Shops"
          value={approvedShops}
          icon={ShoppingBag}
          description="Active merchant profiles"
          trend={8.4}
          trendType="positive"
          color="green"
        />
        <StatCard
          title="Active Listings"
          value={activeListings}
          icon={MapPin}
          description="Total destinations visible"
          trend={19.1}
          trendType="positive"
          color="purple"
        />
        <StatCard
          title="Pending Approvals"
          value={pendingCount}
          icon={AlertCircle}
          description="Shops awaiting verification"
          trend={pendingCount > 0 ? -12.5 : 0}
          trendType={pendingCount > 0 ? "negative" : "positive"}
          color="amber"
        />
      </div>

      {/* Analytics Visualization Panel */}
      <div className="grid gap-6 md:grid-cols-2">
        <ChartWrapper
          type="area"
          title="User Account Registration Trend (Monthly)"
          data={userGrowthData}
          categories={userGrowthCategories}
          color="blue"
        />
        <ChartWrapper
          type="bar"
          title="Platform Traffic / Search Index (Daily)"
          data={visitorViewsData}
          categories={visitorViewsCategories}
          color="purple"
        />
      </div>

      {/* Split Lists: Pending Approvals & Activity Logs */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Pending approvals section */}
        <div className="rounded-2xl border border-gray-900 bg-[#0B0F17] p-6 shadow-xl lg:col-span-2">
          <div className="flex items-center justify-between mb-4 border-b border-gray-900 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-amber-500" />
              Pending Shop Registrations ({pendingCount})
            </h3>
          </div>

          {pendingCount === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center text-center">
              <Check className="h-10 w-10 text-emerald-500 bg-emerald-500/10 rounded-full p-2 mb-2" />
              <p className="text-sm font-medium text-gray-300">All caught up!</p>
              <p className="text-xs text-gray-500 mt-1">No merchant shops are currently pending review.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingShops.map((shop) => (
                <div 
                  key={shop.id} 
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-gray-950 bg-gray-950/40 hover:bg-gray-950/70 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={shop.image} 
                      alt={shop.name} 
                      className="h-12 w-12 rounded-lg object-cover border border-gray-800 shrink-0"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white">{shop.name}</h4>
                      <p className="text-xs text-gray-400 mt-0.5">Owner: {shop.ownerName} ({shop.location})</p>
                      <span className="inline-block mt-1 text-[10px] font-semibold text-blue-400 bg-blue-500/10 rounded px-1.5 py-0.5">
                        {shop.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleRejectShop(shop.id)}
                      className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-gray-800 hover:border-rose-500/30 hover:bg-rose-500/5 px-3.5 text-xs font-semibold text-gray-400 hover:text-rose-400 transition-all cursor-pointer"
                    >
                      <X className="h-4 w-4" /> Reject
                    </button>
                    <button
                      onClick={() => handleApproveShop(shop.id)}
                      className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 px-3.5 text-xs font-semibold text-white shadow shadow-blue-600/10 transition-all cursor-pointer"
                    >
                      <Check className="h-4 w-4" /> Verify Shop
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity audit trails logs */}
        <div className="rounded-2xl border border-gray-900 bg-[#0B0F17] p-6 shadow-xl">
          <div className="mb-4 border-b border-gray-900 pb-3">
            <h3 className="text-base font-bold text-white">System Audit Log</h3>
          </div>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 scrollbar-hide">
            {logs.map((log) => {
              // Color map for event items
              let dotColor = "bg-blue-500";
              if (log.type === "security") dotColor = "bg-amber-500";
              if (log.type === "shop") dotColor = "bg-purple-500";
              if (log.type === "user") dotColor = "bg-rose-500";

              return (
                <div key={log.id} className="relative pl-5 pb-1 border-l border-gray-900 last:border-0 last:pb-0">
                  <span className={`absolute left-[-4.5px] top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-[#0B0F17] ${dotColor}`} />
                  <p className="text-xs font-medium text-gray-200 leading-relaxed">{log.text}</p>
                  <span className="text-[10px] text-gray-500 block mt-1">
                    {new Date(log.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

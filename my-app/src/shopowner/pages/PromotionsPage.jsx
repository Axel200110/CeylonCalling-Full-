import React, { useEffect, useState } from "react";
import { 
  Plus, Trash2, Tag, Percent, Calendar, CheckCircle2, XCircle, Gift, Sparkles, Filter
} from "lucide-react";
import toast from "react-hot-toast";
import SidebarNavigation from "../components/SideNavbar";
import { useAuthStore } from "../store/authStore";

const PromotionsPage = () => {
  const { promotions, fetchPromotions, createPromotion, deletePromotion, shop } = useAuthStore();
  const [activeTab, setActiveTab] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "promotion",
    discountType: "percentage",
    discountValue: "",
    code: "",
    applicableCategory: "All",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
  });

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.endDate) {
      toast.error("Please fill required fields (Title & End Date)");
      return;
    }

    try {
      setIsSubmitting(true);
      await createPromotion(formData);
      toast.success("Promotion published successfully!");
      setShowModal(false);
      setFormData({
        title: "",
        description: "",
        type: "promotion",
        discountType: "percentage",
        discountValue: "",
        code: "",
        applicableCategory: "All",
        startDate: new Date().toISOString().split("T")[0],
        endDate: "",
      });
    } catch {
      toast.error("Failed to create promotion");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this promotion?")) {
      try {
        await deletePromotion(id);
        toast.success("Promotion removed");
      } catch {
        toast.error("Failed to delete promotion");
      }
    }
  };

  const filtered = promotions.filter((p) => {
    if (activeTab === "promotion") return p.type === "promotion";
    if (activeTab === "offer") return p.type === "offer";
    return true;
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex font-sans">
      <SidebarNavigation />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full pt-20 md:pt-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Tag className="h-6 w-6 text-emerald-400" />
              Promotions & Special Offers
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Create limited-time discount codes, seasonal deals, and special menu offers for your customers.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white rounded-xl flex items-center gap-2 transition shadow-lg shadow-emerald-600/20 self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" /> Create Deal / Promo
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 bg-neutral-900/60 p-1 rounded-xl border border-neutral-800 w-fit">
          {["all", "promotion", "offer"].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                activeTab === t ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20" : "text-neutral-400 hover:text-white"
              }`}
            >
              {t === "all" ? "All Deals" : t === "promotion" ? "Discounts & Vouchers" : "Special Packages"}
            </button>
          ))}
        </div>

        {/* List of Promotions */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-neutral-900/30 rounded-2xl border border-neutral-900">
            <Gift className="h-10 w-10 text-neutral-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-neutral-300">No active promotions</p>
            <p className="text-xs text-neutral-500 mt-1">Attract tourists with special discounts and seasonal offers.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <div
                key={item._id}
                className="p-5 rounded-2xl border border-neutral-900 bg-neutral-900/40 flex flex-col justify-between hover:border-emerald-500/30 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {item.type}
                    </span>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-neutral-500 hover:text-rose-400 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <h3 className="text-sm font-bold text-white">{item.title}</h3>
                  <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                    {item.description || "Special offer available at Ceylon Calling."}
                  </p>

                  <div className="my-3 p-2.5 rounded-xl bg-black/40 border border-neutral-800/80 flex items-center justify-between text-xs">
                    <span className="text-neutral-400">Discount:</span>
                    <span className="font-bold text-emerald-400">
                      {item.discountType === "percentage" ? `${item.discountValue}% OFF` : `LKR ${item.discountValue} OFF`}
                    </span>
                  </div>

                  {item.code && (
                    <div className="text-[11px] text-neutral-400 flex items-center justify-between">
                      <span>Promo Code:</span>
                      <span className="font-mono text-white font-bold bg-neutral-800 px-2 py-0.5 rounded">{item.code}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-800 text-[10px] text-neutral-500 flex items-center justify-between">
                  <span>Valid until:</span>
                  <span className="text-neutral-300 font-medium">{new Date(item.endDate).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-4">
              <h3 className="text-sm font-bold text-white">Create New Promotion or Offer</h3>

              <form onSubmit={handleCreate} className="space-y-3 text-xs">
                <div>
                  <label className="text-neutral-400 block mb-1">Deal Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Weekend Family Feast 20% OFF"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-neutral-400 block mb-1">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="promotion">Promo Discount</option>
                      <option value="offer">Special Meal Deal</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-neutral-400 block mb-1">Discount Type</label>
                    <select
                      value={formData.discountType}
                      onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Cash (LKR)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-neutral-400 block mb-1">Discount Value</label>
                    <input
                      type="number"
                      value={formData.discountValue}
                      onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                      placeholder="e.g., 15"
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                    >
                    </input>
                  </div>
                  <div>
                    <label className="text-neutral-400 block mb-1">Promo Code (Optional)</label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      placeholder="e.g., CEYLON20"
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-neutral-400 block mb-1">Expiration / End Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-neutral-400 block mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief terms or included meals..."
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-600/20"
                  >
                    {isSubmitting ? "Publishing..." : "Publish Deal"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PromotionsPage;

import React, { useEffect, useState } from "react";
import { 
  MessageCircle, Search, Trash2, Eye, EyeOff, ShieldCheck, 
  AlertTriangle, Filter, CheckCircle2, XCircle, Star, MapPin
} from "lucide-react";
import toast from "react-hot-toast";
import { useAdminStore } from "../store/adminStore";

const ReviewModeration = () => {
  const { reviews, fetchReviews, moderateReview, deleteReview } = useAdminStore();
  const [reviewType, setReviewType] = useState("shop");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReview, setSelectedReview] = useState(null);
  const [modReason, setModReason] = useState("");
  const [isModModalOpen, setIsModModalOpen] = useState(false);
  const [targetAction, setTargetAction] = useState("hidden");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [reviewType, statusFilter]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      await fetchReviews(reviewType, statusFilter);
    } catch {
      toast.error("Failed to load reviews");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModerate = (review, action) => {
    setSelectedReview(review);
    setTargetAction(action);
    setModReason("");
    setIsModModalOpen(true);
  };

  const handleConfirmModerate = async () => {
    try {
      await moderateReview(selectedReview.id, targetAction, modReason, reviewType);
      toast.success(`Review status updated to ${targetAction}`);
      setIsModModalOpen(false);
      loadData();
    } catch {
      toast.error("Failed to update review status");
    }
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm("Are you sure you want to permanently delete this customer review?")) {
      try {
        await deleteReview(reviewId, reviewType);
        toast.success("Review deleted permanently");
        loadData();
      } catch {
        toast.error("Failed to delete review");
      }
    }
  };

  const filteredReviews = reviews.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      (r.userName && r.userName.toLowerCase().includes(q)) ||
      (r.targetTitle && r.targetTitle.toLowerCase().includes(q)) ||
      (r.message && r.message.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-emerald-400" />
            Reviews & Feedback Moderation
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Monitor, inspect ratings, and govern user reviews on merchants and travel destinations.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-gray-900/60 p-1 rounded-xl border border-gray-800">
          <button
            onClick={() => setReviewType("shop")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              reviewType === "shop" ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20" : "text-gray-400 hover:text-white"
            }`}
          >
            Merchant Reviews
          </button>
          <button
            onClick={() => setReviewType("place")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              reviewType === "place" ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20" : "text-gray-400 hover:text-white"
            }`}
          >
            Destination Reviews
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#0B0F17] p-4 rounded-2xl border border-gray-900 shadow-xl">
        <div className="relative w-full md:w-96">
          <Search className="h-4 w-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search feedback, author, or establishment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          {["all", "visible", "flagged", "hidden"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition ${
                statusFilter === status
                  ? "bg-gray-800 text-emerald-400 border border-emerald-500/30"
                  : "bg-gray-950/40 text-gray-400 hover:text-white border border-gray-900"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Review List Grid */}
      {isLoading ? (
        <div className="text-center py-20 text-gray-500 text-xs">Loading reviews...</div>
      ) : filteredReviews.length === 0 ? (
        <div className="text-center py-16 bg-[#0B0F17] rounded-2xl border border-gray-900">
          <MessageCircle className="h-10 w-10 text-gray-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-gray-300">No reviews found</p>
          <p className="text-xs text-gray-500 mt-1">There are no customer feedbacks matching the selected filter.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className={`p-5 rounded-2xl border bg-[#0B0F17] flex flex-col justify-between transition-all ${
                review.status === "hidden"
                  ? "border-rose-950/50 bg-[#0B0F17]/50 opacity-75"
                  : review.status === "flagged"
                  ? "border-amber-900/40"
                  : "border-gray-900"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      {review.targetTitle}
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      By <span className="text-gray-200 font-medium">{review.userName}</span> ({review.userEmail})
                    </p>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                      review.status === "visible"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : review.status === "flagged"
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    }`}
                  >
                    {review.status}
                  </span>
                </div>

                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, idx) => (
                    <Star
                      key={idx}
                      className={`h-3.5 w-3.5 ${
                        idx < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-700"
                      }`}
                    />
                  ))}
                  <span className="text-xs font-bold text-amber-400 ml-1.5">{review.rating}.0</span>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed bg-gray-950/50 p-3 rounded-xl border border-gray-900">
                  "{review.message}"
                </p>

                {review.moderationReason && (
                  <p className="text-[11px] text-amber-400/90 mt-2 italic">
                    Note: {review.moderationReason}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-900 text-xs">
                <span className="text-[11px] text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>

                <div className="flex items-center gap-2">
                  {review.status !== "visible" && (
                    <button
                      onClick={() => handleOpenModerate(review, "visible")}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 font-medium flex items-center gap-1"
                    >
                      <Eye className="h-3 w-3" /> Approve
                    </button>
                  )}
                  {review.status !== "flagged" && (
                    <button
                      onClick={() => handleOpenModerate(review, "flagged")}
                      className="px-2.5 py-1 rounded-lg bg-amber-600/10 hover:bg-amber-600/20 text-amber-400 border border-amber-500/20 font-medium flex items-center gap-1"
                    >
                      <AlertTriangle className="h-3 w-3" /> Flag
                    </button>
                  )}
                  {review.status !== "hidden" && (
                    <button
                      onClick={() => handleOpenModerate(review, "hidden")}
                      className="px-2.5 py-1 rounded-lg bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 border border-rose-500/20 font-medium flex items-center gap-1"
                    >
                      <EyeOff className="h-3 w-3" /> Hide
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="p-1 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Moderation Reason Modal */}
      {isModModalOpen && selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0F141F] border border-gray-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-white">
              Moderate Review Status to: <span className="uppercase text-emerald-400">{targetAction}</span>
            </h3>
            <p className="text-xs text-gray-400">
              Provide an internal administrator rationale for auditing purposes.
            </p>

            <div>
              <label className="text-xs font-medium text-gray-300 mb-1 block">Moderation Reason (Optional)</label>
              <textarea
                rows={3}
                value={modReason}
                onChange={(e) => setModReason(e.target.value)}
                placeholder="e.g., Inappropriate language, off-topic, or verified resolution."
                className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsModModalOpen(false)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-300 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmModerate}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white rounded-xl transition"
              >
                Save Decision
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewModeration;

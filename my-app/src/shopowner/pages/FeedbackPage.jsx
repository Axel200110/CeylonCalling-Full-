import React, { useEffect, useState } from "react";
import { MessageCircle, Star, Reply, Send, CheckCircle2, Search, Filter } from "lucide-react";
import toast from "react-hot-toast";
import SidebarNavigation from "../components/SideNavbar";
import { useAuthStore } from "../store/authStore";

const FeedbackPage = () => {
  const { reviews, fetchReviews, replyToReview } = useAuthStore();
  const [selectedReview, setSelectedReview] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterRating, setFilterRating] = useState("all");

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) {
      toast.error("Reply text cannot be empty");
      return;
    }

    try {
      setIsSubmitting(true);
      await replyToReview(selectedReview._id, replyText);
      toast.success("Response posted to review!");
      setSelectedReview(null);
      setReplyText("");
    } catch {
      toast.error("Failed to post response");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = reviews.filter((r) => {
    if (filterRating === "all") return true;
    return r.rating === Number(filterRating);
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex font-sans">
      <SidebarNavigation />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full pt-20 md:pt-8 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-emerald-400" />
            Customer Feedback & Reviews
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Read traveler feedback, monitor customer ratings, and publicly respond to build hospitality trust.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 bg-neutral-900/60 p-1 rounded-xl border border-neutral-800 w-fit">
          {["all", "5", "4", "3", "2", "1"].map((rate) => (
            <button
              key={rate}
              onClick={() => setFilterRating(rate)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filterRating === rate ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20" : "text-neutral-400 hover:text-white"
              }`}
            >
              {rate === "all" ? "All Stars" : `${rate} Stars ★`}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-neutral-900/30 rounded-2xl border border-neutral-900">
            <MessageCircle className="h-10 w-10 text-neutral-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-neutral-300">No customer reviews yet</p>
            <p className="text-xs text-neutral-500 mt-1">Guest feedback will appear here as tourists leave ratings.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((rev) => (
              <div
                key={rev._id}
                className="p-5 rounded-2xl border border-neutral-900 bg-neutral-900/40 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-bold text-sm text-white">{rev.user?.name || "Traveler"}</span>
                    <div className="flex items-center gap-0.5 text-amber-400 font-bold text-xs">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < rev.rating ? "text-amber-400 fill-amber-400" : "text-neutral-700"
                          }`}
                        />
                      ))}
                      <span className="ml-1">{rev.rating}.0</span>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-300 leading-relaxed bg-black/40 p-3 rounded-xl border border-neutral-800/80">
                    "{rev.message}"
                  </p>

                  {rev.ownerReply?.message && (
                    <div className="mt-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs">
                      <div className="flex items-center justify-between text-[10px] text-emerald-400 font-bold mb-1">
                        <span>Your Public Response:</span>
                        <span className="text-neutral-500">
                          {new Date(rev.ownerReply.repliedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-neutral-200">"{rev.ownerReply.message}"</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-neutral-800 text-[11px]">
                  <span className="text-neutral-500">{new Date(rev.createdAt).toLocaleDateString()}</span>
                  <button
                    onClick={() => {
                      setSelectedReview(rev);
                      setReplyText(rev.ownerReply?.message || "");
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 font-semibold flex items-center gap-1 transition"
                  >
                    <Reply className="h-3.5 w-3.5" />
                    {rev.ownerReply?.message ? "Edit Reply" : "Reply to Guest"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reply Modal */}
        {selectedReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-4">
              <h3 className="text-sm font-bold text-white">
                Respond to {selectedReview.user?.name || "Customer"}'s Review
              </h3>
              <p className="text-xs text-neutral-400 italic">"{selectedReview.message}"</p>

              <form onSubmit={handleSendReply} className="space-y-3 text-xs">
                <div>
                  <label className="text-neutral-300 block mb-1">Your Professional Response</label>
                  <textarea
                    rows={4}
                    required
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="e.g., Thank you for dining with us! We appreciate your kind words and look forward to welcoming you back."
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedReview(null)}
                    className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-xl font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold flex items-center gap-1 shadow-lg shadow-emerald-600/20"
                  >
                    <Send className="h-3.5 w-3.5" />
                    {isSubmitting ? "Posting..." : "Publish Response"}
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

export default FeedbackPage;

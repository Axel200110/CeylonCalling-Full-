import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Star, MessageSquare, Send, User, CheckCircle2, AlertCircle } from "lucide-react";
import { useSiteUserAuthStore } from "../../store/siteUserAuthStore";
import { formatRating } from "../../utils/formatters";

export default function RestaurantReviews({ shopId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const { user, isAuthenticated } = useSiteUserAuthStore();

  const fetchComments = async () => {
    if (!shopId) return;
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/comments/shop/${shopId}`);
      setComments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [shopId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSubmitting(true);
    setFeedback(null);
    try {
      await axios.post(
        "http://localhost:5000/api/comments",
        {
          shopId,
          message: message.trim(),
          rating: Number(rating),
        },
        { withCredentials: true }
      );
      setMessage("");
      setFeedback({ type: "success", text: "Thank you! Your review has been posted." });
      fetchComments();
    } catch (err) {
      console.error("Error posting comment:", err);
      setFeedback({
        type: "error",
        text: err.response?.data?.error || "Failed to post review. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const averageScore = comments.length > 0
    ? (comments.reduce((acc, curr) => acc + (curr.rating || 5), 0) / comments.length).toFixed(1)
    : "4.8";

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100/90 shadow-sm space-y-8 text-slate-800">
      {/* Header & Rating Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <MessageSquare size={20} className="text-emerald-600" />
            <span>Customer Reviews & Experiences</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-light">
            Verified ratings and feedback from travellers and food lovers.
          </p>
        </div>

        {/* Rating Score Card */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 px-4 py-2.5 rounded-2xl shrink-0">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black text-slate-900 leading-none">{averageScore}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">out of 5</span>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div>
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.round(Number(averageScore)) ? "fill-amber-400" : "text-slate-200"}
                />
              ))}
            </div>
            <span className="text-[11px] text-slate-500 font-semibold mt-0.5 block">
              {comments.length} {comments.length === 1 ? "review" : "reviews"}
            </span>
          </div>
        </div>
      </div>

      {/* Review Submission Form */}
      <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-100 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Write a Review
        </h4>

        {isAuthenticated ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Star selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Your Rating:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-slate-300 hover:scale-110 transition"
                  >
                    <Star
                      size={20}
                      className={
                        (hoverRating || rating) >= star
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300"
                      }
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-slate-700 ml-1">
                {rating === 5 ? "Exceptional" : rating === 4 ? "Very Good" : rating === 3 ? "Good" : "Fair"}
              </span>
            </div>

            {/* Comment input */}
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share details of your experience, favorite dishes, service quality..."
                rows={3}
                required
                className="w-full bg-white rounded-xl border border-slate-200 p-3.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-normal leading-relaxed resize-none"
              />
            </div>

            {feedback && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  feedback.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {feedback.type === "success" ? (
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle size={14} className="text-red-600 shrink-0" />
                )}
                <span>{feedback.text}</span>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting || !message.trim()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold shadow-sm transition duration-200 disabled:opacity-50"
              >
                <Send size={13} />
                <span>{submitting ? "Posting..." : "Submit Review"}</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200/80">
            <span className="text-xs text-slate-500 font-light">
              Sign in to share your rating and review for this venue.
            </span>
            <Link
              to="/user/login"
              className="px-4 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-4 pt-2">
        {loading ? (
          <div className="py-8 text-center text-xs font-semibold text-slate-400 animate-pulse">
            Loading customer reviews...
          </div>
        ) : comments.length === 0 ? (
          <div className="py-8 text-center text-xs font-light text-slate-400">
            No customer reviews yet. Be the first to leave a review!
          </div>
        ) : (
          comments.map((comment) => {
            const authorName = comment.user?.name || comment.user?.email?.split("@")[0] || "Traveler";
            const dateStr = comment.createdAt
              ? new Date(comment.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Recently";

            return (
              <div
                key={comment._id}
                className="p-4 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 transition space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center uppercase">
                      {authorName.charAt(0)}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">{authorName}</span>
                      <span className="text-[10px] text-slate-400">{dateStr}</span>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={i < (comment.rating || 5) ? "fill-amber-400" : "text-slate-200"}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-600 font-light leading-relaxed whitespace-pre-wrap pl-9">
                  {comment.message}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

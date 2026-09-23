import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Star, MessageSquare, Send, User, CheckCircle2, AlertCircle, Trash2 } from "lucide-react";
import { useSiteUserAuthStore } from "../../store/siteUserAuthStore";

export default function RestaurantReviews({ shopId, onReviewsLoaded }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const { user, isAuthenticated } = useSiteUserAuthStore();

  const fetchComments = async () => {
    if (!shopId) return;
    setLoading(true);
    try {
      const res = await axios.get(`/api/comments/shop/${shopId}`);
      const list = Array.isArray(res.data) ? res.data : [];
      setComments(list);

      if (onReviewsLoaded) {
        const count = list.length;
        const avg = count > 0
          ? (list.reduce((sum, c) => sum + (Number(c.rating) || 5), 0) / count).toFixed(1)
          : null;
        onReviewsLoaded({ count, average: avg });
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
      setComments([]);
      if (onReviewsLoaded) onReviewsLoaded({ count: 0, average: null });
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
        "/api/comments",
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
      console.error("Error posting review:", err);
      setFeedback({
        type: "error",
        text: err.response?.data?.error || "Failed to post review. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete your review?")) return;
    setDeletingId(commentId);
    try {
      await axios.delete(`/api/comments/user/${commentId}`, {
        withCredentials: true,
      });
      fetchComments();
    } catch (err) {
      console.error("Error deleting review:", err);
      alert(err.response?.data?.error || "Failed to delete review.");
    } finally {
      setDeletingId(null);
    }
  };

  const averageScore = comments.length > 0
    ? (comments.reduce((acc, curr) => acc + (Number(curr.rating) || 5), 0) / comments.length).toFixed(1)
    : null;

  return (
    <section className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-6 text-slate-800">
      {/* 1. Header & Rating Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <MessageSquare size={18} className="text-emerald-600 shrink-0" />
            <span>Customer Reviews</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified ratings and feedback from travellers and food lovers.
          </p>
        </div>

        {/* Rating Score Card (Only rendered with real score if reviews exist) */}
        {averageScore ? (
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 px-4 py-2 rounded-xl shrink-0">
            <div className="flex flex-col items-center">
              <span className="text-xl sm:text-2xl font-black text-slate-900 leading-none">
                {averageScore}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                out of 5
              </span>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div>
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    className={i < Math.round(Number(averageScore)) ? "fill-amber-400 text-amber-400" : "text-slate-200"}
                  />
                ))}
              </div>
              <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">
                {comments.length} {comments.length === 1 ? "review" : "reviews"}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-400 font-normal">
            No reviews yet
          </div>
        )}
      </div>

      {/* 2. Review Submission Area */}
      <div className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200/70 space-y-3.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Write a Review
        </h4>

        {isAuthenticated ? (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Star selector */}
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-medium text-slate-600">Your Rating:</span>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-slate-300 hover:scale-110 transition"
                    aria-label={`Rate ${star} stars`}
                  >
                    <Star
                      size={18}
                      className={
                        (hoverRating || rating) >= star
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300"
                      }
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-semibold text-slate-700 ml-1">
                {rating === 5 ? "Exceptional" : rating === 4 ? "Very Good" : rating === 3 ? "Good" : rating === 2 ? "Fair" : "Poor"}
              </span>
            </div>

            {/* Comment input */}
            <div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                maxLength={500}
                placeholder="Share your experience, food quality, ambience or service..."
                className="w-full p-3 rounded-lg border border-slate-200 bg-white text-xs font-normal text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none shadow-2xs"
                required
              />
              <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                <span>Maximum 500 characters</span>
                <span>{message.length}/500</span>
              </div>
            </div>

            {/* Feedback alert */}
            {feedback && (
              <div
                className={`p-2.5 rounded-lg text-xs flex items-center gap-2 ${
                  feedback.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-rose-50 text-rose-800 border border-rose-200"
                }`}
              >
                {feedback.type === "success" ? (
                  <CheckCircle2 size={14} className="shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle size={14} className="shrink-0 text-rose-600" />
                )}
                <span>{feedback.text}</span>
              </div>
            )}

            {/* Submit button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting || !message.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 disabled:pointer-events-none text-white text-xs font-semibold shadow-xs transition"
              >
                <Send size={13} />
                <span>{submitting ? "Posting..." : "Post Review"}</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg bg-white border border-slate-200/80">
            <span className="text-xs text-slate-600 font-normal">
              Sign in to share your rating and experience with this venue.
            </span>
            <Link
              to="/user/login"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition shadow-2xs shrink-0"
            >
              Sign In to Review
            </Link>
          </div>
        )}
      </div>

      {/* 3. Reviews List */}
      <div className="space-y-3.5 pt-1">
        {loading ? (
          <div className="py-6 text-center text-xs font-medium text-slate-400 animate-pulse">
            Loading verified reviews...
          </div>
        ) : comments.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-500">
            No customer reviews yet. Be the first traveler to share your experience!
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
                className="p-4 rounded-xl bg-white border border-slate-200/80 hover:border-slate-300 transition space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center uppercase shrink-0">
                      {authorName.charAt(0)}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block leading-tight">{authorName}</span>
                      <span className="text-[11px] text-slate-400 font-normal">{dateStr}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {/* Rating Stars */}
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={i < (comment.rating || 5) ? "fill-amber-400 text-amber-400" : "text-slate-200"}
                        />
                      ))}
                    </div>

                    {/* Delete button for review author */}
                    {user?._id && (comment.user?._id === user._id || comment.user === user._id) && (
                      <button
                        type="button"
                        onClick={() => handleDeleteComment(comment._id)}
                        disabled={deletingId === comment._id}
                        className="text-slate-400 hover:text-rose-600 transition p-1 rounded hover:bg-slate-100"
                        title="Delete your review"
                        aria-label="Delete your review"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Review Message safely rendered */}
                <p className="text-xs text-slate-700 font-normal leading-relaxed whitespace-pre-wrap pl-9">
                  {comment.message}
                </p>

                {/* Host Response if available */}
                {comment.ownerReply?.message && (
                  <div className="ml-9 mt-2 p-3 rounded-lg bg-emerald-50/60 border border-emerald-100 text-xs space-y-1">
                    <div className="flex items-center justify-between text-emerald-800 font-semibold text-[11px]">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 size={12} className="text-emerald-600" />
                        Response from Venue Host
                      </span>
                      {comment.ownerReply.repliedAt && (
                        <span className="text-[10px] text-emerald-600 font-normal">
                          {new Date(comment.ownerReply.repliedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-700 font-normal leading-relaxed">
                      {comment.ownerReply.message}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

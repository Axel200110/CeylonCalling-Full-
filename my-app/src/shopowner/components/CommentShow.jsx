import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  AiFillStar,
  AiOutlineDislike,
  AiOutlineFilter,
  AiOutlineLike,
  AiOutlinePlus,
  AiOutlineSearch
} from "react-icons/ai";
import { BiSortAlt2, BiTrendingUp } from "react-icons/bi";
import { FiMessageSquare, FiShieldCheck, FiX } from "react-icons/fi";
import { useAuthStore } from "../store/authStore"; // Kept for integration

// 🎨 Helper: Extract initials
function getInitials(nameOrEmail = "") {
  const parts = nameOrEmail.trim().split(/[\s@.]+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

// 🎨 Helper: Generate deterministic subtle gradient accent based on string
function stringToGradient(str = "") {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const gradients = [
    "from-indigo-500 to-purple-600",
    "from-blue-500 to-cyan-500",
    "from-emerald-500 to-teal-600",
    "from-rose-500 to-orange-500",
    "from-violet-600 to-pink-500",
  ];
  return gradients[Math.abs(hash) % gradients.length];
}

export default function ShopComments({ shopId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRating, setSelectedRating] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New review form states
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [newMessage, setNewMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { token, user } = useAuthStore ? useAuthStore() : { token: null, user: null };

  // Fetch comments
  useEffect(() => {
    if (!shopId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`/api/comments/shop/${shopId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setComments(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [shopId, token]);

  // Handle New Comment Submission
  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSubmitting(true);
    fetch(`/api/comments/shop/${shopId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        rating: newRating,
        message: newMessage,
      }),
    })
      .then((res) => res.json())
      .then((addedComment) => {
        setComments((prev) => [addedComment, ...prev]);
        setNewMessage("");
        setNewRating(5);
        setIsModalOpen(false);
        setSubmitting(false);
      })
      .catch(() => setSubmitting(false));
  };

  // 📊 Calculate Analytics
  const metrics = useMemo(() => {
    const total = comments.length;
    if (total === 0)
      return {
        avg: "0.0",
        total: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        recommendRate: 0,
      };

    const sum = comments.reduce((acc, c) => acc + (c.rating || 0), 0);
    const avg = (sum / total).toFixed(1);

    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    comments.forEach((c) => {
      if (dist[c.rating] !== undefined) dist[c.rating]++;
    });

    const positiveCount = dist[5] + dist[4];
    const recommendRate = Math.round((positiveCount / total) * 100);

    return { avg, total, distribution: dist, recommendRate };
  }, [comments]);

  // 🔍 Filter & Sort
  const filteredComments = useMemo(() => {
    return comments
      .filter((c) => {
        const userName = c.user?.name || c.user?.email || "Anonymous";
        const matchesSearch =
          userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (c.message && c.message.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesRating =
          selectedRating === "all" || c.rating === parseInt(selectedRating);

        return matchesSearch && matchesRating;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        if (sortBy === "oldest") {
          return new Date(a.createdAt) - new Date(b.createdAt);
        }
        if (sortBy === "highest") {
          return b.rating - a.rating;
        }
        if (sortBy === "lowest") {
          return a.rating - b.rating;
        }
        return 0;
      });
  }, [comments, searchQuery, selectedRating, sortBy]);

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 antialiased font-sans px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-10 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-2">
              <FiShieldCheck className="text-base" /> Verified Feedback Hub
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Customer Insights & Reviews
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
              Transparent, real-time performance ratings and client feedback gathered across all verified user touchpoints.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <AiOutlinePlus className="text-lg" />
            Write a Review
          </button>
        </div>

        {/* Analytics Breakdown Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Rating Summary Card */}
          <div className="md:col-span-5 lg:col-span-4 p-6 sm:p-8 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-2xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
            <div>
              <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
                Overall Score
              </span>
              <div className="flex items-baseline gap-3 mt-3">
                <span className="text-5xl font-black tracking-tight text-white">
                  {metrics.avg}
                </span>
                <span className="text-slate-400 text-sm">out of 5.0</span>
              </div>

              <div className="flex gap-1 text-amber-400 text-lg my-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <AiFillStar
                    key={star}
                    className={
                      star <= Math.round(metrics.avg)
                        ? "text-amber-400"
                        : "text-slate-700"
                    }
                  />
                ))}
              </div>

              <p className="text-xs text-slate-400 mt-1">
                Based on <span className="font-semibold text-slate-200">{metrics.total}</span> total verified responses
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/[0.06]">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <BiTrendingUp className="text-emerald-400 text-base" /> Satisfaction Rate
                </span>
                <span className="font-bold text-emerald-400">
                  {metrics.recommendRate}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000"
                  style={{ width: `${metrics.recommendRate}%` }}
                />
              </div>
            </div>
          </div>

          {/* Rating Distribution Bar Chart */}
          <div className="md:col-span-7 lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-2xl flex flex-col justify-center">
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-4">
              Rating Breakdown
            </span>

            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = metrics.distribution[stars] || 0;
                const percentage =
                  metrics.total > 0 ? Math.round((count / metrics.total) * 100) : 0;

                return (
                  <div key={stars} className="flex items-center gap-3 text-xs sm:text-sm">
                    <span className="w-12 font-medium text-slate-300 flex items-center gap-1">
                      {stars} <AiFillStar className="text-amber-400 text-xs" />
                    </span>

                    <div className="flex-1 h-2 bg-slate-800/80 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"
                      />
                    </div>

                    <span className="w-12 text-right text-slate-400 font-mono">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Toolbar: Search, Filter & Sort */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 rounded-2xl bg-white/[0.02] backdrop-blur-lg border border-white/[0.06]">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <AiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900/60 border border-white/[0.08] rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/60 transition-all"
            />
          </div>

          {/* Filters Group */}
          <div className="flex flex-wrap items-center justify-end gap-3 w-full sm:w-auto">
            {/* Filter by Stars */}
            <div className="flex items-center gap-2 bg-slate-900/60 border border-white/[0.08] rounded-xl px-3 py-1.5">
              <AiOutlineFilter className="text-slate-400 text-sm" />
              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                className="bg-transparent text-xs sm:text-sm text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-slate-900 text-slate-200">All Stars</option>
                <option value="5" className="bg-slate-900 text-slate-200">5 Stars</option>
                <option value="4" className="bg-slate-900 text-slate-200">4 Stars</option>
                <option value="3" className="bg-slate-900 text-slate-200">3 Stars</option>
                <option value="2" className="bg-slate-900 text-slate-200">2 Stars</option>
                <option value="1" className="bg-slate-900 text-slate-200">1 Star</option>
              </select>
            </div>

            {/* Sort Order */}
            <div className="flex items-center gap-2 bg-slate-900/60 border border-white/[0.08] rounded-xl px-3 py-1.5">
              <BiSortAlt2 className="text-slate-400 text-base" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs sm:text-sm text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="newest" className="bg-slate-900 text-slate-200">Newest First</option>
                <option value="oldest" className="bg-slate-900 text-slate-200">Oldest First</option>
                <option value="highest" className="bg-slate-900 text-slate-200">Highest Rating</option>
                <option value="lowest" className="bg-slate-900 text-slate-200">Lowest Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Feed Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            <p className="text-xs text-slate-400 mt-4 tracking-wider">Syncing reviews...</p>
          </div>
        ) : filteredComments.length === 0 ? (
          <div className="text-center py-20 px-4 rounded-3xl bg-white/[0.02] border border-white/[0.06]">
            <FiMessageSquare className="mx-auto text-4xl text-slate-600 mb-3" />
            <h3 className="text-lg font-medium text-slate-300">No reviews found</h3>
            <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto">
              We couldn't find any feedback matching your current filters. Try resetting your search query.
            </p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="space-y-4">
              {filteredComments.map((c) => {
                const userName = c.user?.name || c.user?.email || "Anonymous";
                const initials = getInitials(userName);
                const gradientClass = stringToGradient(userName);

                return (
                  <motion.div
                    key={c._id || Math.random()}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] hover:border-white/[0.15] shadow-xl hover:shadow-2xl transition-all relative group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* User Info Header */}
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${gradientClass} flex items-center justify-center text-white font-bold text-sm shadow-inner`}
                        >
                          {initials}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm sm:text-base font-semibold text-slate-100">
                              {userName}
                            </h4>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                              Verified Client
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {new Date(c.createdAt || Date.now()).toLocaleString(
                              undefined,
                              { dateStyle: "medium", timeStyle: "short" }
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Star Rating Badge */}
                      <div className="flex items-center gap-1 bg-slate-900/60 px-2.5 py-1 rounded-xl border border-white/[0.06]">
                        <AiFillStar className="text-amber-400 text-sm" />
                        <span className="text-xs font-semibold text-slate-200">
                          {c.rating}.0
                        </span>
                      </div>
                    </div>

                    {/* Review Message */}
                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed mt-4 whitespace-pre-wrap">
                      {c.message}
                    </p>

                    {/* Interactive Feedback Footer */}
                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/[0.04] text-xs text-slate-500">
                      <span>Was this review helpful?</span>
                      <div className="flex items-center gap-3">
                        <button className="flex items-center gap-1 hover:text-slate-300 transition-colors">
                          <AiOutlineLike className="text-sm" /> Helpful
                        </button>
                        <button className="flex items-center gap-1 hover:text-slate-300 transition-colors">
                          <AiOutlineDislike className="text-sm" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        )}
      </div>

      {/* Modal: Add Review */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-[#0D121F] border border-white/[0.12] shadow-2xl z-10"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <h3 className="text-lg font-bold text-white">Write a Review</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all"
                >
                  <FiX className="text-lg" />
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="mt-6 space-y-5">
                {/* Rating Input */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Your Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setNewRating(star)}
                        className="p-1 transition-transform hover:scale-110 focus:outline-none"
                      >
                        <AiFillStar
                          className={`text-2xl ${
                            star <= (hoverRating || newRating)
                              ? "text-amber-400"
                              : "text-slate-700"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs text-slate-400 font-medium ml-2">
                      {hoverRating || newRating} of 5 Stars
                    </span>
                  </div>
                </div>

                {/* Review Message Input */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Your Feedback
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Share your detailed experience with this shop..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="w-full p-4 bg-slate-900/80 border border-white/[0.08] rounded-2xl text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-white/[0.08] text-slate-300 hover:bg-white/[0.04] text-xs font-semibold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !newMessage.trim()}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 disabled:opacity-50 transition-all"
                  >
                    {submitting ? "Submitting..." : "Publish Review"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
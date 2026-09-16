import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  FaChartLine,
  FaCommentDots,
  FaExclamationTriangle,
  FaFilter,
  FaHeart,
  FaRegStar,
  FaSearch,
  FaStar,
  FaStore,
  FaTrash,
  FaUser
} from "react-icons/fa";
import { toast } from "react-toastify";

// Helper for dynamic user avatar initial colors
function getGradientByName(name = "") {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
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

const ShopStats = ({ shopId, isShopOwner = false }) => {
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);

  // Dashboard Filters & Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [starFilter, setStarFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    if (!shopId) return;

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const [likesRes, commentsRes] = await Promise.all([
          fetch(`/api/shops/${shopId}/likes/count`, {
            credentials: "include",
          }),
          fetch(`/api/comments/shop/${shopId}`, {
            credentials: "include",
          }),
        ]);

        if (!likesRes.ok) throw new Error("Failed to fetch likes analytics");
        if (!commentsRes.ok) throw new Error("Failed to fetch shop comments");

        const likesData = await likesRes.json();
        const commentsData = await commentsRes.json();

        if (likesData.success && likesData.data) {
          setLikeCount(likesData.data.likeCount);
        }

        setComments(Array.isArray(commentsData) ? commentsData : []);
      } catch (err) {
        console.error("Error fetching shop stats:", err);
        setError(err.message);
        toast.error("Failed to load shop metrics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [shopId]);

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this customer review?")) return;

    try {
      setDeletingId(commentId);
      const res = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete review");
      }

      setComments((prev) => prev.filter((c) => c._id !== commentId));
      toast.success("Review deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.message || "Failed to delete review");
    } finally {
      setDeletingId(null);
    }
  };

  // Analytics Computation
  const statsSummary = useMemo(() => {
    const total = comments.length;
    if (total === 0) return { avgRating: "0.0", positivePct: 0, ratingDist: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };

    const sum = comments.reduce((acc, c) => acc + (c.rating || 0), 0);
    const avg = (sum / total).toFixed(1);

    const ratingDist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    comments.forEach((c) => {
      if (c.rating && ratingDist[c.rating] !== undefined) {
        ratingDist[c.rating]++;
      }
    });

    const positiveCount = (ratingDist[5] || 0) + (ratingDist[4] || 0);
    const positivePct = Math.round((positiveCount / total) * 100);

    return { avgRating: avg, positivePct, ratingDist };
  }, [comments]);

  // Filtered and Sorted Comments
  const filteredComments = useMemo(() => {
    return comments
      .filter((c) => {
        const userName = c.user?.name || "Anonymous";
        const matchesQuery =
          userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (c.message && c.message.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesStar =
          starFilter === "all" || c.rating === parseInt(starFilter, 10);

        return matchesQuery && matchesStar;
      })
      .sort((a, b) => {
        if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
        if (sortBy === "highest") return (b.rating || 0) - (a.rating || 0);
        if (sortBy === "lowest") return (a.rating || 0) - (b.rating || 0);
        return 0;
      });
  }, [comments, searchQuery, starFilter, sortBy]);

  const renderStars = (rating = 0) => {
    return (
      <div className="flex items-center gap-1 text-amber-400">
        {Array.from({ length: 5 }, (_, i) =>
          i < rating ? (
            <FaStar key={i} className="text-xs" />
          ) : (
            <FaRegStar key={i} className="text-slate-700 text-xs" />
          )
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col justify-center items-center py-12">
        <div className="relative w-12 h-12">
          <div className="absolute top-0 left-0 w-full h-full border-2 border-indigo-500/20 rounded-full" />
          <div className="absolute top-0 left-0 w-full h-full border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-xs font-mono uppercase text-slate-400 mt-4 tracking-wider">
          Syncing Store Metrics...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto my-8 p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 backdrop-blur-xl">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-rose-500/20 text-rose-400">
            <FaExclamationTriangle className="text-xl" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-rose-200">System Error</h4>
            <p className="text-xs text-rose-300/80 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 antialiased font-sans px-4 sm:px-6 lg:px-8 py-10 relative overflow-hidden">
      {/* Background Lighting Halos */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-1">
              <FaStore className="text-sm" /> Store Intelligence Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Shop Analytics & Feedback
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Real-time engagement, rating analytics, and client sentiment breakdown.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isShopOwner && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Store Admin Mode
              </span>
            )}
          </div>
        </div>

        {/* Executive Key Performance Indicators Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Total Likes KPI */}
          <div className="p-6 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-2xl relative overflow-hidden group hover:border-white/[0.15] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Store Appreciation
              </span>
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 group-hover:scale-110 transition-transform">
                <FaHeart className="text-base" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-4xl font-extrabold text-white tracking-tight">
                {likeCount.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400 ml-2">Total Likes</span>
            </div>
            <div className="mt-3 text-[11px] text-slate-500 flex items-center gap-1">
              <FaChartLine className="text-emerald-400" /> Dynamic customer engagement
            </div>
          </div>

          {/* Total Reviews KPI */}
          <div className="p-6 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-2xl relative overflow-hidden group hover:border-white/[0.15] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Total Reviews
              </span>
              <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform">
                <FaCommentDots className="text-base" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-4xl font-extrabold text-white tracking-tight">
                {comments.length.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400 ml-2">Submissions</span>
            </div>
            <div className="mt-3 text-[11px] text-slate-500">
              <span className="text-indigo-400 font-semibold">{statsSummary.positivePct}%</span> positive sentiment score
            </div>
          </div>

          {/* Rating Average KPI */}
          <div className="p-6 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-2xl relative overflow-hidden group hover:border-white/[0.15] transition-all sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Average Rating
              </span>
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform">
                <FaStar className="text-base" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-white tracking-tight">
                {statsSummary.avgRating}
              </span>
              <span className="text-xs text-slate-400">/ 5.0 Rating</span>
            </div>
            <div className="mt-3 flex items-center gap-1">
              {renderStars(Math.round(parseFloat(statsSummary.avgRating)))}
            </div>
          </div>
        </div>

        {/* Filter and Control Bar */}
        <div className="p-3 rounded-2xl bg-white/[0.02] backdrop-blur-md border border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Field */}
          <div className="relative w-full sm:w-72">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
            <input
              type="text"
              placeholder="Search comments or users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/80 border border-white/[0.08] text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>

          {/* Filtering dropdowns */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/[0.08]">
              <FaFilter className="text-slate-500 text-xs" />
              <select
                value={starFilter}
                onChange={(e) => setStarFilter(e.target.value)}
                className="bg-transparent text-xs text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-slate-900">All Ratings</option>
                <option value="5" className="bg-slate-900">5 Stars</option>
                <option value="4" className="bg-slate-900">4 Stars</option>
                <option value="3" className="bg-slate-900">3 Stars</option>
                <option value="2" className="bg-slate-900">2 Stars</option>
                <option value="1" className="bg-slate-900">1 Star</option>
              </select>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/[0.08]">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="newest" className="bg-slate-900">Newest First</option>
                <option value="oldest" className="bg-slate-900">Oldest First</option>
                <option value="highest" className="bg-slate-900">Highest Rated</option>
                <option value="lowest" className="bg-slate-900">Lowest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Customer Comments Feed */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredComments.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16 rounded-3xl bg-white/[0.02] border border-white/[0.06] p-6"
              >
                <FaCommentDots className="mx-auto text-3xl text-slate-600 mb-3" />
                <p className="text-sm font-medium text-slate-300">No reviews match your filter criteria</p>
                <p className="text-xs text-slate-500 mt-1">
                  Try adjusting your search query or rating filter settings.
                </p>
              </motion.div>
            ) : (
              filteredComments.map((comment) => {
                const userName = comment.user?.name || "Anonymous";
                const gradient = getGradientByName(userName);

                return (
                  <motion.div
                    key={comment._id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="p-5 sm:p-6 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] hover:border-white/[0.15] shadow-xl transition-all relative group"
                  >
                    {/* Delete action button for Shop Owner */}
                    {isShopOwner && (
                      <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDeleteComment(comment._id)}
                        disabled={deletingId === comment._id}
                        className="absolute top-5 right-5 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-colors"
                        title="Delete customer comment"
                      >
                        {deletingId === comment._id ? (
                          <div className="w-3.5 h-3.5 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <FaTrash className="text-xs" />
                        )}
                      </motion.button>
                    )}

                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div
                        className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${gradient} flex items-center justify-center text-white font-bold text-xs shadow-inner flex-shrink-0`}
                      >
                        {comment.user?.name ? (
                          comment.user.name.charAt(0).toUpperCase()
                        ) : (
                          <FaUser className="text-xs" />
                        )}
                      </div>

                      {/* Comment Body */}
                      <div className="flex-1 min-w-0 pr-8">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                          <h4 className="text-sm font-semibold text-slate-100 truncate">
                            {userName}
                          </h4>

                          <div className="flex items-center gap-2">
                            {renderStars(comment.rating)}
                            <span className="text-[11px] font-mono text-slate-500">
                              {format(new Date(comment.createdAt), "MMM d, yyyy")}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                          {comment.message}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ShopStats;
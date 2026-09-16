import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
    FaClock,
    FaDirections,
    FaHeart,
    FaInfoCircle,
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaRegHeart,
    FaUtensils,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function RestaurantCard({ shop, categories = [], currentUserId, onViewMenu }) {
  const navigate = useNavigate();
  const mainImage = shop.photo ? `http://localhost:5000${shop.photo}` : "/default-shop.jpg";

  // Check if current user has liked this shop
  const alreadyLiked =
    currentUserId && Array.isArray(shop.likes)
      ? shop.likes.some((id) =>
          typeof id === "object" && id._id
            ? id._id === currentUserId
            : id === currentUserId
        )
      : false;

  const [liked, setLiked] = useState(alreadyLiked);
  const [likeCount, setLikeCount] = useState(shop.likeCount || 0);
  const [likeLoading, setLikeLoading] = useState(false);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [likesList, setLikesList] = useState([]);
  const [loadingLikes, setLoadingLikes] = useState(false);

  const handleLike = async () => {
    if (!currentUserId) {
      navigate("/user/login");
      return;
    }
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      const res = await axios.post(
        `http://localhost:5000/api/shops/${shop._id}/like`,
        {},
        { withCredentials: true }
      );
      setLiked(res.data.data.liked);
      setLikeCount(res.data.data.likeCount);
    } catch (error) {
      console.error("Error liking shop:", error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLikeLoading(false);
    }
  };

  const fetchLikes = async () => {
    if (likeCount === 0) return;
    
    setLoadingLikes(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/shops/${shop._id}/likes`,
        { withCredentials: true }
      );
      setLikesList(response.data.data.likes);
      setShowLikesModal(true);
    } catch (error) {
      console.error("Error fetching likes:", error);
    } finally {
      setLoadingLikes(false);
    }
  };

  return (
    <motion.article
      className="max-w-md bg-gradient-to-b from-white to-slate-50 rounded-2xl shadow-md mx-auto my-6 overflow-hidden cursor-default select-none transition-transform duration-300 hover:scale-[1.01]"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.36 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Shop Header */}
      <header className="flex items-center gap-4 p-4">
        <div className="w-14 h-14 rounded-full overflow-hidden border border-slate-100 shadow-sm">
          <img
            src={mainImage}
            alt={shop.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex flex-col overflow-hidden">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{shop.name}</h3>
          <span className="text-xs text-gray-500 flex items-center gap-1 truncate">
            <FaMapMarkerAlt className="inline text-green-500" />
            {shop.location || "Location not provided"}
          </span>
        </div>
      </header>

      {/* Main Shop Image */}
      <div className="relative group">
        <img
          src={mainImage}
          alt={shop.name}
          className="w-full h-48 sm:h-64 object-cover rounded-b-2xl"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300 rounded-b-2xl" />
      </div>

      {/* Shop Details */}
      <div className="p-4 space-y-3">
        {/* Shop Info */}
        <div className="flex flex-wrap gap-3 text-gray-600 text-sm">
          <span className="flex items-center">
            <FaClock className="mr-1 text-purple-500" />
            {shop.activeTime || "9 AM - 10 PM"}
          </span>
          <span className="flex items-center">
            <FaPhoneAlt className="mr-1 text-green-500" />
            {shop.contact || "+94 77 123 4567"}
          </span>
        </div>

        {/* Shop Description */}
        <div className="flex items-start text-gray-600 text-sm">
          <FaInfoCircle className="mr-2 mt-0.5 text-blue-500" />
          <p className="line-clamp-3">{shop.description || "No description available."}</p>
        </div>

        {/* Price Range */}
        {shop.priceRange && (
          <div className="text-sm text-gray-600">
            Price range: {shop.priceRange}
          </div>
        )}

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <span
                key={cat._id}
                className="text-slate-700 text-xs font-semibold px-3 py-1 border border-slate-100 rounded-full cursor-default select-none bg-white/60"
              >
                {cat.name}
              </span>
            ))
          ) : (
            <span className="text-slate-400 text-xs px-3 py-1 rounded-full select-none border border-slate-100">
              No categories
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <footer className="flex flex-col sm:flex-row items-center sm:justify-between px-4 py-3 border-t border-slate-100 bg-white gap-3">
        {/* Like Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleLike}
            disabled={likeLoading}
            aria-pressed={liked}
            aria-label={liked ? "Unlike this shop" : "Like this shop"}
            className={`flex items-center gap-2 text-pink-500 hover:text-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-300 rounded transition ${
              likeLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <motion.span
              animate={{
                scale: liked ? [1, 1.3, 1] : 1,
                color: liked ? "#EC4899" : "#9CA3AF",
              }}
              transition={{ duration: 0.3 }}
              className="text-xl text-pink-500"
            >
              {liked ? <FaHeart /> : <FaRegHeart />}
            </motion.span>
          </button>

          <button
            onClick={fetchLikes}
            disabled={likeCount === 0}
            className={`text-sm font-medium ${
              likeCount > 0 ? "text-pink-500 hover:text-pink-600" : "text-pink-500"
            }`}
          >
            {likeCount} {likeCount === 1 ? "like" : "likes"}
          </button>
        </div>

        {/* Directions Button */}
        <button
          type="button"
          className="flex w-full sm:w-auto items-center justify-center gap-1 text-gray-700 hover:text-gray-900 transition px-2 py-2 sm:px-2 sm:py-1"
        >
          <FaDirections className="text-lg" />
          <span className="text-sm font-medium hidden sm:inline">Directions</span>
        </button>

        {/* View Menu Button */}
        <button
          type="button"
          onClick={() => navigate(`/foodpage/${shop._id}`)} 
          className="flex w-full sm:w-auto items-center justify-center gap-1 text-gray-700 hover:text-blue-600 transition px-2 py-2 sm:px-2 sm:py-1"
        >
          <FaUtensils className="text-lg text-blue-500" />
          <span className="text-sm font-medium hidden sm:inline">View Menu</span>
        </button>
      </footer>

      {/* Likes Modal */}
      <AnimatePresence>
        {showLikesModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLikesModal(false)}
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[70vh] overflow-hidden"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="border-b border-gray-200 p-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold">Likes</h3>
                <button
                  className="text-gray-500 hover:text-gray-700 text-xl"
                  onClick={() => setShowLikesModal(false)}
                  aria-label="Close likes modal"
                >
                  &times;
                </button>
              </div>

              <div className="overflow-y-auto max-h-[60vh]">
                {loadingLikes ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500"></div>
                  </div>
                ) : likesList.length === 0 ? (
                  <p className="text-center py-8 text-pink-500 hover:text-pink-600">No likes yet</p>
                ) : (
                  <ul>
                    {likesList.map((user) => (
                      <li
                        key={user._id}
                        className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                        onClick={() => navigate(`/user/${user._id}`)}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={user.profilePicture || "/default-user.jpg"}
                            alt={user.username}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium">{user.username}</p>
                            {user.bio && (
                              <p className="text-xs text-gray-500 truncate">{user.bio}</p>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

export default RestaurantCard;
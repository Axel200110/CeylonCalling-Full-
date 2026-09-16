import axios from "axios";
import { motion } from "framer-motion";
import { useState } from "react";
import {
    FaDirections,
    FaHeart,
    FaInfoCircle,
    FaMapMarkerAlt,
    FaRegHeart,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function PlaceCard({ place, categories = [], currentUserId }) {
  const navigate = useNavigate();
  const mainImage = place.images?.length > 0 ? place.images[0] : "/default-place.jpg";

  const alreadyLiked =
    currentUserId && Array.isArray(place.likes)
      ? place.likes.some((id) =>
          typeof id === "object" && id._id
            ? id._id === currentUserId
            : id === currentUserId
        )
      : false;

  const [liked, setLiked] = useState(alreadyLiked);
  const [likeCount, setLikeCount] = useState(place.likeCount || 0);
  const [likeLoading, setLikeLoading] = useState(false);

  const handleLike = async () => {
    if (!currentUserId) {
      navigate("/user/login");
      return;
    }
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      const res = await axios.post(`/api/place/${place._id}/like`, {}, { withCredentials: true });
      setLiked(res.data.data.liked);
      setLikeCount(res.data.data.likeCount);
    } catch (e) {
      console.error("Like error:", e);
    } finally {
      setLikeLoading(false);
    }
  };

  return (
    <motion.article
      className="max-w-md md:max-w-lg bg-gradient-to-b from-white to-slate-50 rounded-2xl shadow-md mx-auto my-6 overflow-hidden cursor-default select-none transition-transform duration-300 hover:scale-[1.01]"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
      role="region"
      aria-label={`Place card for ${place.title}`}
    >
      {/* Header */}
      <header className="flex items-center gap-4 p-5">
        <div className="w-16 h-16 rounded-full overflow-hidden border border-slate-100 shadow-sm flex-shrink-0">
          <img
            src={mainImage.startsWith("/uploads/") ? `http://localhost:5000${mainImage}` : mainImage}
            alt={place.title}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="flex flex-col overflow-hidden">
          <h3 className="text-xl font-semibold text-gray-900 truncate">{place.title}</h3>
          <span className="text-sm text-gray-500 flex items-center gap-1 truncate">
            <FaMapMarkerAlt className="inline text-pink-500" aria-hidden="true" />
            {place.location || "Unknown location"}
          </span>
        </div>
      </header>

      {/* Main Image */}
      <div className="relative group">
        <img
          src={mainImage.startsWith("/uploads/") ? `http://localhost:5000${mainImage}` : mainImage}
          alt={place.title}
          className="w-full h-40 sm:h-64 object-cover rounded-b-2xl"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300 rounded-b-2xl" />
      </div>

      {/* Description & Categories */}
      <div className="p-5 space-y-4">
        <p className="text-slate-700 text-sm line-clamp-3">
          {place.description || "No description available."}
        </p>
        <div className="flex flex-wrap gap-2">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <span
                key={cat._id}
                className="text-slate-700 text-xs font-semibold px-3 py-1 border border-slate-100 rounded-full select-none bg-white/60"
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

      {/* Footer */}
      <footer className="flex flex-col sm:flex-row items-center sm:justify-between px-5 py-4 border-t border-slate-100 bg-white gap-3">
        {/* Like Button */}
          <button
          onClick={handleLike}
          aria-pressed={liked}
          aria-label={liked ? "Unlike this place" : "Like this place"}
          className={`flex items-center gap-2 text-pink-500 hover:text-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-300 rounded transition ${
            likeLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={likeLoading}
        >
          <motion.span
            animate={{ scale: liked ? [1, 1.3, 1] : 1 }}
            transition={{ duration: 0.3 }}
            className="text-2xl"
          >
            {liked ? <FaHeart /> : <FaRegHeart />}
          </motion.span>
          <span className="text-sm font-medium select-none">
            {likeCount} {likeCount === 1 ? "like" : "likes"}
          </span>
          </button>

        {/* Directions */}
        <button
          type="button"
          className="flex w-full sm:w-auto items-center justify-center gap-1 text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded transition px-2 py-2 sm:px-2 sm:py-1"
          aria-label="Get directions"
        >
          <FaDirections className="text-lg" />
          <span className="hidden sm:inline font-medium text-sm">Directions</span>
        </button>

        {/* Details */}
        <button
          type="button"
          onClick={() => navigate(`/places/${place._id}`)}
          className="flex w-full sm:w-auto items-center justify-center gap-1 text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded transition px-2 py-2 sm:px-2 sm:py-1"
          aria-label={`View details for ${place.title}`}
        >
          <FaInfoCircle className="text-lg" />
          <span className="hidden sm:inline font-medium text-sm">Details</span>
        </button>
      </footer>
    </motion.article>
  );
}

export default PlaceCard;

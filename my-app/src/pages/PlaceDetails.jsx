import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaHeart,
  FaRegHeart,
  FaMapMarkerAlt,
  FaUser,
  FaComment,
  FaArrowLeft,
} from "react-icons/fa";
import { motion } from "framer-motion";
import CommentSection from "../components/PlaceComment";

function PlaceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentLoading, setCommentLoading] = useState(false);

  // Fetch place details & comments
  useEffect(() => {
    const fetchPlaceDetails = async () => {
      try {
        setLoading(true);
        const [placeRes, commentsRes] = await Promise.all([
          axios.get(`/api/place/${id}`),
          axios.get(`/api/placecomment/place/${id}`),
        ]);

        setPlace(placeRes.data.data);
        setLikeCount(placeRes.data.data.likeCount || 0);
        setLiked(
          placeRes.data.data.likes?.some(
            (like) => like._id === localStorage.getItem("userId")
          ) || false
        );
        setComments(commentsRes.data.data || []);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch place details");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaceDetails();
  }, [id]);

  // Like/unlike handler
  const handleLike = async () => {
    try {
      const res = await axios.post(
        `/api/place/${id}/like`,
        {},
        { withCredentials: true }
      );
      setLiked(res.data.data.liked);
      setLikeCount(res.data.data.likeCount);
    } catch (err) {
      console.error("Error liking place:", err);
    }
  };

  // Add comment handler
  const handleAddComment = async (commentText) => {
    try {
      setCommentLoading(true);
      const res = await axios.post(
        "/api/placecomment",
        { placeId: id, text: commentText },
        { withCredentials: true }
      );
      setComments((prev) => [res.data.data, ...prev]);
    } catch (err) {
      console.error("Error adding comment:", err);
    } finally {
      setCommentLoading(false);
    }
  };

  // Delete comment handler
  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`/api/placecomment/${commentId}`, {
        withCredentials: true,
      });
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-pink-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600 font-semibold text-lg bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        {error}
      </div>
    );
  }

  if (!place) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500 font-medium bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        Place not found
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 sm:p-8 md:p-12 bg-white rounded-3xl shadow-lg my-10">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-indigo-600 font-semibold mb-6 hover:text-indigo-800 transition"
        aria-label="Go back"
      >
        <FaArrowLeft className="mr-2" size={18} />
        Back
      </button>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left: Images */}
        <div className="lg:w-2/3 rounded-3xl shadow-xl overflow-hidden bg-gradient-to-tr from-pink-50 via-purple-50 to-blue-50">
          {/* Main Image */}
          <div className="relative h-96 sm:h-[28rem] md:h-[32rem] w-full rounded-3xl overflow-hidden">
            {place.images?.length > 0 ? (
              <img
                src={`${place.images[currentImageIndex]}`}
                alt={place.title}
                className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-lg font-light">
                No images available
              </div>
            )}

            {/* Image Navigation Dots */}
            {place.images?.length > 1 && (
              <div className="absolute bottom-5 left-0 right-0 flex justify-center space-x-3">
                {place.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                      currentImageIndex === idx
                        ? "bg-indigo-600 shadow-lg"
                        : "bg-white bg-opacity-50"
                    }`}
                    aria-label={`View image ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {place.images?.length > 1 && (
            <div className="flex gap-3 mt-4 overflow-x-auto px-4 py-2 scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-indigo-100 rounded-xl">
              {place.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-4 transition-all duration-300 ${
                    currentImageIndex === idx
                      ? "border-indigo-500"
                      : "border-transparent"
                  }`}
                  aria-label={`Thumbnail ${idx + 1}`}
                >
                  <img
                    src={`${img}`}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div className="lg:w-1/3 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-indigo-700 mb-4 tracking-tight">
              {place.title}
            </h1>

            {/* Location */}
            <div className="flex items-center text-indigo-500 mb-6 space-x-2 text-sm sm:text-base">
              <FaMapMarkerAlt size={18} />
              <span className="font-medium">{place.location}</span>
            </div>

            {/* Description */}
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-6">
              {place.description}
            </p>

            {/* Categories */}
            <div className="flex flex-wrap gap-3 mb-6">
              {place.categories?.map((cat) => (
                <span
                  key={cat._id}
                  className="bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-md select-none"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          </div>

          {/* Like Button & Owner Info */}
          <div>
            <div className="flex items-center mb-8 space-x-6">
              <button
                onClick={handleLike}
                aria-pressed={liked}
                aria-label={liked ? "Unlike this place" : "Like this place"}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <motion.div
                  animate={{ scale: liked ? [1, 1.3, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                  className={`text-3xl ${
                    liked ? "text-pink-500 drop-shadow-lg" : "text-gray-400"
                  }`}
                >
                  {liked ? <FaHeart /> : <FaRegHeart />}
                </motion.div>
                <span className="text-lg font-semibold text-indigo-700 select-none">
                  {likeCount} {likeCount === 1 ? "like" : "likes"}
                </span>
              </button>
            </div>

            {/* Owner Info */}
            <div className="border-t border-indigo-100 pt-6 flex items-center space-x-4">
              <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden shadow-md">
                {place.user?.profilePicture ? (
                  <img
                    src={`${place.user.profilePicture}`}
                    alt={place.user.username}
                    className="w-full h-full object-cover rounded-full"
                    loading="lazy"
                  />
                ) : (
                  <FaUser className="text-indigo-300 text-3xl" />
                )}
              </div>
              <div>
                <p className="text-indigo-700 font-semibold text-lg">
                  {place.user?.username || "Unknown"}
                </p>
                <p className="text-indigo-400 text-sm">
                  Posted on {new Date(place.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comments */}
        <div className="mt-16">
      <CommentSection placeId={id} />
      </div>
    </div>
  );
}

export default PlaceDetails;

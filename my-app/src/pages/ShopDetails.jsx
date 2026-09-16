import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  MapPin,
  Star,
  Phone,
  Clock,
  Heart,
  ArrowLeft,
  Sparkles,
  UtensilsCrossed,
  Compass,
  ShieldCheck,
  Share2,
  PhoneCall,
  Utensils,
  Wifi,
  Car,
  CheckCircle2,
} from "lucide-react";
import CustomerHeader from "../components/customer/CustomerHeader";
import FoodCard from "../components/customer/FoodCard";
import FoodDetailModal from "../components/customer/FoodDetailModal";
import CartDrawer from "../components/customer/CartDrawer";
import RestaurantReviews from "../components/customer/RestaurantReviews";
import EmptyState from "../components/customer/EmptyState";
import { RestaurantDetailsSkeleton, FoodSkeleton } from "../components/customer/SkeletonLoaders";
import { resolveImageUrl, formatRating, formatLocation } from "../utils/formatters";
import { useSiteUserAuthStore } from "../store/siteUserAuthStore";

export default function ShopDetails() {
  const params = useParams();
  const id = params.id || params.restaurantId || params.shopId;
  const navigate = useNavigate();
  const user = useSiteUserAuthStore((state) => state.user);

  const [shop, setShop] = useState(null);
  const [foods, setFoods] = useState([]);
  const [loadingShop, setLoadingShop] = useState(true);
  const [loadingFoods, setLoadingFoods] = useState(true);
  const [error, setError] = useState(null);

  // Likes state
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);

  // Modal preview
  const [selectedFoodForModal, setSelectedFoodForModal] = useState(null);

  // Fetch shop details
  useEffect(() => {
    if (!id) return;
    const fetchDetails = async () => {
      setLoadingShop(true);
      setError(null);
      try {
        const res = await axios.get(`http://localhost:5000/api/shops/${id}`);
        const shopData = res.data?.shop;

        if (!shopData) {
          throw new Error("Venue details not found.");
        }

        setShop(shopData);
        setLikeCount(shopData.likeCount || 0);

        if (user?._id && Array.isArray(shopData.likes)) {
          setLiked(
            shopData.likes.some((likeId) =>
              typeof likeId === "object" && likeId?._id
                ? likeId._id === user._id
                : likeId === user._id
            )
          );
        }
      } catch (err) {
        console.error("Error fetching shop details:", err);
        setError(err.response?.data?.error || "This venue is currently unavailable or pending approval.");
      } finally {
        setLoadingShop(false);
      }
    };

    fetchDetails();
  }, [id, user?._id]);

  // Fetch shop foods
  useEffect(() => {
    if (!id) return;
    const fetchFoods = async () => {
      setLoadingFoods(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/food/shop/${id}`);
        setFoods(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching foods:", err);
        setFoods([]);
      } finally {
        setLoadingFoods(false);
      }
    };

    fetchFoods();
  }, [id]);

  // Handle Like/Unlike
  const handleLike = async () => {
    if (!user) {
      navigate("/user/login");
      return;
    }
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      const res = await axios.post(
        `http://localhost:5000/api/shops/${id}/like`,
        {},
        { withCredentials: true }
      );
      if (res.data?.data) {
        setLiked(res.data.data.liked);
        setLikeCount(res.data.data.likeCount);
      }
    } catch (err) {
      console.error("Error liking venue:", err);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: shop?.name || "Ceylon Calling Venue",
          text: `Check out ${shop?.name} on Ceylon Calling!`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loadingShop) {
    return (
      <div className="min-h-screen bg-slate-50/50">
        <CustomerHeader />
        <div className="pt-28">
          <RestaurantDetailsSkeleton />
        </div>
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col">
        <CustomerHeader />
        <main className="flex-1 max-w-2xl mx-auto px-4 pt-40 pb-20 flex items-center justify-center">
          <EmptyState
            icon="search"
            title="Venue not found"
            description={error || "We couldn't load details for this place. It may have been modified or unlisted."}
            actionText="Browse Venues"
            onAction={() => navigate("/discover")}
          />
        </main>
      </div>
    );
  }

  const averageRating = formatRating(shop.rating || (shop.shopType === "hotel" ? 4.8 : 4.6));
  const mainImage = resolveImageUrl(shop.photo || (shop.photos && shop.photos[0]), shop.shopType || "restaurant");

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col">
      <CustomerHeader />
      <CartDrawer />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24">
        {/* Back navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-600 transition p-2 rounded-xl hover:bg-slate-100"
          >
            <ArrowLeft size={16} />
            <span>Back to Discovery</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
            >
              <Share2 size={13} />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Hero Banner Section */}
        <section className="relative rounded-3xl sm:rounded-[2.5rem] overflow-hidden bg-slate-950 aspect-[2.2/1] min-h-[280px] sm:min-h-[360px] shadow-xl border border-slate-800/40 mb-10">
          <img
            src={mainImage}
            alt={shop.name}
            className="w-full h-full object-cover opacity-85 scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

          {/* Banner Details */}
          <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10 right-6 sm:right-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="space-y-3 text-left">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/25 border border-emerald-400/30 text-emerald-300 text-[11px] font-extrabold uppercase tracking-wider backdrop-blur-md">
                  <ShieldCheck size={12} />
                  Approved Partner
                </span>
                <span className="px-3 py-1 rounded-full bg-white/15 text-white text-[11px] font-bold uppercase tracking-wider backdrop-blur-md">
                  {shop.shopType || "Restaurant"}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
                {shop.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-200">
                <span className="flex items-center gap-1.5 font-medium">
                  <MapPin size={15} className="text-emerald-400 shrink-0" />
                  <span>{formatLocation(shop.location)}</span>
                </span>
                <span className="flex items-center gap-1.5 bg-white/15 px-2.5 py-0.5 rounded-md backdrop-blur-md font-bold text-white">
                  <Star size={13} className="fill-amber-400 text-amber-400 shrink-0" />
                  <span>{averageRating}</span>
                </span>
                <span className="text-slate-300 font-medium">
                  {shop.priceRange || "LKR 1,000–3,000"}
                </span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to={`/restaurant/${id}/menu`}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-950/40 transition"
              >
                <Utensils size={16} />
                <span>View Food Menu</span>
              </Link>

              <button
                type="button"
                onClick={handleLike}
                disabled={likeLoading}
                className={`flex items-center gap-2 px-4 py-3 rounded-full text-xs sm:text-sm font-bold transition shadow-sm border ${
                  liked
                    ? "bg-pink-600 border-pink-600 text-white"
                    : "bg-white/90 border-white/20 text-slate-900 hover:bg-white backdrop-blur-md"
                }`}
              >
                <Heart size={15} className={liked ? "fill-white" : ""} />
                <span>{liked ? "Favorited" : "Favorite"}</span>
              </button>

              <div className="text-xs font-bold text-white/90 bg-slate-900/70 px-3.5 py-3 rounded-full border border-white/10 backdrop-blur-md">
                {likeCount} likes
              </div>
            </div>
          </div>
        </section>

        {/* Content Layout Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 items-start">
          {/* Main Left Columns */}
          <div className="lg:col-span-2 space-y-10">
            {/* About the Venue */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4 text-slate-800">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                About the Venue
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-light whitespace-pre-wrap">
                {shop.description ||
                  "A verified Ceylon hospitality venue serving authentic island flavors and offering a welcoming ambience for visitors and locals."}
              </p>

              {shop.businessDescription && (
                <div className="mt-4 pt-4 border-t border-slate-50">
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed italic bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    "{shop.businessDescription}"
                  </p>
                </div>
              )}
            </div>

            {/* Menu Highlights Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    Menu Highlights
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Signature dishes and local favorites available at this venue.
                  </p>
                </div>
                <Link
                  to={`/restaurant/${id}/menu`}
                  className="text-xs font-extrabold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-100 transition shadow-2xs"
                >
                  Full Menu ({foods.length}) →
                </Link>
              </div>

              {loadingFoods ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FoodSkeleton count={4} />
                </div>
              ) : foods.length === 0 ? (
                <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center shadow-sm text-slate-400 text-sm font-light">
                  <UtensilsCrossed size={24} className="mx-auto mb-2 text-slate-300" />
                  <p className="font-semibold text-slate-600">No dishes listed yet</p>
                  <p className="text-xs text-slate-400 mt-1">
                    This restaurant has not added items to their public menu yet.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {foods.slice(0, 4).map((food, idx) => (
                    <FoodCard
                      key={food._id}
                      food={food}
                      shop={shop}
                      index={idx}
                      onSelectFood={(f) => setSelectedFoodForModal(f)}
                    />
                  ))}
                </div>
              )}

              {foods.length > 4 && (
                <div className="text-center pt-2">
                  <Link
                    to={`/restaurant/${id}/menu`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 hover:bg-emerald-600 text-white text-xs font-extrabold transition shadow-md"
                  >
                    <Utensils size={14} />
                    <span>Explore All {foods.length} Menu Dishes</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Customer Reviews & Feedback */}
            <RestaurantReviews shopId={id} />
          </div>

          {/* Sidebar Info Column */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Quick Contact & Details */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-5 text-slate-800">
              <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider pb-3 border-b border-slate-100">
                Venue Details
              </h3>

              {/* Operating Hours */}
              <div className="flex items-start gap-3">
                <Clock size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Hours
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    {shop.activeTime || "8:00 AM – 10:00 PM Daily"}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <Phone size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Contact Phone
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    {shop.contact || "+94 77 123 4567"}
                  </p>
                </div>
              </div>

              {/* Location Address */}
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Location
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    {formatLocation(shop.location)}
                  </p>
                </div>
              </div>

              {/* Facilities Badges */}
              {Array.isArray(shop.services) && shop.services.length > 0 && (
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Services & Amenities
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {shop.services.map((svc, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-xl bg-slate-50 text-slate-700 border border-slate-100 text-xs font-semibold capitalize"
                      >
                        {svc}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Direct Actions */}
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                <Link
                  to={`/restaurant/${id}/menu`}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold text-center rounded-2xl shadow-md transition"
                >
                  View Food Menu
                </Link>
                {shop.contact && (
                  <a
                    href={`tel:${shop.contact}`}
                    className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold text-center rounded-2xl border border-slate-200 transition"
                  >
                    Call Venue ({shop.contact})
                  </a>
                )}
              </div>
            </div>

            {/* Geographic Coordinates Card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <Compass size={14} className="text-emerald-500" />
                <span>Geographic Location</span>
              </h4>
              <div className="relative aspect-[4/3] rounded-2xl bg-slate-900 overflow-hidden border border-slate-800 flex flex-col justify-center items-center text-center p-4">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1.5px,transparent_1.5px)] [background-size:16px_16px]" />
                <MapPin className="text-emerald-400 animate-bounce mb-2" size={30} />
                <span className="text-sm font-extrabold text-white">
                  {formatLocation(shop.location)}
                </span>
                <span className="text-[11px] text-slate-400 mt-1 font-light leading-snug">
                  Authentic Sri Lankan hospitality district
                </span>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Food Detail Modal */}
      <FoodDetailModal
        food={selectedFoodForModal}
        shop={shop}
        isOpen={Boolean(selectedFoodForModal)}
        onClose={() => setSelectedFoodForModal(null)}
      />
    </div>
  );
}

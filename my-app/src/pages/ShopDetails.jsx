import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  MapPin,
  Star,
  Phone,
  Clock,
  Heart,
  ArrowLeft,
  UtensilsCrossed,
  ShieldCheck,
  Share2,
  Utensils,
  Wifi,
  Car,
  Snowflake,
  Trees,
  Waves,
  CheckCircle2,
  Bed,
  Calendar,
  X,
  AlertCircle,
  Building2,
  Home,
  Hotel,
  CalendarCheck,
  ArrowUpRight,
  Sparkles,
  Navigation,
} from "lucide-react";
import CustomerHeader from "../components/customer/CustomerHeader";
import BusinessGallery from "../components/customer/BusinessGallery";
import CartDrawer from "../components/customer/CartDrawer";
import RestaurantReviews from "../components/customer/RestaurantReviews";
import CustomerRoomCard from "../components/customer/CustomerRoomCard";
import EmptyState from "../components/customer/EmptyState";
import { RestaurantDetailsSkeleton } from "../components/customer/SkeletonLoaders";
import VenueMap from "../components/common/VenueMap";
import { resolveImageUrl, formatLocation } from "../utils/formatters";
import { getShopCoordinates, getDirectionsUrl, getShopLocationText, hasValidCoordinates } from "../utils/locationUtils";
import { useSiteUserAuthStore } from "../store/siteUserAuthStore";

/**
 * Returns clean outline icon & label for business types
 */
const getTypeConfig = (shopType = "restaurant") => {
  switch (shopType.toLowerCase()) {
    case "restaurant":
    case "small_food_shop":
      return { label: "Restaurant", icon: Utensils };
    case "hotel":
      return { label: "Hotel & Resort", icon: Hotel };
    case "villa":
      return { label: "Private Villa", icon: Home };
    case "guesthouse":
      return { label: "Guest House", icon: Bed };
    default:
      return { label: "Establishment", icon: Building2 };
  }
};

export default function ShopDetails() {
  const params = useParams();
  const id = params.id || params.restaurantId || params.shopId;
  const navigate = useNavigate();
  const user = useSiteUserAuthStore((state) => state.user);

  const [shop, setShop] = useState(null);
  const [foods, setFoods] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loadingShop, setLoadingShop] = useState(true);
  const [loadingFoods, setLoadingFoods] = useState(true);
  const [error, setError] = useState(null);

  // Synchronized review stats
  const [reviewStats, setReviewStats] = useState({ count: 0, average: null });

  // Likes state
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);

  // Booking Modal for Accommodations
  const [bookingRoom, setBookingRoom] = useState(null);
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    checkInDate: "",
    checkOutDate: "",
    guestsCount: 1,
    specialRequests: "",
  });

  useEffect(() => {
    if (user) {
      setBookingForm((prev) => ({
        ...prev,
        customerName: user.name || prev.customerName,
        customerEmail: user.email || prev.customerEmail,
        customerPhone: user.phone || prev.customerPhone,
      }));
    }
  }, [user]);

  // Fetch shop details
  const fetchDetails = useCallback(async () => {
    if (!id) return;
    setLoadingShop(true);
    setError(null);
    try {
      const res = await axios.get(`/api/shops/${id}`);
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
      setError(err.response?.data?.error || "This venue is currently unavailable or unlisted.");
    } finally {
      setLoadingShop(false);
    }
  }, [id, user?._id]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  // Fetch shop foods
  useEffect(() => {
    if (!id) return;
    const fetchFoods = async () => {
      setLoadingFoods(true);
      try {
        const res = await axios.get(`/api/food/shop/${id}`);
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

  // Fetch accommodation rooms (if hotel/villa/guesthouse)
  useEffect(() => {
    if (!id) return;
    const fetchRooms = async () => {
      try {
        const res = await axios.get(`/api/shops/${id}/rooms`);
        setRooms(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        setRooms([]);
      }
    };
    fetchRooms();
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
        `/api/shops/${id}/like`,
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
      toast.success("Link copied to clipboard!");
    }
  };

  const handleBookStay = async (e) => {
    e.preventDefault();
    if (!bookingRoom) return;
    if (!bookingForm.checkInDate || !bookingForm.checkOutDate) {
      toast.error("Please select check-in and check-out dates");
      return;
    }
    if (!bookingForm.customerPhone || !bookingForm.customerEmail || !bookingForm.customerName) {
      toast.error("Please provide guest contact details");
      return;
    }

    try {
      setSubmittingBooking(true);
      const res = await axios.post(
        "/api/bookings",
        {
          shopId: shop._id,
          roomId: bookingRoom._id,
          customerName: bookingForm.customerName,
          customerEmail: bookingForm.customerEmail,
          customerPhone: bookingForm.customerPhone,
          checkInDate: bookingForm.checkInDate,
          checkOutDate: bookingForm.checkOutDate,
          guestsCount: Number(bookingForm.guestsCount) || 1,
          specialRequests: bookingForm.specialRequests,
        },
        { withCredentials: true }
      );

      if (res.data?.success) {
        toast.success(`Booking request sent! Reference: ${res.data.booking.bookingReference}`);
        setBookingRoom(null);
      }
    } catch (err) {
      console.error("Booking error:", err);
      toast.error(err.response?.data?.error || "Failed to submit booking request");
    } finally {
      setSubmittingBooking(false);
    }
  };

  // Group capabilities (services) vs facilities (amenities)
  const { servicesList, facilitiesList } = useMemo(() => {
    if (!shop) return { servicesList: [], facilitiesList: [] };

    const services = [];
    const facilities = [];

    // Capabilities
    if (shop.capabilities?.hasDineIn) services.push({ label: "Dine-In", icon: Utensils });
    if (shop.capabilities?.hasTakeaway) services.push({ label: "Takeaway", icon: Utensils });
    if (shop.capabilities?.hasDelivery) services.push({ label: "Food Delivery", icon: Utensils });
    if (shop.capabilities?.hasReservations) services.push({ label: "Table Reservation", icon: CalendarCheck });
    if (shop.capabilities?.hasRoomBooking) services.push({ label: "Room Booking", icon: Bed });

    // Raw services array categorisation
    if (Array.isArray(shop.services)) {
      shop.services.forEach((s) => {
        const lower = s.toLowerCase();
        if (lower.includes("wifi")) {
          if (!facilities.some((f) => f.label === "Free Wi-Fi")) facilities.push({ label: "Free Wi-Fi", icon: Wifi });
        } else if (lower.includes("park")) {
          if (!facilities.some((f) => f.label === "Free Parking")) facilities.push({ label: "Free Parking", icon: Car });
        } else if (lower.includes("air") || lower.includes("ac") || lower.includes("condition")) {
          if (!facilities.some((f) => f.label === "Air Conditioning")) facilities.push({ label: "Air Conditioning", icon: Snowflake });
        } else if (lower.includes("outdoor") || lower.includes("garden")) {
          if (!facilities.some((f) => f.label === "Outdoor Seating")) facilities.push({ label: "Outdoor Seating", icon: Trees });
        } else if (lower.includes("pool")) {
          if (!facilities.some((f) => f.label === "Swimming Pool")) facilities.push({ label: "Swimming Pool", icon: Waves });
        } else if (!services.some((item) => item.label.toLowerCase() === lower)) {
          services.push({ label: s.replace(/_/g, " "), icon: Sparkles });
        }
      });
    }

    return { servicesList: services, facilitiesList: facilities };
  }, [shop]);

  if (loadingShop) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <CustomerHeader />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <RestaurantDetailsSkeleton />
        </main>
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <CustomerHeader />
        <main className="flex-1 max-w-2xl mx-auto px-4 pt-32 pb-20 flex items-center justify-center">
          <EmptyState
            icon="search"
            title="Venue not found"
            description={error || "We couldn't load details for this place. It may have been unlisted or moved."}
            actionText="Browse Venues"
            onAction={() => navigate("/discover")}
          />
        </main>
      </div>
    );
  }

  const typeConfig = getTypeConfig(shop.shopType);
  const TypeIcon = typeConfig.icon;

  const locationDisplay = shop ? getShopLocationText(shop) : "";
  const shopCoords = shop ? getShopCoordinates(shop) : null;
  const directionsUrl = shop ? getDirectionsUrl(shop) : null;

  // Authoritative rating display (syncs with reviews)
  const displayRating = reviewStats.average || (shop.rating ? Number(shop.rating).toFixed(1) : null);
  const displayReviewCount = reviewStats.count;

  const isAccommodation = ["hotel", "villa", "guesthouse"].includes(
    (shop.shopType || "").toLowerCase()
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      <CustomerHeader />
      <CartDrawer />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-6">
        {/* Navigation & Share Row */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-600 transition"
          >
            <ArrowLeft size={15} />
            <span>Back to Discovery</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
            aria-label="Share this place"
          >
            <Share2 size={13} />
            <span>Share</span>
          </button>
        </div>

        {/* 1. Top Business Identity & Meta Header */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
            <div className="space-y-2.5">
              {/* Type, Partner Status & Open Hours */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                  <TypeIcon size={12} className="text-emerald-600 shrink-0" />
                  <span>{typeConfig.label}</span>
                </span>

                {shop.status === "approved" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200/70">
                    <ShieldCheck size={13} className="text-emerald-600 shrink-0" />
                    <span>Approved Partner</span>
                  </span>
                )}

                {/* Operating Status */}
                {shop.operationalStatus === "closed" ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                    <span className="h-2 w-2 rounded-full bg-slate-400" />
                    <span>Closed</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-xs font-medium">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span>Open now</span>
                  </span>
                )}
              </div>

              {/* Business Name */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
                {shop.name}
              </h1>

              {/* Location, Rating, Price Meta Line */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs sm:text-sm text-slate-600">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={14} className="text-slate-400 shrink-0" />
                  <span>{locationDisplay}</span>
                </span>

                <span className="inline-flex items-center gap-1">
                  {displayRating ? (
                    <>
                      <Star size={14} className="fill-amber-400 text-amber-400 shrink-0" />
                      <span className="font-semibold text-slate-900">{displayRating}</span>
                      {displayReviewCount > 0 && (
                        <span className="text-slate-400 font-normal">
                          ({displayReviewCount} {displayReviewCount === 1 ? "review" : "reviews"})
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-slate-400">No ratings yet</span>
                  )}
                </span>

                <span className="font-semibold text-slate-800">
                  {shop.priceRange
                    ? shop.priceRange
                    : isAccommodation
                    ? "From LKR 4,500 / night"
                    : "LKR 1,000–3,000"}
                </span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 md:pt-0">
              {directionsUrl && (
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold shadow-2xs transition"
                >
                  <Navigation size={15} className="text-emerald-600" />
                  <span>Get Directions</span>
                </a>
              )}

              <Link
                to={`/restaurant/${id}/menu`}
                className="min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-semibold shadow-xs transition"
              >
                <Utensils size={15} />
                <span>View Food Menu</span>
              </Link>

              <button
                type="button"
                onClick={handleLike}
                disabled={likeLoading}
                className={`min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg border text-sm font-semibold transition active:scale-98 ${
                  liked
                    ? "bg-rose-50 border-rose-200 text-rose-700"
                    : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                }`}
                aria-label={liked ? "Remove from saved places" : "Save this place"}
              >
                <Heart
                  size={15}
                  className={liked ? "fill-rose-600 text-rose-600" : "text-slate-500"}
                />
                <span>{liked ? "Saved" : "Favorite"}</span>
                {likeCount > 0 && (
                  <span className="text-xs text-slate-400 ml-0.5">({likeCount})</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 2. Visual Photo Gallery (Deduplicated, Clean Grid) */}
        <BusinessGallery
          photos={shop.photos}
          mainPhoto={shop.photo}
          shopType={shop.shopType}
          shopName={shop.name}
        />

        {/* 3. Main Content Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* About the Venue (Rendered strictly once, safe plain text) */}
            <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                About the Venue
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed font-normal whitespace-pre-wrap">
                {shop.description ||
                  shop.businessDescription ||
                  "A verified hospitality establishment in the North Central Province welcoming travelers, explorers, and food lovers."}
              </p>
            </section>

            {/* Services & Facilities (Separated and structured) */}
            {(servicesList.length > 0 || facilitiesList.length > 0) && (
              <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-5">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  Services &amp; Facilities
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Services Offered */}
                  {servicesList.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Services Offered
                      </h3>
                      <ul className="space-y-2">
                        {servicesList.map((svc, i) => {
                          const Icon = svc.icon;
                          return (
                            <li
                              key={i}
                              className="flex items-center gap-2.5 text-xs font-medium text-slate-700"
                            >
                              <div className="h-6 w-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                <Icon size={13} />
                              </div>
                              <span>{svc.label}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}

                  {/* Physical Facilities */}
                  {facilitiesList.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Property Facilities
                      </h3>
                      <ul className="space-y-2">
                        {facilitiesList.map((fac, i) => {
                          const Icon = fac.icon;
                          return (
                            <li
                              key={i}
                              className="flex items-center gap-2.5 text-xs font-medium text-slate-700"
                            >
                              <div className="h-6 w-6 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                                <Icon size={13} />
                              </div>
                              <span>{fac.label}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Menu Highlights (Real dishes preview) */}
            <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                    Menu Highlights
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Signature dishes and specialties available at this venue.
                  </p>
                </div>

                <Link
                  to={`/restaurant/${id}/menu`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline shrink-0"
                >
                  <span>View Full Menu</span>
                  <ArrowUpRight size={13} />
                </Link>
              </div>

              {loadingFoods ? (
                <div className="py-8 text-center text-xs font-medium text-slate-400 animate-pulse">
                  Loading menu highlights...
                </div>
              ) : foods.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center space-y-2">
                  <UtensilsCrossed size={20} className="mx-auto text-slate-400" />
                  <p className="text-xs font-semibold text-slate-700">No dishes listed yet</p>
                  <p className="text-xs text-slate-500 font-normal">
                    This restaurant has not published menu items yet. Check back soon.
                  </p>
                  <div className="pt-2">
                    <Link
                      to={`/restaurant/${id}/menu`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                      <span>Check Menu Page</span>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {foods.slice(0, 4).map((food) => (
                    <div
                      key={food._id}
                      className="flex items-center gap-3.5 p-3 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 transition shadow-2xs"
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                        <img
                          src={resolveImageUrl(food.picture, "food")}
                          alt={food.foodname}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 text-xs truncate">
                          {food.foodname}
                        </h4>
                        <span className="text-[11px] text-slate-400 block truncate">
                          {food.category?.name || "Dish"}
                        </span>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs font-bold text-slate-800">
                            LKR {Number(food.price || 0).toLocaleString()}
                          </span>
                          <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                            Available
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Accommodation Stay Units (If hotel/villa/guesthouse or rooms exist) */}
            {(isAccommodation || rooms.length > 0) && (
              <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                      <Bed size={18} className="text-emerald-600 shrink-0" />
                      <span>Stay &amp; Accommodation Units</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Reserve private rooms, suites, and chalets directly.
                    </p>
                  </div>
                </div>

                {rooms.length === 0 ? (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center space-y-1">
                    <p className="text-xs font-semibold text-slate-700">No rooms currently listed</p>
                    <p className="text-xs text-slate-500">
                      Contact the property host directly for room inquiries and bookings.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {rooms.map((room) => (
                      <CustomerRoomCard
                        key={room._id}
                        room={room}
                        shop={shop}
                        onBookRoom={(r) => setBookingRoom(r)}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Customer Reviews Section */}
            <RestaurantReviews
              shopId={id}
              onReviewsLoaded={(stats) => setReviewStats(stats)}
            />
          </div>

          {/* Right Column: Sticky Venue Information Card */}
          <aside className="lg:col-span-1 space-y-5 lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-3 border-b border-slate-100">
                Venue Information
              </h3>

              {/* Operating Hours */}
              <div className="flex items-start gap-3">
                <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                  <Clock size={14} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-900">Opening Hours</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {shop.activeTime || "8:00 AM – 10:00 PM Daily"}
                  </p>
                </div>
              </div>

              {/* Contact Phone */}
              {shop.contact && (
                <div className="flex items-start gap-3">
                  <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                    <Phone size={14} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900">Contact Phone</h4>
                    <a
                      href={`tel:${shop.contact}`}
                      className="text-xs text-emerald-600 hover:underline font-medium mt-0.5 block"
                    >
                      {shop.contact}
                    </a>
                  </div>
                </div>
              )}

              {/* Address / Location */}
              <div className="flex items-start gap-3">
                <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                  <MapPin size={14} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-900">Location</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {shop.addressDetails?.streetAddress && `${shop.addressDetails.streetAddress}, `}
                    {locationDisplay}
                  </p>
                </div>
              </div>

              {/* Map & Coordinates Preview */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <h4 className="font-semibold text-slate-900">Map &amp; Coordinates</h4>
                  {shopCoords && (
                    <span className="text-[11px] text-slate-400 font-mono">
                      {shopCoords.lat.toFixed(4)}, {shopCoords.lng.toFixed(4)}
                    </span>
                  )}
                </div>

                <VenueMap
                  lat={shopCoords?.lat}
                  lng={shopCoords?.lng}
                  venueName={shop.name}
                  address={shop.location?.address || shop.addressDetails?.streetAddress || locationDisplay}
                  directionsUrl={directionsUrl}
                  height="200px"
                />
              </div>

              {/* Direct Actions */}
              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                {directionsUrl ? (
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full min-h-[44px] flex items-center justify-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold shadow-2xs transition"
                  >
                    <Navigation size={14} className="text-emerald-600" />
                    <span>Get Directions on Google Maps</span>
                  </a>
                ) : (
                  <p className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center">
                    Directions are unavailable because this business has not provided a valid location.
                  </p>
                )}

                <Link
                  to={`/restaurant/${id}/menu`}
                  className="w-full min-h-[44px] flex items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition"
                >
                  <Utensils size={14} />
                  <span>View Food Menu</span>
                </Link>

                {shop.contact && (
                  <a
                    href={`tel:${shop.contact}`}
                    className="w-full min-h-[44px] flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
                  >
                    <Phone size={14} />
                    <span>Call Venue</span>
                  </a>
                )}
              </div>
            </div>
          </aside>
        </div>

        {/* Mobile Sticky Bottom Action Bar (< 768px) */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 flex items-center gap-2 shadow-lg">
          <button
            type="button"
            onClick={handleLike}
            disabled={likeLoading}
            className={`min-h-[44px] px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1 transition ${
              liked
                ? "bg-rose-50 border-rose-200 text-rose-700"
                : "bg-white border-slate-200 text-slate-700"
            }`}
            aria-label="Save this place"
          >
            <Heart size={15} className={liked ? "fill-rose-600 text-rose-600" : ""} />
            <span>{liked ? "Saved" : "Save"}</span>
          </button>

          {directionsUrl && (
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] px-3 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-semibold flex items-center justify-center gap-1 shadow-2xs"
            >
              <Navigation size={13} className="text-emerald-600" />
              <span>Map</span>
            </a>
          )}

          <Link
            to={`/restaurant/${id}/menu`}
            className="flex-1 min-h-[44px] flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold shadow-xs hover:bg-emerald-700 transition"
          >
            <Utensils size={14} />
            <span>Menu</span>
          </Link>
        </div>

        {/* Reservation Modal (For Accommodations) */}
        {bookingRoom && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto"
          >
            <div className="relative w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 my-8">
              <button
                type="button"
                onClick={() => setBookingRoom(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
                aria-label="Close booking modal"
              >
                <X size={18} />
              </button>

              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  Room Reservation
                </span>
                <h3 className="text-lg font-bold text-slate-900">{bookingRoom.name}</h3>
                <p className="text-xs text-slate-500">
                  At {shop.name} • LKR {Number(bookingRoom.pricePerNight || 0).toLocaleString()} per night
                </p>
              </div>

              <form onSubmit={handleBookStay} className="mt-5 space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Check-in *</label>
                    <input
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      value={bookingForm.checkInDate}
                      onChange={(e) => setBookingForm({ ...bookingForm, checkInDate: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Check-out *</label>
                    <input
                      type="date"
                      min={bookingForm.checkInDate || new Date().toISOString().split("T")[0]}
                      value={bookingForm.checkOutDate}
                      onChange={(e) => setBookingForm({ ...bookingForm, checkOutDate: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Guests Count</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={bookingForm.guestsCount}
                      onChange={(e) => setBookingForm({ ...bookingForm, guestsCount: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      placeholder="+94 7X XXX XXXX"
                      value={bookingForm.customerPhone}
                      onChange={(e) => setBookingForm({ ...bookingForm, customerPhone: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    placeholder="Guest name"
                    value={bookingForm.customerName}
                    onChange={(e) => setBookingForm({ ...bookingForm, customerName: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={bookingForm.customerEmail}
                    onChange={(e) => setBookingForm({ ...bookingForm, customerEmail: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setBookingRoom(null)}
                    className="flex-1 py-2.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingBooking}
                    className="flex-1 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition"
                  >
                    {submittingBooking ? "Reserving..." : "Confirm Booking"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

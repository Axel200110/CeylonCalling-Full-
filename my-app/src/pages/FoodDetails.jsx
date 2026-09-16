import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import {
  ArrowLeft,
  MapPin,
  Store,
  Clock,
  Phone,
  Utensils,
  Sparkles,
  ShoppingBag,
  Plus,
  Minus,
  Check,
} from "lucide-react";
import CustomerHeader from "../components/customer/CustomerHeader";
import FoodCard from "../components/customer/FoodCard";
import FoodDetailModal from "../components/customer/FoodDetailModal";
import CartDrawer from "../components/customer/CartDrawer";
import EmptyState from "../components/customer/EmptyState";
import AuthPromptModal from "../components/customer/AuthPromptModal";
import { FoodSkeleton } from "../components/customer/SkeletonLoaders";
import { resolveImageUrl, formatLKR, formatLocation } from "../utils/formatters";
import { useCartStore } from "../store/useCartStore";
import { useSiteUserAuthStore } from "../store/siteUserAuthStore";

export default function FoodDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [food, setFood] = useState(null);
  const [relatedFoods, setRelatedFoods] = useState([]);
  const [loadingFood, setLoadingFood] = useState(true);
  const [loadingRelated, setLoadingRelated] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedFoodForModal, setSelectedFoodForModal] = useState(null);

  const { addItem } = useCartStore();
  const isAuthenticated = useSiteUserAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    const fetchFoodDetails = async () => {
      setLoadingFood(true);
      setError(null);
      try {
        const res = await axios.get(`http://localhost:5000/api/food/${id}`);
        setFood(res.data);

        // Fetch related foods from the same shop
        const shopId = res.data.shop?._id || res.data.shop;
        if (shopId) {
          setLoadingRelated(true);
          const relatedRes = await axios.get(`http://localhost:5000/api/food/shop/${shopId}`);
          const filtered = (Array.isArray(relatedRes.data) ? relatedRes.data : []).filter(
            (item) => item._id !== id
          );
          setRelatedFoods(filtered);
        }
      } catch (err) {
        console.error("Error fetching food details:", err);
        setError("Food item details could not be retrieved. Make sure the shop is approved.");
      } finally {
        setLoadingFood(false);
        setLoadingRelated(false);
      }
    };

    fetchFoodDetails();
  }, [id]);

  if (loadingFood) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col">
        <CustomerHeader />
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 pt-32 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
            <div className="aspect-[4/3] rounded-3xl bg-slate-200" />
            <div className="space-y-4">
              <div className="h-8 bg-slate-200 rounded-xl w-3/4" />
              <div className="h-6 bg-slate-200 rounded-lg w-1/3" />
              <div className="h-20 bg-slate-100 rounded-xl w-full" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !food) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col">
        <CustomerHeader />
        <main className="flex-1 max-w-2xl mx-auto px-4 pt-36 pb-20 flex items-center justify-center">
          <EmptyState
            icon="food"
            title="Dish not found"
            description={error || "The dish details could not be found or the venue is inactive."}
            actionText="Explore All Foods"
            onAction={() => navigate("/foods")}
          />
        </main>
      </div>
    );
  }

  const mainImage = resolveImageUrl(food.picture, "food");
  const shopObj = food.shop;
  const shopId = shopObj?._id || shopObj;
  const shopName = shopObj?.name || "Partner Restaurant";
  const shopLocation = formatLocation(shopObj?.location);
  const unitPrice = Number(food.price || 0);
  const subtotal = unitPrice * quantity;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    addItem(food, shopObj, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col">
      <CustomerHeader />
      <CartDrawer />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24 space-y-10">
        {/* Back navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-600 transition p-2 rounded-xl hover:bg-slate-100"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>

          {shopId && (
            <Link
              to={`/restaurant/${shopId}/menu`}
              className="text-xs font-extrabold text-emerald-600 hover:underline flex items-center gap-1"
            >
              <Utensils size={13} />
              <span>Full {shopName} Menu</span>
            </Link>
          )}
        </div>

        {/* Product Details Grid */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: Dish Image */}
          <div className="lg:col-span-6 relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-100">
            <img
              src={mainImage}
              alt={food.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 rounded-full bg-slate-900/80 border border-white/10 px-3.5 py-1 text-xs font-bold text-white shadow-md backdrop-blur-md">
              {food.category?.name || "Signature Menu"}
            </div>
          </div>

          {/* Right: Dish Info & Order Actions */}
          <div className="lg:col-span-6 space-y-6 text-slate-800">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  to={`/restaurant/${shopId}`}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold hover:bg-emerald-100 transition"
                >
                  <Store size={12} />
                  <span>{shopName}</span>
                </Link>
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                  <MapPin size={12} className="text-emerald-500" />
                  <span>{shopLocation}</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                {food.name}
              </h1>

              <div className="text-2xl sm:text-3xl font-black text-emerald-600 pt-1">
                {formatLKR(food.price)}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-light">
              Prepared to order using authentic Sri Lankan spices, high-grade produce, and culinary perfection. Discover an aromatic blend of local flavors.
            </p>

            {/* Quantity and Add To Cart Bar */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Select Quantity
                </span>
                <div className="flex items-center gap-3 bg-slate-100 rounded-2xl p-1.5 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-8 w-8 rounded-xl bg-white text-slate-700 hover:bg-slate-50 flex items-center justify-center font-bold transition shadow-xs"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-extrabold text-slate-900 min-w-[24px] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-8 w-8 rounded-xl bg-white text-slate-700 hover:bg-slate-50 flex items-center justify-center font-bold transition shadow-xs"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className={`w-full py-4 px-6 rounded-2xl text-xs sm:text-sm font-extrabold text-white flex items-center justify-center gap-2 shadow-lg transition-all ${
                  added
                    ? "bg-emerald-600 scale-[0.99]"
                    : "bg-slate-900 hover:bg-emerald-600 hover:shadow-emerald-900/20"
                }`}
              >
                {added ? (
                  <>
                    <Check size={16} />
                    <span>Added {quantity} to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    <span>Add to Cart • {formatLKR(subtotal)}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Related Dishes from this restaurant */}
        {relatedFoods.length > 0 && (
          <div className="space-y-6 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  More from {shopName}
                </h3>
                <p className="text-xs text-slate-400">Other popular specialties prepared by this kitchen</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedFoods.slice(0, 4).map((relFood, idx) => (
                <FoodCard
                  key={relFood._id}
                  food={relFood}
                  shop={shopObj}
                  index={idx}
                  onSelectFood={(f) => setSelectedFoodForModal(f)}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <FoodDetailModal
        food={selectedFoodForModal}
        shop={shopObj}
        isOpen={Boolean(selectedFoodForModal)}
        onClose={() => setSelectedFoodForModal(null)}
      />

      <AuthPromptModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        pendingItem={{ ...food, quantity }}
        pendingShop={shopObj}
        customTitle="Sign in to add to cart"
        customSubtitle={`Create an account or sign in to add "${food.name}" to your cart.`}
      />
    </div>
  );
}

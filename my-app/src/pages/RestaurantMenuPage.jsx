import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  ArrowLeft,
  Search,
  MapPin,
  Star,
  ShoppingBag,
  SlidersHorizontal,
  Store,
  UtensilsCrossed,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import CustomerHeader from "../components/customer/CustomerHeader";
import FoodCard from "../components/customer/FoodCard";
import FoodDetailModal from "../components/customer/FoodDetailModal";
import CartDrawer from "../components/customer/CartDrawer";
import EmptyState from "../components/customer/EmptyState";
import { FoodSkeleton } from "../components/customer/SkeletonLoaders";
import { resolveImageUrl, formatRating, formatLocation } from "../utils/formatters";
import { useCartStore } from "../store/useCartStore";

export default function RestaurantMenuPage() {
  const params = useParams();
  const shopId = params.id || params.restaurantId || params.shopId;
  const navigate = useNavigate();

  const [shop, setShop] = useState(null);
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingFoods, setLoadingFoods] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceSort, setPriceSort] = useState("default"); // 'default', 'asc', 'desc'
  const [selectedFoodForModal, setSelectedFoodForModal] = useState(null);

  const { toggleCart, getTotalItems } = useCartStore();
  const cartItemCount = getTotalItems();

  // 1. Fetch Shop details
  useEffect(() => {
    if (!shopId) return;
    const fetchShop = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/shops/${shopId}`);
        setShop(res.data?.shop || null);
      } catch (err) {
        console.error("Error fetching shop for menu:", err);
      }
    };
    fetchShop();
  }, [shopId]);

  // 2. Fetch Food items
  useEffect(() => {
    if (!shopId) return;
    const fetchFoodsAndCategories = async () => {
      setLoadingFoods(true);
      setError(null);
      try {
        const res = await axios.get(`http://localhost:5000/api/food/shop/${shopId}`);
        const foodList = Array.isArray(res.data) ? res.data : [];
        setFoods(foodList);

        // Extract unique categories from real MongoDB data
        const catMap = new Map();
        foodList.forEach((f) => {
          if (f.category && f.category._id) {
            catMap.set(f.category._id, f.category.name);
          } else if (typeof f.category === "string" && f.category) {
            catMap.set(f.category, f.category);
          }
        });

        // Also fetch shop categories endpoint if available
        try {
          const catRes = await axios.get(`http://localhost:5000/api/categories/shop/${shopId}`);
          if (Array.isArray(catRes.data)) {
            catRes.data.forEach((c) => {
              if (c._id && c.name) catMap.set(c._id, c.name);
            });
          }
        } catch {
          // Soft fail
        }

        const catArray = Array.from(catMap.entries()).map(([id, name]) => ({
          id,
          name,
        }));
        setCategories(catArray);
      } catch (err) {
        console.error("Error fetching foods:", err);
        setError("Unable to load menu dishes. Please check connection.");
      } finally {
        setLoadingFoods(false);
      }
    };
    fetchFoodsAndCategories();
  }, [shopId]);

  // Filter and sort dishes
  const filteredDishes = useMemo(() => {
    return foods
      .filter((food) => {
        // Category filter
        if (selectedCategory !== "all") {
          const catId = food.category?._id || food.category;
          const catName = food.category?.name || "";
          if (catId !== selectedCategory && catName !== selectedCategory) {
            return false;
          }
        }

        // Search query filter
        if (searchQuery.trim() !== "") {
          const q = searchQuery.toLowerCase();
          const nameMatch = food.name?.toLowerCase().includes(q);
          const catMatch = food.category?.name?.toLowerCase().includes(q);
          if (!nameMatch && !catMatch) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (priceSort === "asc") return (a.price || 0) - (b.price || 0);
        if (priceSort === "desc") return (b.price || 0) - (a.price || 0);
        return 0;
      });
  }, [foods, selectedCategory, searchQuery, priceSort]);

  const shopImage = resolveImageUrl(shop?.photo || (shop?.photos && shop?.photos[0]), shop?.shopType || "restaurant");
  const averageRating = formatRating(shop?.rating || 4.7);

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col">
      <CustomerHeader />
      <CartDrawer />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* Navigation Breadcrumb & Back */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <button
            onClick={() => navigate(`/restaurant/${shopId}`)}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-600 transition p-2 rounded-xl hover:bg-slate-100"
          >
            <ArrowLeft size={16} />
            <span>Back to Venue Profile</span>
          </button>

          <button
            onClick={toggleCart}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-extrabold border border-emerald-200 transition shadow-xs"
          >
            <ShoppingBag size={15} />
            <span>View Cart ({cartItemCount})</span>
          </button>
        </div>

        {/* Restaurant Menu Header Card */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm mb-8 flex flex-col md:flex-row items-center gap-6">
          {/* Shop Photo */}
          <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl overflow-hidden shrink-0 border border-slate-100 bg-slate-100">
            <img
              src={shopImage}
              alt={shop?.name || "Restaurant"}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Shop Info */}
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold uppercase tracking-wider border border-emerald-100">
                {shop?.shopType || "Restaurant"} Menu
              </span>
              <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-md text-xs font-bold text-slate-700 border border-slate-100">
                <Star size={12} className="fill-amber-400 text-amber-400" />
                <span>{averageRating}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {shop?.name || "Restaurant Food Menu"}
            </h1>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1">
                <MapPin size={13} className="text-emerald-500" />
                <span>{formatLocation(shop?.location)}</span>
              </span>
              <span>•</span>
              <span>{shop?.priceRange || "LKR 1,000–3,000"}</span>
              <span>•</span>
              <span>{foods.length} items on menu</span>
            </div>
          </div>
        </div>

        {/* Menu Search & Category Navigation Bar */}
        <div className="sticky top-20 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-slate-200/80 shadow-sm mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Dish Search input */}
            <div className="flex-1 w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 focus-within:border-emerald-500 focus-within:bg-white transition">
              <Search size={16} className="text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dishes by name or style (e.g. Kottu, Curry, Rice)..."
                className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-slate-400 hover:text-slate-700 font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort Controls */}
            <div className="w-full sm:w-auto flex items-center gap-2">
              <select
                value={priceSort}
                onChange={(e) => setPriceSort(e.target.value)}
                className="w-full sm:w-auto px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="default">Default Order</option>
                <option value="asc">Price: Low to High</option>
                <option value="desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Horizontally scrollable Category tabs from MongoDB */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pt-1">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition shrink-0 ${
                selectedCategory === "all"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200/80 text-slate-600"
              }`}
            >
              All Items ({foods.length})
            </button>
            {categories.map((cat) => {
              const count = foods.filter(
                (f) => f.category?._id === cat.id || f.category === cat.id
              ).length;
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition shrink-0 ${
                    isSelected
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 hover:bg-slate-200/80 text-slate-600"
                  }`}
                >
                  <span>{cat.name}</span>
                  {count > 0 && <span className="ml-1.5 opacity-70">({count})</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dishes Grid Content */}
        {loadingFoods ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <FoodSkeleton count={8} />
          </div>
        ) : error ? (
          <EmptyState
            icon="search"
            title="Failed to load menu"
            description={error}
            actionText="Try Again"
            onAction={() => window.location.reload()}
          />
        ) : filteredDishes.length === 0 ? (
          <EmptyState
            icon="food"
            title="No dishes found"
            description={
              searchQuery || selectedCategory !== "all"
                ? "No items match your active filters. Try clearing your search."
                : "This venue has not uploaded their food menu yet. Check back soon!"
            }
            actionText="Reset Filters"
            onAction={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setPriceSort("default");
            }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredDishes.map((food, idx) => (
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

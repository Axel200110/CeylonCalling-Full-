import axios from "axios";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CartDrawer from "../components/customer/CartDrawer";
import CustomerHeader from "../components/customer/CustomerHeader";
import EmptyState from "../components/customer/EmptyState";
import FoodCard from "../components/customer/FoodCard";
import FoodDetailModal from "../components/customer/FoodDetailModal";
import { FoodSkeleton } from "../components/customer/SkeletonLoaders";
import { SRI_LANKAN_DISTRICTS } from "./PartnerWithUs/constants";

export default function Foods() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedPrice, setSelectedPrice] = useState("all"); // 'all', 'under1000', '1000to3000', 'over3000'
  const [selectedRestaurant, setSelectedRestaurant] = useState("all");
  const [priceSort, setPriceSort] = useState("default");
  const [selectedFoodForModal, setSelectedFoodForModal] = useState(null);

  // Sync state with URL search params on load
  useEffect(() => {
    const catParam = searchParams.get("category");
    const locParam = searchParams.get("location");
    const searchParam = searchParams.get("search");

    if (catParam) setSelectedCategory(catParam.toLowerCase());
    if (locParam) setSelectedDistrict(locParam);
    if (searchParam) setSearchQuery(searchParam);
  }, [searchParams]);

  // Fetch Foods
  const fetchFoods = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("http://localhost:5000/api/food/all");
      setFoods(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching foods:", err);
      setError("Failed to fetch food items. Please check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  // Extract unique categories and restaurants from real database foods
  const uniqueCategories = useMemo(() => {
    const catMap = new Map();
    foods.forEach((f) => {
      if (f.category?.name) {
        catMap.set(f.category._id || f.category.name, f.category.name);
      }
    });
    return Array.from(catMap.entries()).map(([id, name]) => ({ id, name }));
  }, [foods]);

  const uniqueRestaurants = useMemo(() => {
    const restMap = new Map();
    foods.forEach((f) => {
      if (f.shop?.name) {
        restMap.set(f.shop._id || f.shop.name, f.shop.name);
      }
    });
    return Array.from(restMap.entries()).map(([id, name]) => ({ id, name }));
  }, [foods]);

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSelectedDistrict("all");
    setSelectedPrice("all");
    setSelectedRestaurant("all");
    setPriceSort("default");
    setSearchQuery("");
    setSearchParams({});
  };

  // Filter computation
  const filteredFoods = useMemo(() => {
    return foods
      .filter((food) => {
        // 1. Food category matching
        if (selectedCategory !== "all") {
          const foodCatId = food.category?._id || "";
          const foodCatName = food.category?.name?.toLowerCase() || "";
          if (foodCatId !== selectedCategory && !foodCatName.includes(selectedCategory.toLowerCase())) {
            return false;
          }
        }

        // 2. District matching
        if (selectedDistrict !== "all") {
          const shopLoc = (food.shop?.location || "").toLowerCase();
          if (!shopLoc.includes(selectedDistrict.toLowerCase())) {
            return false;
          }
        }

        // 3. Restaurant matching
        if (selectedRestaurant !== "all") {
          const shopId = food.shop?._id || "";
          const shopName = food.shop?.name || "";
          if (shopId !== selectedRestaurant && shopName !== selectedRestaurant) {
            return false;
          }
        }

        // 4. Search query
        if (searchQuery.trim() !== "") {
          const q = searchQuery.toLowerCase();
          const foodNameMatch = food.name?.toLowerCase().includes(q);
          const foodCatMatch = food.category?.name?.toLowerCase().includes(q);
          const shopNameMatch = food.shop?.name?.toLowerCase().includes(q);
          if (!foodNameMatch && !foodCatMatch && !shopNameMatch) return false;
        }

        // 5. Price tier matching
        const price = Number(food.price || 0);
        if (selectedPrice !== "all") {
          if (selectedPrice === "under1000" && price >= 1000) return false;
          if (selectedPrice === "1000to3000" && (price < 1000 || price > 3000)) return false;
          if (selectedPrice === "over3000" && price <= 3000) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (priceSort === "asc") return (a.price || 0) - (b.price || 0);
        if (priceSort === "desc") return (b.price || 0) - (a.price || 0);
        return 0;
      });
  }, [
    foods,
    selectedCategory,
    selectedDistrict,
    selectedRestaurant,
    searchQuery,
    selectedPrice,
    priceSort,
  ]);

  const hasActiveFilters =
    selectedCategory !== "all" ||
    selectedDistrict !== "all" ||
    selectedRestaurant !== "all" ||
    selectedPrice !== "all" ||
    searchQuery.trim() !== "";

  return (
    <div className="min-h-screen bg-slate-50/40 flex flex-col">
      <CustomerHeader />
      <CartDrawer />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-8">
        {/* Header Title */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Sri Lankan Food & Menus
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Discover signature Sri Lankan dishes, curries, kottu, and international delights across partner restaurants.
              </p>
            </div>

            {/* Quick Search Bar */}
            <div className="w-full sm:w-72 flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <Search size={15} className="text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search food by name..."
                className="w-full bg-transparent text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-slate-400 hover:text-slate-700 font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Quick Filter Control Row */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs focus:outline-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              {uniqueCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* District Filter */}
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs focus:outline-none cursor-pointer"
            >
              <option value="all">All Sri Lanka</option>
              {SRI_LANKAN_DISTRICTS.map((district) => (
                <option key={district.id} value={district.id}>
                  {district.label}
                </option>
              ))}
            </select>

            {/* Price Tier Filter */}
            <select
              value={selectedPrice}
              onChange={(e) => setSelectedPrice(e.target.value)}
              className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs focus:outline-none cursor-pointer"
            >
              <option value="all">Any Price</option>
              <option value="under1000">Under LKR 1,000</option>
              <option value="1000to3000">LKR 1,000 – 3,000</option>
              <option value="over3000">Over LKR 3,000</option>
            </select>

            {/* Price Sort */}
            <select
              value={priceSort}
              onChange={(e) => setPriceSort(e.target.value)}
              className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs focus:outline-none cursor-pointer"
            >
              <option value="default">Sort by: Default</option>
              <option value="asc">Price: Low to High</option>
              <option value="desc">Price: High to Low</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Results Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
          <p className="text-xs font-bold text-slate-500">
            Showing {filteredFoods.length} {filteredFoods.length === 1 ? "dish" : "dishes"}
          </p>
        </div>

        {/* Food Cards Grid */}
        <div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <FoodSkeleton count={8} />
            </div>
          ) : error ? (
            <EmptyState
              icon="search"
              title="Error Loading Dishes"
              description={error}
              actionText="Retry"
              onAction={fetchFoods}
            />
          ) : filteredFoods.length === 0 ? (
            <EmptyState
              icon="food"
              title="No dishes found"
              description="No menu items match your current search and filter selections."
              actionText="Clear Filters"
              onAction={handleResetFilters}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredFoods.map((food, idx) => (
                <FoodCard
                  key={food._id}
                  food={food}
                  shop={food.shop}
                  index={idx}
                  onSelectFood={(f) => setSelectedFoodForModal(f)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Food Detail Modal */}
      <FoodDetailModal
        food={selectedFoodForModal}
        shop={selectedFoodForModal?.shop}
        isOpen={Boolean(selectedFoodForModal)}
        onClose={() => setSelectedFoodForModal(null)}
      />
    </div>
  );
}

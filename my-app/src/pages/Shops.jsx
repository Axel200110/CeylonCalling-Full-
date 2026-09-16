import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { SlidersHorizontal, Search } from "lucide-react";
import CustomerHeader from "../components/customer/CustomerHeader";
import CategoryNav from "../components/customer/CategoryNav";
import FilterPanel from "../components/customer/FilterPanel";
import RestaurantCard from "../components/customer/RestaurantCard";
import CartDrawer from "../components/customer/CartDrawer";
import EmptyState from "../components/customer/EmptyState";
import { RestaurantSkeleton } from "../components/customer/SkeletonLoaders";
import { getPriceTier } from "../utils/formatters";
import { normalizeCategoryId } from "./PartnerWithUs/constants";

export default function Shops() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedFoodCategory, setSelectedFoodCategory] = useState("all");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedPrice, setSelectedPrice] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [selectedServices, setSelectedServices] = useState([]);
  const [sortBy, setSortBy] = useState("featured");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Sync state with URL search params on load
  useEffect(() => {
    const typeParam = searchParams.get("type");
    const catParam = searchParams.get("category");
    const locParam = searchParams.get("location");
    const searchParam = searchParams.get("search");

    if (typeParam) setSelectedType(typeParam);
    if (catParam) setSelectedFoodCategory(catParam);
    if (locParam) setSelectedDistrict(locParam);
    if (searchParam) setSearchQuery(searchParam);
  }, [searchParams]);

  // Fetch Shops
  const fetchShops = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("http://localhost:5000/api/shops/all");
      setShops(Array.isArray(res.data?.shops) ? res.data.shops : []);
    } catch (err) {
      console.error("Error fetching shops:", err);
      setError("Failed to connect to the Ceylon Calling database. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const handleResetFilters = () => {
    setSelectedType("all");
    setSelectedFoodCategory("all");
    setSelectedDistrict("all");
    setSelectedPrice("all");
    setSelectedRating("all");
    setSelectedServices([]);
    setSortBy("featured");
    setSearchQuery("");
    setSearchParams({});
  };

  // Filter computation
  const filteredShops = useMemo(() => {
    return shops
      .filter((shop) => {
        // 1. Filter by establishmentType
        if (selectedType !== "all") {
          const type = (shop.shopType || "").toLowerCase();
          if (selectedType === "restaurant" && type !== "restaurant" && type !== "small_food_shop") {
            return false;
          }
          if (selectedType === "hotel" && type !== "hotel") return false;
          if (selectedType === "villa" && type !== "villa") return false;
          if (selectedType === "guesthouse" && type !== "guesthouse") return false;
        }

        // 2. Filter by Food Category (when restaurant or specific category selected)
        if (selectedFoodCategory !== "all") {
          const shopCategories = (shop.categories || []).map((c) =>
            normalizeCategoryId(String(c).toLowerCase())
          );
          const target = normalizeCategoryId(selectedFoodCategory.toLowerCase());
          const matchCategory =
            shopCategories.some((c) => c.includes(target) || target.includes(c)) ||
            (shop.description || "").toLowerCase().includes(target);
          if (!matchCategory) return false;
        }

        // 3. Filter by district / location
        if (selectedDistrict !== "all") {
          const loc = (shop.location || "").toLowerCase();
          const target = selectedDistrict.toLowerCase();
          if (!loc.includes(target)) return false;
        }

        // 4. Filter by search query
        if (searchQuery.trim() !== "") {
          const q = searchQuery.toLowerCase();
          const nameMatch = (shop.name || "").toLowerCase().includes(q);
          const locMatch = (shop.location || "").toLowerCase().includes(q);
          const descMatch = (shop.description || "").toLowerCase().includes(q);
          const typeMatch = (shop.shopType || "").toLowerCase().includes(q);
          const catMatch = (shop.categories || []).some((c) => String(c).toLowerCase().includes(q));
          if (!nameMatch && !locMatch && !descMatch && !typeMatch && !catMatch) return false;
        }

        // 5. Price tier
        if (selectedPrice !== "all") {
          const tier = getPriceTier(shop.priceRange);
          if (tier !== selectedPrice) return false;
        }

        // 6. Rating filter
        if (selectedRating !== "all") {
          const minRating = parseFloat(selectedRating);
          const shopRating = parseFloat(shop.rating || 4.5);
          if (shopRating < minRating) return false;
        }

        // 7. Services filter
        if (selectedServices.length > 0) {
          const servicesList = (shop.services || []).map((s) => String(s).toLowerCase().replace(/-/g, "_"));
          const hasAllServices = selectedServices.every((reqService) => {
            const normalizedReq = reqService.toLowerCase().replace(/-/g, "_");
            return servicesList.some((s) => s.includes(normalizedReq) || normalizedReq.includes(s));
          });
          if (!hasAllServices) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "rating") {
          return (Number(b.rating) || 4.5) - (Number(a.rating) || 4.5);
        }
        if (sortBy === "likes") {
          return (b.likeCount || 0) - (a.likeCount || 0);
        }
        if (sortBy === "name") {
          return (a.name || "").localeCompare(b.name || "");
        }
        return 0;
      });
  }, [
    shops,
    selectedType,
    selectedFoodCategory,
    selectedDistrict,
    searchQuery,
    selectedPrice,
    selectedRating,
    selectedServices,
    sortBy,
  ]);

  const hasActiveFilters =
    selectedType !== "all" ||
    selectedFoodCategory !== "all" ||
    selectedDistrict !== "all" ||
    selectedPrice !== "all" ||
    selectedRating !== "all" ||
    selectedServices.length > 0 ||
    searchQuery.trim() !== "";

  return (
    <div className="min-h-screen bg-slate-50/40 flex flex-col">
      <CustomerHeader />
      <CartDrawer />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-8">
        {/* Top Header & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Explore All Sri Lankan Venues
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-light mt-1">
              Discover authentic restaurants, boutique hotels, private villas, and guest houses.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, cuisine, city..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-xs"
            />
          </div>
        </div>

        {/* Category Navigation Pills */}
        <CategoryNav
          selectedCategory={selectedType}
          onSelectCategory={(typeId) => {
            setSelectedType(typeId);
            if (typeId !== "restaurant") setSelectedFoodCategory("all");
          }}
          selectedFoodCategory={selectedFoodCategory}
          onSelectFoodCategory={(foodCatId) => setSelectedFoodCategory(foodCatId)}
        />

        {/* Active Filters Summary & Mobile Filter Trigger */}
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-slate-500">
            Showing <strong className="text-slate-900">{filteredShops.length}</strong> matching places
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-xs hover:bg-slate-50"
            >
              <SlidersHorizontal size={14} className="text-emerald-600" />
              <span>Filters</span>
              {hasActiveFilters && <span className="h-2 w-2 rounded-full bg-emerald-500" />}
            </button>

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Results Grid with Sidebar */}
        <div className="flex items-start gap-8">
          <FilterPanel
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedFoodCategory={selectedFoodCategory}
            setSelectedFoodCategory={setSelectedFoodCategory}
            selectedDistrict={selectedDistrict}
            setSelectedDistrict={setSelectedDistrict}
            selectedPrice={selectedPrice}
            setSelectedPrice={setSelectedPrice}
            selectedRating={selectedRating}
            setSelectedRating={setSelectedRating}
            selectedServices={selectedServices}
            setSelectedServices={setSelectedServices}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onResetFilters={handleResetFilters}
            isOpen={isFilterDrawerOpen}
            onClose={() => setIsFilterDrawerOpen(false)}
          />

          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                <RestaurantSkeleton count={6} />
              </div>
            ) : error ? (
              <EmptyState
                icon="search"
                title="Unable to load venues"
                description={error}
                actionText="Retry"
                onAction={fetchShops}
              />
            ) : filteredShops.length === 0 ? (
              <EmptyState
                icon="location"
                title="No venues match your filters"
                description="Try expanding your location or clearing specific filters to see more results."
                actionText="Reset Filters"
                onAction={handleResetFilters}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredShops.map((shop, idx) => (
                  <RestaurantCard key={shop._id} shop={shop} index={idx} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import {
  SlidersHorizontal,
  ArrowRight,
  Utensils,
  Hotel,
  Home as HomeIcon,
  Award,
} from "lucide-react";
import CustomerHeader from "../components/customer/CustomerHeader";
import HeroDiscovery from "../components/customer/HeroDiscovery";
import CategoryNav from "../components/customer/CategoryNav";
import FilterPanel from "../components/customer/FilterPanel";
import RestaurantCard from "../components/customer/RestaurantCard";
import CartDrawer from "../components/customer/CartDrawer";
import EmptyState from "../components/customer/EmptyState";
import { RestaurantSkeleton } from "../components/customer/SkeletonLoaders";
import { getPriceTier } from "../utils/formatters";
import {
  normalizeCategoryId,
} from "./PartnerWithUs/constants";

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();

  // All shops from real MongoDB backend
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Active Filters & Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all"); // 'all', 'restaurant', 'hotel', 'villa', 'guesthouse'
  const [selectedFoodCategory, setSelectedFoodCategory] = useState("all");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedPrice, setSelectedPrice] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [selectedServices, setSelectedServices] = useState([]);
  const [sortBy, setSortBy] = useState("featured");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const discoverySectionRef = useRef(null);

  // Sync state with URL params
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

  // Fetch approved shops from backend
  const fetchShops = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/api/shops/all");
      setShops(Array.isArray(res.data?.shops) ? res.data.shops : []);
    } catch (err) {
      console.error("Error fetching shops:", err);
      setError("Unable to connect to the Ceylon Calling database. Please check connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  // Handler to scroll to discovery grid
  const scrollToDiscovery = () => {
    if (discoverySectionRef.current) {
      discoverySectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Reset all filters
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
        // 1. Establishment Type filter
        if (selectedType !== "all") {
          const type = (shop.shopType || "").toLowerCase();
          if (selectedType === "restaurant" && type !== "restaurant" && type !== "small_food_shop") {
            return false;
          }
          if (selectedType === "stays" && type !== "hotel" && type !== "villa" && type !== "guesthouse") {
            return false;
          }
          if (selectedType === "hotel" && type !== "hotel") return false;
          if (selectedType === "villa" && type !== "villa") return false;
          if (selectedType === "guesthouse" && type !== "guesthouse") return false;
        }

        // 2. Food Category filter (when restaurant or specific food category is selected)
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

        // 3. District / Location filter
        if (selectedDistrict !== "all") {
          const loc = (shop.location || shop.addressDetails?.district || "").toLowerCase();
          const target = selectedDistrict.toLowerCase();
          if (!loc.includes(target)) return false;
        }

        // 4. Search query filter
        if (searchQuery.trim() !== "") {
          const q = searchQuery.toLowerCase();
          const nameMatch = (shop.name || "").toLowerCase().includes(q);
          const locMatch = (shop.location || "").toLowerCase().includes(q);
          const descMatch = (shop.description || "").toLowerCase().includes(q);
          const typeMatch = (shop.shopType || "").toLowerCase().includes(q);
          const catMatch = (shop.categories || []).some((c) => String(c).toLowerCase().includes(q));
          if (!nameMatch && !locMatch && !descMatch && !typeMatch && !catMatch) return false;
        }

        // 5. Price Tier filter
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
        return 0; // featured/default
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

  // Curated Subsets for Sections
  const popularRestaurants = useMemo(() => {
    return shops
      .filter((s) => (s.shopType || "").toLowerCase() === "restaurant")
      .slice(0, 4);
  }, [shops]);

  const boutiqueStays = useMemo(() => {
    return shops
      .filter((s) => ["hotel", "villa", "guesthouse"].includes((s.shopType || "").toLowerCase()))
      .slice(0, 4);
  }, [shops]);

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
      <CustomerHeader onSearchClick={scrollToDiscovery} />
      <CartDrawer />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-12">
        {/* 1. Hero Discovery Section with Multi-Parameter Search */}
        <HeroDiscovery
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedDistrict={selectedDistrict}
          setSelectedDistrict={setSelectedDistrict}
          selectedCategory={selectedType}
          setSelectedCategory={(type) => {
            setSelectedType(type);
            if (type !== "restaurant") setSelectedFoodCategory("all");
          }}
          onSearch={scrollToDiscovery}
        />

        {/* 2. Category Navigation Chips */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Browse by Establishment Type
            </span>
          </div>
          <CategoryNav
            selectedCategory={selectedType}
            onSelectCategory={(typeId) => {
              setSelectedType(typeId);
              if (typeId !== "restaurant") setSelectedFoodCategory("all");
              scrollToDiscovery();
            }}
            selectedFoodCategory={selectedFoodCategory}
            onSelectFoodCategory={(foodCatId) => {
              setSelectedFoodCategory(foodCatId);
              scrollToDiscovery();
            }}
          />
        </div>

        {/* 3. Popular Restaurants Section (Only shown when not actively filtering) */}
        {!hasActiveFilters && popularRestaurants.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-end justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  <Award size={14} />
                  <span>Curated Dining</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                  Popular Restaurants
                </h2>
                <p className="text-xs text-slate-500 font-light mt-0.5">
                  Top-rated dining destinations authentic to Sri Lankan traditions.
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedType("restaurant");
                  scrollToDiscovery();
                }}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-600 hover:text-emerald-700 transition"
              >
                <span>View All Restaurants</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularRestaurants.map((shop, idx) => (
                <RestaurantCard key={shop._id} shop={shop} index={idx} />
              ))}
            </div>
          </section>
        )}

        {/* 4. Boutique Hotels, Villas & Stays Section */}
        {!hasActiveFilters && boutiqueStays.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-end justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  <Hotel size={14} />
                  <span>Island Escapes</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                  Hotels, Resorts, Villas & Guest Houses
                </h2>
                <p className="text-xs text-slate-500 font-light mt-0.5">
                  Scenic lakeside, heritage, and tropical stays for relaxing getaways.
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedType("hotel");
                  scrollToDiscovery();
                }}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-600 hover:text-emerald-700 transition"
              >
                <span>View All Stays</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {boutiqueStays.map((shop, idx) => (
                <RestaurantCard key={shop._id} shop={shop} index={idx} />
              ))}
            </div>
          </section>
        )}

        {/* 5. Main Search Results & Exploration Grid with Filter Sidebar */}
        <section ref={discoverySectionRef} className="pt-6 space-y-6">
          {/* Header of results with count & mobile filter trigger */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {hasActiveFilters ? "Filtered Results" : "All Places & Dining"}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Showing {filteredShops.length} approved {filteredShops.length === 1 ? "venue" : "venues"} in Sri Lanka
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setIsFilterDrawerOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-xs hover:bg-slate-50"
              >
                <SlidersHorizontal size={14} className="text-emerald-600" />
                <span>Filters</span>
                {hasActiveFilters && (
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                )}
              </button>

              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Grid Layout with Desktop Filter Sidebar */}
          <div className="flex items-start gap-8">
            {/* Desktop Filter Panel */}
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

            {/* Results Grid */}
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
                  title="No venues found"
                  description="We couldn't find any places matching your current combination of filters. Try clearing your filters."
                  actionText="Clear All Filters"
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
        </section>
      </main>
    </div>
  );
}

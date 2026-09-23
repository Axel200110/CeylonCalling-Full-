import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import {
  SlidersHorizontal,
  Search,
  X,
  ArrowUpDown,
  AlertCircle,
  RefreshCw,
  RotateCcw,
} from "lucide-react";
import CustomerHeader from "../components/customer/CustomerHeader";
import CategoryNav from "../components/customer/CategoryNav";
import FilterPanel from "../components/customer/FilterPanel";
import BusinessCard from "../components/customer/BusinessCard";
import CartDrawer from "../components/customer/CartDrawer";
import DiscoverSkeleton from "../components/customer/DiscoverSkeleton";
import { getPriceTier } from "../utils/formatters";
import { ESTABLISHMENT_TYPES, normalizeCategoryId } from "./PartnerWithUs/constants";

export const SORT_OPTIONS = [
  { id: "featured", label: "Relevance" },
  { id: "rating", label: "Highest Rated" },
  { id: "likes", label: "Most Liked" },
  { id: "name", label: "Alphabetical (A–Z)" },
];

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
  const [selectedCity, setSelectedCity] = useState("all");
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
    const cityParam = searchParams.get("city");
    const searchParam = searchParams.get("search") || searchParams.get("q");

    if (typeParam) setSelectedType(typeParam);
    if (catParam) setSelectedFoodCategory(catParam);
    if (locParam) setSelectedDistrict(locParam);
    if (cityParam) setSelectedCity(cityParam);
    if (searchParam) setSearchQuery(searchParam);
  }, [searchParams]);

  // Fetch Shops
  const fetchShops = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/api/shops/all");
      setShops(Array.isArray(res.data?.shops) ? res.data.shops : []);
    } catch (err) {
      console.error("Error fetching shops:", err);
      setError("Unable to load places right now. Please check your connection and try again.");
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
    setSelectedCity("all");
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
          if (selectedType === "stays" && type !== "hotel" && type !== "villa" && type !== "guesthouse") {
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
          const loc = (shop.location || shop.addressDetails?.district || "").toLowerCase();
          const target = selectedDistrict.toLowerCase();
          if (!loc.includes(target)) return false;
        }

        // 3b. Filter by town / tourism zone
        if (selectedCity !== "all") {
          const town = (shop.addressDetails?.city || shop.location || "").toLowerCase();
          const targetCity = selectedCity.toLowerCase();
          if (!town.includes(targetCity)) return false;
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
    selectedCity,
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
    selectedCity !== "all" ||
    selectedPrice !== "all" ||
    selectedRating !== "all" ||
    selectedServices.length > 0 ||
    searchQuery.trim() !== "";

  const activeFiltersCount =
    (selectedType !== "all" ? 1 : 0) +
    (selectedFoodCategory !== "all" ? 1 : 0) +
    (selectedDistrict !== "all" ? 1 : 0) +
    (selectedCity !== "all" ? 1 : 0) +
    (selectedPrice !== "all" ? 1 : 0) +
    (selectedRating !== "all" ? 1 : 0) +
    selectedServices.length;

  const typeLabel =
    selectedType === "stays"
      ? "Hotels & Stays"
      : ESTABLISHMENT_TYPES.find((t) => t.id === selectedType)?.label || selectedType;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      <CustomerHeader />
      <CartDrawer />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-6">
        {/* 1. Venues Introduction (matches the Discover page's intro block) */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Explore All Sri Lankan Venues
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            Discover authentic restaurants, boutique hotels, private villas, and guest houses.
          </p>
        </div>

        {/* 2. Search Bar (same visual language as Discover) */}
        <div className="relative max-w-3xl">
          <label htmlFor="shops-search-input" className="sr-only">
            Search by name, cuisine, city
          </label>
          <div className="relative flex items-center">
            <Search
              size={18}
              className="absolute left-4 text-slate-400 pointer-events-none shrink-0"
              aria-hidden="true"
            />
            <input
              id="shops-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, cuisine, city..."
              className="w-full pl-11 pr-10 py-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-xs transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                aria-label="Clear search text"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        {/* 3. Category Navigation Pills */}
        <CategoryNav
          selectedCategory={selectedType}
          onSelectCategory={(typeId) => {
            setSelectedType(typeId);
            if (typeId !== "restaurant") setSelectedFoodCategory("all");
          }}
          selectedFoodCategory={selectedFoodCategory}
          onSelectFoodCategory={(foodCatId) => setSelectedFoodCategory(foodCatId)}
        />

        {/* 4. Mobile Filter & Sort Triggers (< 1024px) */}
        <div className="flex lg:hidden items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={() => setIsFilterDrawerOpen(true)}
            className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs font-semibold shadow-xs hover:bg-slate-50 active:bg-slate-100 transition"
          >
            <SlidersHorizontal size={15} className="text-emerald-600" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>

          <div className="relative min-h-[44px] flex items-center">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="min-h-[44px] bg-white border border-slate-200 rounded-lg pl-3 pr-8 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer shadow-xs appearance-none"
              aria-label="Sort places"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  Sort: {opt.label}
                </option>
              ))}
            </select>
            <ArrowUpDown size={13} className="absolute right-2.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* 5. Desktop Two-Column Layout (Filters Sidebar + Results) */}
        <div className="flex items-start gap-8 pt-2">
          <FilterPanel
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedFoodCategory={selectedFoodCategory}
            setSelectedFoodCategory={setSelectedFoodCategory}
            selectedDistrict={selectedDistrict}
            setSelectedDistrict={setSelectedDistrict}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            selectedPrice={selectedPrice}
            setSelectedPrice={setSelectedPrice}
            selectedRating={selectedRating}
            setSelectedRating={setSelectedRating}
            selectedServices={selectedServices}
            setSelectedServices={setSelectedServices}
            onResetFilters={handleResetFilters}
            isOpen={isFilterDrawerOpen}
            onClose={() => setIsFilterDrawerOpen(false)}
          />

          <section className="flex-1 min-w-0 space-y-4">
            {/* Active Filter Chips Summary */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 pt-1 pb-2">
                <span className="text-xs font-medium text-slate-400">Active filters:</span>

                {searchQuery.trim() && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs text-slate-700 font-medium shadow-2xs">
                    <span>"{searchQuery}"</span>
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}

                {selectedType !== "all" && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs text-slate-700 font-medium shadow-2xs">
                    <span>Type: {typeLabel}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedType("all")}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}

                {selectedFoodCategory !== "all" && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs text-slate-700 font-medium shadow-2xs">
                    <span>Cuisine: {selectedFoodCategory.replace(/_/g, " ")}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedFoodCategory("all")}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}

                {selectedDistrict !== "all" && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs text-slate-700 font-medium shadow-2xs">
                    <span>District: {selectedDistrict}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDistrict("all");
                        setSelectedCity("all");
                      }}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}

                {selectedCity !== "all" && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs text-slate-700 font-medium shadow-2xs">
                    <span>Town: {selectedCity}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedCity("all")}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}

                {selectedPrice !== "all" && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs text-slate-700 font-medium shadow-2xs">
                    <span>Price: {selectedPrice}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedPrice("all")}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}

                {selectedRating !== "all" && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs text-slate-700 font-medium shadow-2xs">
                    <span>★ {selectedRating} &amp; up</span>
                    <button
                      type="button"
                      onClick={() => setSelectedRating("all")}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}

                {selectedServices.map((svc) => (
                  <span
                    key={svc}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs text-slate-700 font-medium shadow-2xs"
                  >
                    <span className="capitalize">{svc.replace(/_/g, " ")}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedServices(selectedServices.filter((s) => s !== svc))}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}

                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline ml-1"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Result Toolbar: Count & Desktop Sort */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
              <div>
                <p className="text-xs sm:text-sm font-semibold text-slate-900">
                  {loading ? (
                    "Searching places..."
                  ) : (
                    <>
                      <span className="font-bold">{filteredShops.length}</span>{" "}
                      {filteredShops.length === 1 ? "place" : "places"} found
                    </>
                  )}
                </p>
              </div>

              <div className="hidden lg:flex items-center gap-2">
                <label htmlFor="shops-sort-select" className="text-xs font-medium text-slate-500">
                  Sort by:
                </label>
                <div className="relative">
                  <select
                    id="shops-sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer shadow-2xs appearance-none"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ArrowUpDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Results Grid Container */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                <DiscoverSkeleton count={6} />
              </div>
            ) : error ? (
              <div className="rounded-xl border border-red-200 bg-red-50/70 p-8 text-center space-y-3 my-4">
                <AlertCircle size={32} className="text-red-500 mx-auto" />
                <h3 className="text-sm font-bold text-red-900">Unable to load venues</h3>
                <p className="text-xs text-red-700 max-w-md mx-auto">{error}</p>
                <button
                  type="button"
                  onClick={fetchShops}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs transition"
                >
                  <RefreshCw size={12} />
                  <span>Retry</span>
                </button>
              </div>
            ) : filteredShops.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white p-10 text-center space-y-3 my-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                  <Search size={20} />
                </div>
                <h3 className="text-base font-bold text-slate-900">No venues match your filters</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto font-normal">
                  Try expanding your location or clearing specific filters to see more results.
                </p>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold shadow-xs transition"
                  >
                    <RotateCcw size={12} />
                    <span>Clear all filters</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredShops.map((shop) => (
                  <BusinessCard key={shop._id} shop={shop} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import {
  Search,
  X,
  SlidersHorizontal,
  RotateCcw,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import CustomerHeader from "../components/customer/CustomerHeader";
import CartDrawer from "../components/customer/CartDrawer";
import BusinessCard from "../components/customer/BusinessCard";
import DiscoverFilterSidebar, {
  CAPABILITY_OPTIONS,
  FACILITY_OPTIONS,
  PRICE_TIER_OPTIONS,
  RATING_FILTER_OPTIONS,
} from "../components/customer/DiscoverFilterSidebar";
import DiscoverMobileFilter from "../components/customer/DiscoverMobileFilter";
import DiscoverSkeleton from "../components/customer/DiscoverSkeleton";
import { getPriceTier } from "../utils/formatters";
import {
  ESTABLISHMENT_TYPES,
  SRI_LANKAN_DISTRICTS,
} from "./PartnerWithUs/constants";

const ITEMS_PER_PAGE = 9;

export const SORT_OPTIONS = [
  { id: "featured", label: "Relevance" },
  { id: "rating", label: "Highest Rated" },
  { id: "likes", label: "Most Liked" },
  { id: "name_asc", label: "Alphabetical (A–Z)" },
  { id: "name_desc", label: "Alphabetical (Z–A)" },
];

export default function DiscoverPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Raw data from real backend
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get("q") || "");
  const [selectedDistrict, setSelectedDistrict] = useState(searchParams.get("district") || "all");
  const [selectedCity, setSelectedCity] = useState(searchParams.get("city") || "all");
  const [selectedType, setSelectedType] = useState(searchParams.get("type") || "all");
  const [selectedCapabilities, setSelectedCapabilities] = useState(
    searchParams.get("caps") ? searchParams.get("caps").split(",").filter(Boolean) : []
  );
  const [selectedFacilities, setSelectedFacilities] = useState(
    searchParams.get("facs") ? searchParams.get("facs").split(",").filter(Boolean) : []
  );
  const [selectedPrice, setSelectedPrice] = useState(searchParams.get("price") || "all");
  const [selectedRating, setSelectedRating] = useState(searchParams.get("rating") || "all");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "featured");
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page"), 10) || 1);

  // Mobile Filter Drawer
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Debounce search input by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Sync state changes to URL query parameters
  useEffect(() => {
    const params = {};
    if (debouncedSearch.trim()) params.q = debouncedSearch.trim();
    if (selectedDistrict !== "all") params.district = selectedDistrict;
    if (selectedCity !== "all") params.city = selectedCity;
    if (selectedType !== "all") params.type = selectedType;
    if (selectedCapabilities.length > 0) params.caps = selectedCapabilities.join(",");
    if (selectedFacilities.length > 0) params.facs = selectedFacilities.join(",");
    if (selectedPrice !== "all") params.price = selectedPrice;
    if (selectedRating !== "all") params.rating = selectedRating;
    if (sortBy !== "featured") params.sort = sortBy;
    if (currentPage > 1) params.page = String(currentPage);

    setSearchParams(params, { replace: true });
  }, [
    debouncedSearch,
    selectedDistrict,
    selectedCity,
    selectedType,
    selectedCapabilities,
    selectedFacilities,
    selectedPrice,
    selectedRating,
    sortBy,
    currentPage,
    setSearchParams,
  ]);

  // Reset to page 1 whenever any filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [
    debouncedSearch,
    selectedDistrict,
    selectedCity,
    selectedType,
    selectedCapabilities,
    selectedFacilities,
    selectedPrice,
    selectedRating,
    sortBy,
  ]);

  // Fetch approved shops from backend
  const fetchShops = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/api/shops/all");
      setShops(Array.isArray(res.data?.shops) ? res.data.shops : []);
    } catch (err) {
      console.error("Discover fetch error:", err);
      setError("Unable to load places right now. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShops();
  }, [fetchShops]);

  // Reset all filters action
  const handleResetFilters = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setSelectedDistrict("all");
    setSelectedCity("all");
    setSelectedType("all");
    setSelectedCapabilities([]);
    setSelectedFacilities([]);
    setSelectedPrice("all");
    setSelectedRating("all");
    setSortBy("featured");
    setCurrentPage(1);
  };

  // 1. Strict multi-parameter filter computation (Server-authoritative data)
  const filteredShops = useMemo(() => {
    return shops
      .filter((shop) => {
        // Location: District
        if (selectedDistrict !== "all") {
          const shopDistrict = (
            shop.location?.district ||
            shop.addressDetails?.district ||
            (typeof shop.location === "string" ? shop.location : "")
          ).toLowerCase();
          const targetDistrict = selectedDistrict.toLowerCase();
          if (!shopDistrict.includes(targetDistrict)) return false;
        }

        // Location: City / Area
        if (selectedCity !== "all") {
          const shopCity = (
            shop.location?.city ||
            shop.addressDetails?.city ||
            (typeof shop.location === "string" ? shop.location : "")
          ).toLowerCase();
          const targetCity = selectedCity.toLowerCase();
          if (!shopCity.includes(targetCity)) return false;
        }

        // Business Type
        if (selectedType !== "all") {
          const type = (shop.shopType || "").toLowerCase();
          if (selectedType === "restaurant" && type !== "restaurant" && type !== "small_food_shop") {
            return false;
          }
          if (selectedType === "hotel" && type !== "hotel") return false;
          if (selectedType === "villa" && type !== "villa") return false;
          if (selectedType === "guesthouse" && type !== "guesthouse") return false;
        }

        // Search Query
        if (debouncedSearch.trim()) {
          const q = debouncedSearch.toLowerCase();
          const nameMatch = (shop.name || "").toLowerCase().includes(q);
          const descMatch = (shop.description || shop.businessDescription || "").toLowerCase().includes(q);
          const locMatch = (
            (shop.location?.address || "") + " " +
            (shop.location?.city || "") + " " +
            (shop.addressDetails?.city || "") + " " +
            (typeof shop.location === "string" ? shop.location : "")
          ).toLowerCase().includes(q);
          const catMatch = Array.isArray(shop.categories) && shop.categories.some((c) => String(c).toLowerCase().includes(q));
          if (!nameMatch && !descMatch && !locMatch && !catMatch) return false;
        }

        // Capabilities (Services provided by business)
        if (selectedCapabilities.length > 0) {
          const hasAllCapabilities = selectedCapabilities.every((capId) => {
            const opt = CAPABILITY_OPTIONS.find((c) => c.id === capId);
            if (!opt) return true;
            // Check direct boolean field on shop.capabilities
            if (shop.capabilities && shop.capabilities[opt.field] === true) {
              return true;
            }
            // Check services string array fallback
            if (Array.isArray(shop.services)) {
              return shop.services.some((s) => s.toLowerCase().includes(capId.replace("_", "")));
            }
            return false;
          });
          if (!hasAllCapabilities) return false;
        }

        // Facilities (Physical amenities)
        if (selectedFacilities.length > 0) {
          const shopServices = (shop.services || []).map((s) => String(s).toLowerCase().replace(/-/g, "_"));
          const hasAllFacilities = selectedFacilities.every((facId) => {
            const normalized = facId.toLowerCase().replace(/-/g, "_");
            return shopServices.some((s) => s.includes(normalized) || normalized.includes(s));
          });
          if (!hasAllFacilities) return false;
        }

        // Price Tier
        if (selectedPrice !== "all") {
          const tier = getPriceTier(shop.priceRange);
          if (tier !== selectedPrice) return false;
        }

        // Minimum Rating
        if (selectedRating !== "all") {
          const minRating = parseFloat(selectedRating);
          const currentRating = parseFloat(shop.rating || 4.5);
          if (currentRating < minRating) return false;
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
        if (sortBy === "name_asc") {
          return (a.name || "").localeCompare(b.name || "");
        }
        if (sortBy === "name_desc") {
          return (b.name || "").localeCompare(a.name || "");
        }
        // Default / Featured: Business Type Priority (Restaurants -> Hotels -> Villas -> Guest Houses)
        const typeOrder = {
          restaurant: 1,
          small_food_shop: 1,
          hotel: 2,
          villa: 3,
          guesthouse: 4,
        };
        const orderA = typeOrder[(a.shopType || "").toLowerCase()] || 5;
        const orderB = typeOrder[(b.shopType || "").toLowerCase()] || 5;
        if (orderA !== orderB) {
          return orderA - orderB;
        }
        return (Number(b.rating) || 4.5) - (Number(a.rating) || 4.5);
      });
  }, [
    shops,
    selectedDistrict,
    selectedCity,
    selectedType,
    debouncedSearch,
    selectedCapabilities,
    selectedFacilities,
    selectedPrice,
    selectedRating,
    sortBy,
  ]);

  // 2. Pagination calculation
  const totalPages = Math.ceil(filteredShops.length / ITEMS_PER_PAGE) || 1;
  const paginatedShops = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredShops.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredShops, currentPage]);

  // Check if any filters are active
  const hasActiveFilters =
    debouncedSearch.trim() !== "" ||
    selectedDistrict !== "all" ||
    selectedCity !== "all" ||
    selectedType !== "all" ||
    selectedCapabilities.length > 0 ||
    selectedFacilities.length > 0 ||
    selectedPrice !== "all" ||
    selectedRating !== "all";

  // Total active filter count for badge
  const activeFiltersCount =
    (selectedDistrict !== "all" ? 1 : 0) +
    (selectedCity !== "all" ? 1 : 0) +
    (selectedType !== "all" ? 1 : 0) +
    selectedCapabilities.length +
    selectedFacilities.length +
    (selectedPrice !== "all" ? 1 : 0) +
    (selectedRating !== "all" ? 1 : 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      <CustomerHeader />
      <CartDrawer />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-6">
        {/* 1. Discover Introduction (Clean, Compact, No Clutter) */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Discover
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-normal">
            Find places, food and stays around North Central Sri Lanka.
          </p>
        </div>

        {/* 2. Professional Search Bar */}
        <div className="relative max-w-3xl">
          <label htmlFor="discover-search-input" className="sr-only">
            Search businesses, food, places
          </label>
          <div className="relative flex items-center">
            <Search
              size={18}
              className="absolute left-4 text-slate-400 pointer-events-none shrink-0"
              aria-hidden="true"
            />
            <input
              id="discover-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search businesses, food, places..."
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

        {/* 3. Mobile Filter & Sort Triggers (< 1024px) */}
        <div className="flex lg:hidden items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
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

          {/* Mobile Sort Dropdown */}
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

        {/* 4. Desktop Two-Column Layout (Filters Sidebar + Main Discovery Area) */}
        <div className="flex items-start gap-8 pt-2">
          {/* Left Column: Desktop Filter Panel (Sticky, max-w-72) */}
          <aside className="hidden lg:block w-72 shrink-0 bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs self-start sticky top-24">
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <SlidersHorizontal size={16} className="text-emerald-600" />
                <span>Filters</span>
              </div>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>

            <DiscoverFilterSidebar
              selectedDistrict={selectedDistrict}
              setSelectedDistrict={setSelectedDistrict}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              selectedCapabilities={selectedCapabilities}
              setSelectedCapabilities={setSelectedCapabilities}
              selectedFacilities={selectedFacilities}
              setSelectedFacilities={setSelectedFacilities}
              selectedPrice={selectedPrice}
              setSelectedPrice={setSelectedPrice}
              selectedRating={selectedRating}
              setSelectedRating={setSelectedRating}
              onResetFilters={handleResetFilters}
              totalResultsCount={filteredShops.length}
            />
          </aside>

          {/* Right Column: Active Summary + Result Toolbar + Grid + Pagination */}
          <section className="flex-1 min-w-0 space-y-4">
            {/* Active Filter Chips Summary */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 pt-1 pb-2">
                <span className="text-xs font-medium text-slate-400">Active filters:</span>

                {debouncedSearch && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs text-slate-700 font-medium shadow-2xs">
                    <span>"{debouncedSearch}"</span>
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}

                {selectedDistrict !== "all" && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs text-slate-700 font-medium shadow-2xs">
                    <span>{SRI_LANKAN_DISTRICTS.find((d) => d.id === selectedDistrict)?.label || selectedDistrict}</span>
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
                    <span>{selectedCity}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedCity("all")}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}

                {selectedType !== "all" && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs text-slate-700 font-medium shadow-2xs">
                    <span>{ESTABLISHMENT_TYPES.find((t) => t.id === selectedType)?.label || selectedType}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedType("all")}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}

                {selectedCapabilities.map((capId) => {
                  const label = CAPABILITY_OPTIONS.find((c) => c.id === capId)?.label || capId;
                  return (
                    <span
                      key={capId}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs text-slate-700 font-medium shadow-2xs"
                    >
                      <span>{label}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedCapabilities(selectedCapabilities.filter((c) => c !== capId))
                        }
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  );
                })}

                {selectedFacilities.map((facId) => {
                  const label = FACILITY_OPTIONS.find((f) => f.id === facId)?.label || facId;
                  return (
                    <span
                      key={facId}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs text-slate-700 font-medium shadow-2xs"
                    >
                      <span>{label}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedFacilities(selectedFacilities.filter((f) => f !== facId))
                        }
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  );
                })}

                {selectedPrice !== "all" && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs text-slate-700 font-medium shadow-2xs">
                    <span>Price: {PRICE_TIER_OPTIONS.find((p) => p.id === selectedPrice)?.label}</span>
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

              {/* Desktop Sort Selector */}
              <div className="hidden lg:flex items-center gap-2">
                <label htmlFor="desktop-sort-select" className="text-xs font-medium text-slate-500">
                  Sort by:
                </label>
                <div className="relative">
                  <select
                    id="desktop-sort-select"
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
                <h3 className="text-sm font-bold text-red-900">Unable to load places</h3>
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
                <h3 className="text-base font-bold text-slate-900">No places found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto font-normal">
                  We couldn't find any places matching your current search terms and filters. Try adjusting or clearing your filters.
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
                {paginatedShops.map((shop) => (
                  <BusinessCard key={shop._id} shop={shop} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {!loading && !error && filteredShops.length > ITEMS_PER_PAGE && (
              <nav
                className="pt-6 pb-2 border-t border-slate-200/80 flex items-center justify-between gap-4"
                aria-label="Discovery pagination"
              >
                <p className="text-xs text-slate-500">
                  Showing <span className="font-semibold text-slate-800">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{" "}
                  <span className="font-semibold text-slate-800">
                    {Math.min(currentPage * ITEMS_PER_PAGE, filteredShops.length)}
                  </span>{" "}
                  of <span className="font-semibold text-slate-800">{filteredShops.length}</span> places
                </p>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-slate-600 text-xs font-semibold flex items-center gap-1 transition"
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={14} />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const pageNum = idx + 1;
                      const isCurrent = pageNum === currentPage;
                      return (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => setCurrentPage(pageNum)}
                          className={`h-8 w-8 rounded-lg text-xs font-semibold transition ${
                            isCurrent
                              ? "bg-emerald-600 text-white shadow-2xs"
                              : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                          }`}
                          aria-current={isCurrent ? "page" : undefined}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-slate-600 text-xs font-semibold flex items-center gap-1 transition"
                    aria-label="Next page"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </nav>
            )}
          </section>
        </div>

        {/* Mobile Filter Modal Bottom Sheet */}
        <DiscoverMobileFilter
          isOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
          selectedDistrict={selectedDistrict}
          setSelectedDistrict={setSelectedDistrict}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedCapabilities={selectedCapabilities}
          setSelectedCapabilities={setSelectedCapabilities}
          selectedFacilities={selectedFacilities}
          setSelectedFacilities={setSelectedFacilities}
          selectedPrice={selectedPrice}
          setSelectedPrice={setSelectedPrice}
          selectedRating={selectedRating}
          setSelectedRating={setSelectedRating}
          onResetFilters={handleResetFilters}
          totalResultsCount={filteredShops.length}
        />
      </main>
    </div>
  );
}

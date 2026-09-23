import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
    FaBoxes,
    FaCheckCircle,
    FaChevronLeft,
    FaChevronRight,
    FaEdit,
    FaExclamationTriangle,
    FaFilter,
    FaFolderPlus,
    FaInbox,
    FaPlus,
    FaSearch,
    FaStore,
    FaSyncAlt,
    FaTags,
    FaTrashAlt,
    FaWallet
} from "react-icons/fa";
import { useLocation } from "react-router-dom";

import Navigation from "../../shopowner/components/SideNavbar";
import { useAuthStore } from "../../shopowner/store/authStore";
import AddCategory from "../components/AddCategory";
import AddFoodItem from "../components/AddFoodItem";
import EditFood from "../components/EditFood";
import ShopEditModal from "../components/ShopEdit";
import ShopStats from "../components/ShopState";

const getDisplayImage = (photo) => {
  if (!photo) return "https://via.placeholder.com/600x300?text=No+Image+Available";
  if (photo.startsWith("http://") || photo.startsWith("https://")) return photo;
  if (photo.startsWith("/uploads")) return photo;
  if (photo.startsWith("uploads")) return "/" + photo;
  return photo;
};

const MyShop = () => {
  const shop = useAuthStore((state) => state.shop);
  const isLoadingShop = useAuthStore((state) => state.isLoading);

  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal States
  const [editingFood, setEditingFood] = useState(null);
  const [showShopEdit, setShowShopEdit] = useState(false);
  const [showAddFood, setShowAddFood] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);

  const location = useLocation();
  const foodsPerPage = 6;

  // Handle cross-navigation triggers
  useEffect(() => {
    if (location.state?.openAddFood) {
      setShowAddFood(true);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Data Fetcher
  const fetchAllData = async () => {
    setLoading(true);
    setError("");
    try {
      const [categoriesRes, foodsRes] = await Promise.all([
        fetch("/api/categories/my-shop", { credentials: "include" }),
        fetch("/api/food/my-shop", { credentials: "include" }),
      ]);

      if (!categoriesRes.ok || !foodsRes.ok) {
        throw new Error("Server responded with an error standard.");
      }

      const categoriesData = await categoriesRes.json();
      const foodsData = await foodsRes.json();

      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      setFoods(Array.isArray(foodsData) ? foodsData : []);
    } catch (err) {
      setError("Failed to synchronize merchant catalog data. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shop) fetchAllData();
  }, [shop]);

  // Event Handlers
  const handleAddCategory = (newCat) => {
    setCategories((prev) => [...prev, newCat]);
  };

  const handleAddFood = (newFood) => {
    const updatedCategory =
      categories.find((c) => c._id === newFood.category) || newFood.category || null;
    setFoods((prev) => [{ ...newFood, category: updatedCategory }, ...prev]);
  };

  const handleUpdateFood = (updated) => {
    const updatedCategory =
      categories.find(
        (c) => c._id === updated.categoryId || (updated.category && c._id === updated.category._id)
      ) || updated.category || null;

    setFoods((prev) =>
      prev.map((f) => (f._id === updated._id ? { ...updated, category: updatedCategory } : f))
    );
    setEditingFood(null);
  };

  const handleQuickAvailability = async (id, newAvailability) => {
    try {
      const res = await fetch(`/api/food/${id}/availability`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ availability: newAvailability }),
      });
      if (!res.ok) throw new Error();
      setFoods((prev) =>
        prev.map((f) => (f._id === id ? { ...f, availability: newAvailability } : f))
      );
    } catch {
      alert("Failed to update availability status");
    }
  };

  const handleDeleteFood = async (id) => {
    if (!window.confirm("Are you sure you want to permanently remove this item from your inventory?")) return;
    try {
      const res = await fetch(`/api/food/${id}`, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error();
      setFoods((prev) => prev.filter((f) => f._id !== id));
      if (editingFood?._id === id) setEditingFood(null);
    } catch {
      alert("Operational failure: Could not remove requested item.");
    }
  };

  const handleDeleteCategory = async (categoryName) => {
    if (!window.confirm(`Delete category "${categoryName}"? Associated products will become uncategorized.`)) return;
    try {
      const categoryObj = categories.find((c) => c.name === categoryName);
      if (!categoryObj) throw new Error();

      const res = await fetch(`/api/categories/${categoryObj._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error();

      setCategories((prev) => prev.filter((c) => c._id !== categoryObj._id));
      setFoods((prev) =>
        prev.map((f) => (f.category?.name === categoryName ? { ...f, category: null } : f))
      );
      if (selectedCategory === categoryName) setSelectedCategory("All");
    } catch {
      alert("Operational failure: Could not delete requested category node.");
    }
  };

  // Analytics Calculations
  const totalCatalogValue = useMemo(() => {
    return foods.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
  }, [foods]);

  const allCategoryNames = useMemo(() => {
    return Array.from(new Set(categories.map((c) => c.name)));
  }, [categories]);

  // Filtering & Pagination
  const filteredFoods = useMemo(() => {
    return foods.filter((food) => {
      const matchesCategory =
        selectedCategory === "All" || (food.category && food.category.name === selectedCategory);
      const matchesSearch =
        food.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        food.description?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [foods, selectedCategory, searchTerm]);

  const totalPages = Math.ceil(filteredFoods.length / foodsPerPage);
  const currentFoods = useMemo(() => {
    const indexOfLastFood = currentPage * foodsPerPage;
    const indexOfFirstFood = indexOfLastFood - foodsPerPage;
    return filteredFoods.slice(indexOfFirstFood, indexOfLastFood);
  }, [filteredFoods, currentPage, foodsPerPage]);

  // Dynamic Page Resets
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  /* ================= SKELETON LOADING STATE ================= */
  if (isLoadingShop || loading) {
    return (
      <div className="flex min-h-screen bg-[#07090E] text-slate-100">
        <Navigation />
        <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-pulse">
          <div className="h-32 bg-white/[0.03] border border-white/[0.08] rounded-3xl w-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-32 bg-white/[0.03] border border-white/[0.08] rounded-3xl" />
            ))}
          </div>
          <div className="h-64 bg-white/[0.03] border border-white/[0.08] rounded-3xl w-full" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-72 bg-white/[0.03] border border-white/[0.08] rounded-3xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ================= ERROR / DISCONNECTED STATE ================= */
  if (error || !shop) {
    return (
      <div className="flex min-h-screen bg-[#07090E] text-slate-100 relative overflow-hidden">
        <Navigation />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative z-10">
          <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center mb-4 text-2xl shadow-xl shadow-rose-500/5">
            <FaExclamationTriangle />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Portal Disconnected</h2>
          <p className="text-slate-400 text-xs max-w-md mt-1.5 leading-relaxed">
            {error || "No active shop profile linked to this session account."}
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={fetchAllData}
            className="mt-6 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-semibold rounded-xl transition shadow-lg shadow-emerald-500/20 border border-emerald-400/20"
          >
            Retry Connection
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#07090E] text-slate-100 antialiased font-sans relative selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Background Lighting Halos */}
      <div className="fixed top-0 left-1/4 w-[700px] h-[700px] bg-emerald-600/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="fixed bottom-0 right-10 w-[550px] h-[550px] bg-indigo-600/5 rounded-full blur-[150px] pointer-events-none" />

      <Navigation />

      <main className="flex-1 px-4 sm:px-8 py-8 max-w-7xl mx-auto w-full space-y-8 relative z-10 overflow-x-hidden">
        
        {/* ================= HEADER CONTROL PANEL ================= */}
        <section className="p-6 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] shadow-2xl relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-emerald-400 via-teal-500 to-indigo-500" />

          <div className="flex items-center gap-5 pl-2">
            <div className="relative shrink-0">
              <img
                src={getDisplayImage(shop.photo)}
                alt={shop.name}
                className="w-20 h-20 rounded-2xl object-cover border border-white/[0.12] shadow-xl"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#07090E] rounded-full shadow-lg shadow-emerald-500/50" title="Store Live & Active" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                  <FaCheckCircle className="text-[9px]" /> Verified Merchant
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight capitalize mt-1">
                {shop.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 font-normal mt-0.5">
                {shop.tagline || "Merchant Operations & Management Console"}
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5 border-t border-white/[0.08] lg:border-t-0 pt-4 lg:pt-0">
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={fetchAllData}
              disabled={loading}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-medium text-slate-300 hover:text-white transition shadow-sm"
            >
              <FaSyncAlt className={loading ? "animate-spin text-emerald-400" : "text-slate-400"} />
              <span>Sync Catalog</span>
            </motion.button>

            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddCategory(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-medium text-slate-300 hover:text-white transition shadow-sm"
            >
              <FaFolderPlus className="text-slate-400" />
              <span>Add Category</span>
            </motion.button>

            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddFood(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-semibold border border-emerald-400/20 transition shadow-lg shadow-emerald-500/20"
            >
              <FaPlus className="text-white/90 text-[10px]" />
              <span>Add Product</span>
            </motion.button>

            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowShopEdit(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-white text-xs font-semibold transition shadow-sm"
            >
              <FaStore className="text-slate-400" />
              <span>Store Config</span>
            </motion.button>
          </div>
        </section>

        {/* ================= METRIC CARDS OVERVIEW ================= */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="p-6 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-2xl relative overflow-hidden group hover:border-white/[0.15] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Products</span>
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                <FaBoxes className="text-base" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-extrabold text-white tracking-tight">{foods.length}</span>
              <span className="text-xs text-slate-500 ml-2">Active inventory items</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-2xl relative overflow-hidden group hover:border-white/[0.15] transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Categories</span>
              <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform">
                <FaTags className="text-base" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-extrabold text-white tracking-tight">{categories.length}</span>
              <span className="text-xs text-slate-500 ml-2">Organized node groups</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-2xl relative overflow-hidden group hover:border-white/[0.15] transition-all sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Catalog Valuation</span>
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform">
                <FaWallet className="text-base" />
              </div>
            </div>
            <div className="mt-4 truncate">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                LKR {totalCatalogValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </section>
{/* ================= INVENTORY CONTROLS BAR ================= */}
        <section className="p-5 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-2xl space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Search Field */}
            <div className="relative w-full lg:max-w-xs">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
              <input
                type="text"
                placeholder="Search food items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/[0.08] text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
              <div className="flex items-center gap-1.5 text-slate-400 pr-2 border-r border-white/[0.08] text-xs font-semibold shrink-0">
                <FaFilter className="text-[10px] text-slate-500" /> Filter:
              </div>
              
              <button
                onClick={() => setSelectedCategory("All")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 border ${
                  selectedCategory === "All"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : "bg-slate-900/60 text-slate-400 border-white/[0.06] hover:text-slate-200 hover:border-white/[0.12]"
                }`}
              >
                All Items
              </button>

              {allCategoryNames.map((cat) => (
                <div
                  key={cat}
                  className="flex items-center shrink-0 bg-slate-900/60 border border-white/[0.06] rounded-xl px-1.5 py-1 transition-all"
                >
                  <button
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-0.5 rounded-lg text-xs font-medium transition-all ${
                      selectedCategory === cat
                        ? "bg-emerald-500/20 text-emerald-300 font-semibold"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                  <button
                    className="ml-1 p-1 text-slate-500 hover:text-rose-400 rounded-md hover:bg-rose-500/10 transition"
                    onClick={() => handleDeleteCategory(cat)}
                    title={`Delete category: ${cat}`}
                  >
                    <FaTrashAlt className="text-[9px]" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>


          {/* ================= INVENTORY DISPLAY GRID ================= */}
<section className="relative">
  {currentFoods.length === 0 ? (
    /* Empty State Container */
    <div className="relative overflow-hidden py-24 rounded-3xl bg-slate-950/40 backdrop-blur-2xl border border-white/[0.08] text-center flex flex-col items-center justify-center p-8 shadow-2xl">
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-radial-gradient from-emerald-500/10 via-transparent to-transparent opacity-50 blur-2xl pointer-events-none" />
      
      <div className="relative z-10 w-16 h-16 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-center text-slate-400 mb-4 text-2xl shadow-inner backdrop-blur-md">
        <FaInbox />
      </div>
      <h3 className="relative z-10 text-base font-semibold text-white tracking-tight">No Items in Inventory</h3>
      <p className="relative z-10 text-xs text-slate-400 max-w-sm mt-1.5 leading-relaxed font-normal">
        No items matched your active search criteria or category filters. Try resetting filters to explore your catalog.
      </p>
    </div>
  ) : (
    /* Grid Container */
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence mode="popLayout">
        {currentFoods.map((food, index) => (
          <motion.div
            key={food._id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{
              duration: 0.35,
              delay: index * 0.04,
              ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier spring feel
            }}
            whileHover={{ y: -6 }}
            className="group relative flex flex-col justify-between rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-900/60 border border-white/[0.04] hover:border-emerald-500/30 shadow-lg hover:shadow-2xl transition-all duration-400 overflow-hidden"
          >
            {/* Top Media Section */}
            <div className="relative w-full h-52 overflow-hidden bg-slate-950 rounded-t-2xl">
              {/* Product Image */}
              <img
                src={getDisplayImage(food.picture)}
                alt={food.name}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-600 ease-out"
                loading="lazy"
              />

              {/* Gradient Overlays for Readability & Polish */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90 group-hover:opacity-75 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Floating Badges */}
              <div className="absolute top-3.5 left-3.5 z-10 flex flex-wrap gap-1">
                {food.category?.name && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-black/50 text-emerald-300 border border-emerald-500/20 backdrop-blur-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {food.category.name}
                  </span>
                )}
                {food.tag && food.tag !== "standard" && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-md">
                    ★ {food.tag.replace("_", " ")}
                  </span>
                )}
              </div>

              {/* Availability Status Badge */}
              <div className="absolute top-3.5 right-3.5 z-10">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${
                    food.availability === "sold_out"
                      ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                      : food.availability === "temporarily_unavailable"
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                      : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                  }`}
                >
                  {food.availability === "sold_out"
                    ? "Sold Out"
                    : food.availability === "temporarily_unavailable"
                    ? "Unavailable"
                    : "In Stock"}
                </span>
              </div>
            </div>

            {/* Main Content Body */}
            <div className="relative p-5 flex-1 flex flex-col justify-between -mt-6 z-10">
              <div className="space-y-2">
                {/* Title */}
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-bold text-white tracking-tight truncate capitalize group-hover:text-emerald-300 transition-colors duration-300">
                    {food.name}
                  </h3>
                </div>

                {/* Description */}
                {food.description && (
                  <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed font-normal">
                    {food.description}
                  </p>
                )}

                {/* Price Display */}
                <div className="pt-2 flex items-baseline gap-2">
                  {food.discountPrice && food.discountPrice > 0 ? (
                    <>
                      <span className="text-2xl font-black tracking-tight text-emerald-400 drop-shadow-[0_6px_20px_rgba(16,185,129,0.12)]">
                        LKR {parseFloat(food.discountPrice).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      <span className="text-xs line-through text-slate-500 font-semibold">
                        LKR {parseFloat(food.price).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-black tracking-tight text-emerald-400 drop-shadow-[0_6px_20px_rgba(16,185,129,0.12)]">
                      LKR {parseFloat(food.price).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  )}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="mt-4 pt-3 border-t border-white/[0.06] space-y-2.5">
                {/* 1-Click Availability Switch */}
                <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/5">
                  <span className="text-[9px] font-bold uppercase text-slate-400 px-1.5">Stock:</span>
                  <button
                    onClick={() => handleQuickAvailability(food._id, "available")}
                    className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition ${
                      (!food.availability || food.availability === "available")
                        ? "bg-emerald-500 text-neutral-950 shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Available
                  </button>
                  <button
                    onClick={() => handleQuickAvailability(food._id, "sold_out")}
                    className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition ${
                      food.availability === "sold_out"
                        ? "bg-rose-500 text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Sold Out
                  </button>
                  <button
                    onClick={() => handleQuickAvailability(food._id, "temporarily_unavailable")}
                    className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition ${
                      food.availability === "temporarily_unavailable"
                        ? "bg-amber-500 text-neutral-950 shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Temp
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500">#{food._id ? food._id.slice(-6).toUpperCase() : "N/A"}</span>

                  <div className="flex items-center gap-1.5">
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setEditingFood(food)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 text-emerald-300 border border-emerald-500/20 text-xs font-semibold hover:bg-emerald-500/20 transition"
                      title="Edit Item"
                    >
                      <FaEdit className="text-xs" />
                      <span>Edit</span>
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleDeleteFood(food._id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/50 text-rose-300 border border-rose-500/20 text-xs font-semibold hover:bg-rose-500/20 transition"
                      title="Delete Item"
                    >
                      <FaTrashAlt className="text-xs" />
                      <span>Delete</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )}
</section>

        {/* ================= SHOP STATS OVERVIEW ================= */}
        <section className="p-6 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-2xl relative overflow-hidden">
          <ShopStats shopId={shop._id} isShopOwner={true} />
        </section>

        

    

        {/* ================= PAGINATION SYSTEM ================= */}
        {totalPages > 1 && (
          <nav className="flex justify-center items-center gap-2 pt-6">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-2.5 rounded-xl bg-slate-900 border border-white/[0.08] text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed hover:text-white transition"
            >
              <FaChevronLeft className="text-xs" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-9 h-9 rounded-xl text-xs font-semibold transition-all border ${
                  currentPage === i + 1
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-lg shadow-emerald-500/10"
                    : "bg-slate-900 border-white/[0.08] text-slate-400 hover:text-white hover:border-white/[0.15]"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2.5 rounded-xl bg-slate-900 border border-white/[0.08] text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed hover:text-white transition"
            >
              <FaChevronRight className="text-xs" />
            </button>
          </nav>
        )}
      </main>

      {/* ================= OVERLAY MODALS ================= */}
      {editingFood && (
        <EditFood
          food={editingFood}
          onClose={() => setEditingFood(null)}
          onUpdate={handleUpdateFood}
          onDelete={handleDeleteFood}
        />
      )}

      {showAddFood && (
        <AddFoodItem
          onClose={() => setShowAddFood(false)}
          onAdd={handleAddFood}
        />
      )}

      {showAddCategory && (
        <AddCategory
          onClose={() => setShowAddCategory(false)}
          onAddCategory={handleAddCategory}
        />
      )}

      <AnimatePresence>
        {showShopEdit && shop && (
          <ShopEditModal shop={shop} onClose={() => setShowShopEdit(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyShop;
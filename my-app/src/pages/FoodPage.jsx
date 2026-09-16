// ✅ Full responsive & paginated FoodList component with comment section

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaTag } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ComentSec from "../components/CommentSec";
import SearchBar from "../components/SearchBar";

// Category Pills
function CategoryPill({ category, selected, onClick }) {
  return (
    <button
      className={`flex items-center gap-1 px-4 py-1 rounded-full text-sm font-medium shadow border border-transparent transition-all ${
        selected
          ? "bg-blue-500 text-white scale-105 shadow-lg"
          : "bg-blue-50 text-blue-700 hover:bg-blue-100"
      }`}
      onClick={onClick}
      aria-pressed={selected}
    >
      <FaTag className="text-xs" />
      {category.name}
    </button>
  );
}

// Food Card
function FoodCard({ food, idx }) {
  const imageUrl = food.picture?.startsWith("http")
    ? food.picture
    : `http://localhost:5000${food.picture}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: "easeOut", delay: idx * 0.07 }}
      viewport={{ once: true }}
      className="flex flex-col sm:flex-row bg-white rounded-2xl shadow hover:shadow-lg overflow-hidden"
    >
      <img
        src={imageUrl || "https://via.placeholder.com/160x192?text=No+Image"}
        alt={food.name}
        className="w-full sm:w-40 h-36 sm:h-48 object-cover sm:rounded-l-2xl"
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/160x192?text=Error";
        }}
      />
      <div className="flex flex-col justify-between p-4 flex-1">
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-1">
            <span className="text-lg font-bold text-gray-800">{food.name}</span>
            <span className="ml-0 sm:ml-auto text-emerald-600 font-semibold">
              LKR {Number(food.price || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <span className="text-xs text-gray-400">
            {food.category?.name || "Uncategorized"}
          </span>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Added: {food.createdAt ? new Date(food.createdAt).toLocaleDateString() : "N/A"}
        </div>
      </div>
    </motion.div>
  );
}

// Pagination Controls
function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="flex justify-center mt-10 gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-700 disabled:opacity-50"
      >
        Prev
      </button>
      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i}
          onClick={() => onPageChange(i + 1)}
          className={`px-3 py-1 rounded ${
            currentPage === i + 1
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {i + 1}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-700 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}

export default function FoodList({ shopId }) {
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const navigate = useNavigate();

  useEffect(() => {
    if (!shopId) return;
    setLoading(true);
    setError(null);

    async function fetchData() {
      try {
        const foodRes = await fetch(`http://localhost:5000/api/food/shop/${shopId}`);
        const foodData = await foodRes.json();

        setFoods(Array.isArray(foodData) ? foodData : []);

        const uniqueCategories = [];
        const seen = new Set();
        (foodData || []).forEach((f) => {
          if (f.category && !seen.has(f.category._id)) {
            uniqueCategories.push(f.category);
            seen.add(f.category._id);
          }
        });
        setCategories(uniqueCategories);
      } catch (err) {
        setError("Failed to load food items. Try again later.");
        setFoods([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [shopId]);

  useEffect(() => {
    let result = foods;
    if (selectedCategory !== "all") {
      result = result.filter((f) => f.category?._id === selectedCategory);
    }
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      result = result.filter(
        (f) => f.name.toLowerCase().includes(s) || f.category?.name.toLowerCase().includes(s)
      );
    }
    setFilteredFoods(result);
    setCurrentPage(1); // Reset on filter
  }, [foods, search, selectedCategory]);

  const totalPages = Math.ceil(filteredFoods.length / itemsPerPage);
  const paginatedFoods = filteredFoods.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-green-50"
      initial="hidden"
      animate="visible"
    >

      <button
  onClick={() => navigate("/user/dashboard")}
  className="mb-4 flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
  Back to Dashboard
</button>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <motion.h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Our Food Menu
        </motion.h1>

        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search foods or categories"
        />

        <div className="flex flex-wrap gap-5 justify-center mb-6 mt-5">
          <CategoryPill
            category={{ name: "All", _id: "all" }}
            selected={selectedCategory === "all"}
            onClick={() => setSelectedCategory("all")}
          />
          {categories.map((cat) => (
            <CategoryPill
              key={cat._id}
              category={cat}
              selected={selectedCategory === cat._id}
              onClick={() => setSelectedCategory(cat._id)}
            />
          ))}
        </div>

        <hr className="my-4 border-0 h-1 bg-gradient-to-r from-blue-400 via-green-400 to-pink-400 rounded-full shadow" />

        {loading ? (
          <div className="text-center py-16 text-blue-500">Loading...</div>
        ) : error ? (
          <div className="text-center py-16 text-red-500">{error}</div>
        ) : paginatedFoods.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No matching foods found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedFoods.map((food, idx) => (
                <FoodCard key={food._id} food={food} idx={idx} />
              ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}

        {/* Comments */}
        <div className="mt-16">
          <ComentSec shopId={shopId} />
        </div>
      </div>

      
    </motion.div>
  );
}

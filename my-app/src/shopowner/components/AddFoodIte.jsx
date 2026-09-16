import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  DollarSign,
  Image as ImageIcon,
  Loader2,
  Plus,
  ShieldCheck,
  Sparkles,
  Tag,
  UploadCloud,
  UtensilsCrossed,
  X
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.2, ease: "easeInOut" },
  },
};

const AddFoodItem = ({ onClose, onAdd }) => {
  const fileInputRef = useRef(null);

  const [food, setFood] = useState({
    name: "",
    category: "",
    price: "",
    picture: null,
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoadingCategories(true);
    fetch("/api/categories/my-shop", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setCategories(Array.isArray(data) ? data : []);
        setLoadingCategories(false);
      })
      .catch(() => {
        setCategoriesError("Failed to fetch shop categories.");
        setLoadingCategories(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "picture" && files && files[0]) {
      const selectedFile = files[0];
      setFood({ ...food, picture: selectedFile });
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setFood({ ...food, [name]: value });
    }
  };

  const removeSelectedImage = () => {
    setFood({ ...food, picture: null });
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", food.name);
      formData.append("categoryId", food.category);
      formData.append("price", food.price);
      if (food.picture) {
        formData.append("picture", food.picture);
      }

      const response = await fetch("/api/food", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      let data = null;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      }

      if (!response.ok) {
        throw new Error((data && data.error) || "Failed to add food item.");
      }

      setSuccessMessage("Food item added to catalog successfully!");
      if (onAdd && data) {
        onAdd(data);
      }

      setFood({
        name: "",
        category: "",
        price: "",
        picture: null,
      });
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setTimeout(() => {
        setSuccessMessage("");
        onClose();
      }, 1200);
    } catch (err) {
      setErrorMessage(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07090E]/80 backdrop-blur-md overflow-y-auto"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <motion.div
          className="w-full max-w-lg rounded-3xl bg-[#0B0F17] border border-white/[0.1] shadow-2xl overflow-hidden relative my-8"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Top Accent Line */}
          <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500" />

          {/* Background Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="p-6 pb-4 flex items-center justify-between border-b border-white/[0.06] relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/5">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Add New Item
                </h3>
                <p className="text-xs text-slate-400 font-normal mt-0.5 flex items-center gap-1">
                  <span>Catalog Management</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-emerald-400 font-medium">Menu Offering</span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              disabled={submitting || !!successMessage}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition border border-transparent hover:border-white/[0.08] disabled:opacity-30"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 relative z-10">
            {/* Status Feedback */}
            <AnimatePresence>
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium flex items-center gap-2.5 shadow-lg shadow-emerald-500/5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{successMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium flex items-center gap-2.5 shadow-lg shadow-rose-500/5"
                >
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Item Name */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <UtensilsCrossed className="w-3 h-3 text-emerald-400" /> Item Name
              </label>
              <input
                type="text"
                name="name"
                value={food.name}
                onChange={handleChange}
                placeholder="e.g. Seafood Kottu Special, Ceylon Tea Frappe..."
                required
                disabled={submitting || !!successMessage}
                className="w-full px-4 py-3 rounded-2xl bg-slate-900/90 border border-white/[0.08] text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/50 transition-all shadow-inner disabled:opacity-50"
              />
            </div>

            {/* Grid layout for Category and Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category Dropdown */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-3 h-3 text-emerald-400" /> Category
                </label>
                {loadingCategories ? (
                  <div className="h-[42px] px-4 rounded-2xl bg-slate-900/60 border border-white/[0.08] flex items-center gap-2 text-xs text-slate-500">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                    <span>Loading...</span>
                  </div>
                ) : categoriesError ? (
                  <div className="h-[42px] px-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center text-xs text-rose-400 font-medium">
                    {categoriesError}
                  </div>
                ) : (
                  <select
                    name="category"
                    value={food.category}
                    onChange={handleChange}
                    required
                    disabled={submitting || !!successMessage}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-900/90 border border-white/[0.08] text-xs text-slate-100 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/50 transition-all disabled:opacity-50 appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="bg-[#0B0F17] text-slate-500">
                      Select Category
                    </option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id} className="bg-[#0B0F17] text-slate-200">
                        {cat.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Price */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign className="w-3 h-3 text-emerald-400" /> Price (LKR)
                </label>
                <input
                  type="number"
                  name="price"
                  value={food.price}
                  onChange={handleChange}
                  placeholder="e.g. 1250"
                  min="0"
                  required
                  disabled={submitting || !!successMessage}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-900/90 border border-white/[0.08] text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/50 transition-all shadow-inner disabled:opacity-50"
                />
              </div>
            </div>

            {/* Picture Upload Field with Live Preview */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ImageIcon className="w-3 h-3 text-emerald-400" /> Product Image
                </span>
                <span className="text-[10px] text-slate-500 font-normal">Optional</span>
              </label>

              <input
                ref={fileInputRef}
                type="file"
                name="picture"
                accept="image/*"
                onChange={handleChange}
                disabled={submitting || !!successMessage}
                className="hidden"
                id="picture-upload"
              />

              {previewUrl ? (
                <div className="relative rounded-2xl border border-white/[0.1] bg-slate-900/60 overflow-hidden group">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-36 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={removeSelectedImage}
                      className="px-3 py-1.5 rounded-xl bg-rose-500/80 hover:bg-rose-500 text-white text-xs font-medium transition shadow-lg"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="picture-upload"
                  className="flex flex-col items-center justify-center p-5 rounded-2xl border border-dashed border-white/[0.12] bg-white/[0.01] hover:bg-white/[0.03] transition cursor-pointer group"
                >
                  <UploadCloud className="w-6 h-6 text-slate-400 group-hover:text-emerald-400 transition-colors mb-1.5" />
                  <span className="text-xs font-semibold text-slate-300">
                    Click to upload media
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5">
                    PNG, JPG or WEBP (Max 5MB)
                  </span>
                </label>
              )}
            </div>

            {/* Actions */}
            <div className="pt-3 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting || !!successMessage}
                className="px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] text-slate-300 hover:text-white text-xs font-semibold transition disabled:opacity-40"
              >
                Cancel
              </button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={submitting || !food.name || !food.category || !food.price || !!successMessage}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-xs flex items-center gap-2 transition shadow-lg shadow-emerald-500/20 border border-emerald-400/20 disabled:opacity-40 disabled:pointer-events-none"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>

          {/* Footer Metadata */}
          <div className="px-6 py-3 bg-white/[0.01] border-t border-white/[0.04] flex items-center justify-between text-[10px] text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> Secure Storage
            </span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-teal-400" /> Instant POS Sync
            </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddFoodItem;
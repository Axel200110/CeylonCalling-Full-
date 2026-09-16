import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  DollarSign,
  Image as ImageIcon,
  Loader2,
  Save,
  ShieldCheck,
  Sparkles,
  Tag,
  Trash2,
  UploadCloud,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

// Shared Motion Animation Variants
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

const EditFoodModal = ({ food, onClose, onUpdate, onDelete }) => {
  const fileInputRef = useRef(null);

  // Form State initialized from food prop
  const [name, setName] = useState(food?.name || "");
  const [price, setPrice] = useState(food?.price || "");
  const [categoryId, setCategoryId] = useState(
    food?.categoryId?.toString() || food?.category?._id?.toString() || ""
  );

  // Categories Fetching State
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");

  // Media Management State
  const [previewUrl, setPreviewUrl] = useState(food?.picture || null);
  const [newImage, setNewImage] = useState(null);
  const [imageRemoved, setImageRemoved] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Status & Async Operations State
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Keyboard Navigation (ESC key handler)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !submitting && !deleting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, submitting, deleting]);

  // Load Categories
  useEffect(() => {
    let isMounted = true;
    setLoadingCategories(true);

    fetch("/api/categories/my-shop", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load shop categories.");
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        const catArray = Array.isArray(data) ? data : [];
        setCategories(catArray);

        // Fallback default category selection if unassigned
        if (!categoryId && catArray.length > 0) {
          setCategoryId(catArray[0]._id.toString());
        }
      })
      .catch((err) => {
        if (isMounted) {
          setCategoriesError(err.message || "Failed to fetch shop categories.");
        }
      })
      .finally(() => {
        if (isMounted) setLoadingCategories(false);
      });

    return () => {
      isMounted = false;
    };
  }, [categoryId]);

  // Handle File Selection Validation
  const handleFileProcess = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please choose a valid image format (PNG, JPG, WebP).");
      return;
    }
    setErrorMessage("");
    setNewImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setImageRemoved(false);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  // Drag & Drop Handling
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const removeSelectedImage = useCallback(() => {
    setImageRemoved(true);
    setNewImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  // Update Food Item Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!name.trim()) {
      setErrorMessage("Food item name cannot be empty.");
      return;
    }
    if (!price || Number(price) < 0) {
      setErrorMessage("Please enter a valid price.");
      return;
    }
    if (!categoryId) {
      setErrorMessage("Please select a food category.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("price", price);
      formData.append("categoryId", categoryId);

      if (newImage) {
        formData.append("picture", newImage);
      } else if (imageRemoved) {
        formData.append("picture", "");
      }

      const response = await fetch(`/api/food/${food._id}`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      let data = null;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      }

      if (!response.ok) {
        throw new Error((data && data.error) || "Failed to update food item.");
      }

      setSuccessMessage("Food item updated successfully!");
      if (onUpdate && data) {
        onUpdate(data);
      }

      setTimeout(() => {
        setSuccessMessage("");
        onClose();
      }, 1000);
    } catch (err) {
      setErrorMessage(err.message || "An error occurred during update.");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Item Operation
  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${food?.name}"?`)) {
      return;
    }

    setErrorMessage("");
    setDeleting(true);
    try {
      if (onDelete) {
        await onDelete(food._id);
      }
      onClose();
    } catch (err) {
      setErrorMessage(err.message || "Failed to delete food item.");
    } finally {
      setDeleting(false);
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
          {/* Top Accent Gradient Line */}
          <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500" />

          {/* Background Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="p-6 pb-4 flex items-center justify-between border-b border-white/[0.06] relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/5">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Edit Food Item
                </h3>
                <p className="text-xs text-slate-400 font-normal mt-0.5 flex items-center gap-1">
                  <span>Catalog Management</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-emerald-400 font-medium">Update Menu Item</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={submitting || deleting || !!successMessage}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition border border-transparent hover:border-white/[0.08] disabled:opacity-30"
              aria-label="Close edit modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 relative z-10">
            {/* Success Feedback Alert */}
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

            {/* Error Feedback Alert */}
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Seafood Kottu Special, Ceylon Tea Frappe..."
                required
                disabled={submitting || deleting || !!successMessage}
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
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                    disabled={submitting || deleting || !!successMessage}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-900/90 border border-white/[0.08] text-xs text-slate-100 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/50 transition-all disabled:opacity-50 appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url('data:image/svg+xml;utf8,<svg fill="%2394a3b8" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>')`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 0.75rem center",
                    }}
                  >
                    <option value="" disabled className="bg-[#0B0F17] text-slate-500">
                      Select Category
                    </option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id.toString()} className="bg-[#0B0F17] text-slate-200">
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
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 1250"
                  min="0"
                  step="0.01"
                  required
                  disabled={submitting || deleting || !!successMessage}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-900/90 border border-white/[0.08] text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/50 transition-all shadow-inner disabled:opacity-50"
                />
              </div>
            </div>

            {/* Media Upload & Interactive Drag-and-Drop Dropzone */}
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
                onChange={handleImageChange}
                disabled={submitting || deleting || !!successMessage}
                className="hidden"
                id="picture-upload-edit"
              />

              {previewUrl ? (
                <div className="relative rounded-2xl border border-white/[0.1] bg-slate-900/60 overflow-hidden group">
                  <img
                    src={previewUrl}
                    alt="Food item preview"
                    className="w-full h-36 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-xs">
                    <label
                      htmlFor="picture-upload-edit"
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-medium cursor-pointer transition shadow-lg flex items-center gap-1.5"
                    >
                      <UploadCloud className="w-3.5 h-3.5" /> Change
                    </label>
                    <button
                      type="button"
                      onClick={removeSelectedImage}
                      className="px-3 py-1.5 rounded-xl bg-rose-500/80 hover:bg-rose-500 text-white text-xs font-medium transition shadow-lg flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex flex-col items-center justify-center p-5 rounded-2xl border border-dashed transition-all cursor-pointer group ${
                    isDragging
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-white/[0.12] bg-white/[0.01] hover:bg-white/[0.03]"
                  }`}
                >
                  <UploadCloud className="w-6 h-6 text-slate-400 group-hover:text-emerald-400 transition-colors mb-1.5" />
                  <span className="text-xs font-semibold text-slate-300">
                    Click to upload or drag & drop media
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5">
                    PNG, JPG or WEBP (Max 5MB)
                  </span>
                </div>
              )}
            </div>

            {/* Action Bar (Delete on Left, Cancel & Save on Right) */}
            <div className="pt-3 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleDelete}
                disabled={submitting || deleting || !!successMessage}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 hover:text-rose-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition disabled:opacity-40"
              >
                {deleting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-300" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                <span>Delete Item</span>
              </button>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting || deleting || !!successMessage}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] text-slate-300 hover:text-white text-xs font-semibold transition disabled:opacity-40"
                >
                  Cancel
                </button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={submitting || deleting || !name || !categoryId || !price || !!successMessage}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-500/20 border border-emerald-400/20 disabled:opacity-40 disabled:pointer-events-none"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </motion.button>
              </div>
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

export default EditFoodModal;
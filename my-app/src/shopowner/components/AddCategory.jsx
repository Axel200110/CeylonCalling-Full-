import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  FolderPlus,
  Loader2,
  Plus,
  ShieldCheck,
  Sparkles,
  Tag,
  X
} from "lucide-react";
import { useState } from "react";

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

const AddCategory = ({ onClose, onAddCategory }) => {
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!categoryName.trim()) return;

    setLoading(true);

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: categoryName.trim() }),
      });

      let data = null;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      }

      if (!response.ok) {
        throw new Error((data && data.error) || "Failed to create category.");
      }

      setSuccessMessage("Category registered successfully!");
      setCategoryName("");

      if (onAddCategory) {
        onAddCategory(data);
      }

      setTimeout(() => {
        setSuccessMessage("");
        onClose();
      }, 1100);
    } catch (err) {
      setErrorMessage(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07090E]/80 backdrop-blur-md"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <motion.div
          className="w-full max-w-md rounded-3xl bg-[#0B0F17] border border-white/[0.1] shadow-2xl overflow-hidden relative"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Accent Line */}
          <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500" />

          {/* Background Radial Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="p-6 pb-4 flex items-center justify-between border-b border-white/[0.06] relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/5">
                <FolderPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Add Catalog Category
                </h3>
                <p className="text-xs text-slate-400 font-normal mt-0.5 flex items-center gap-1">
                  <span>Inventory Taxonomy</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-emerald-400 font-medium">Realtime Sync</span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              disabled={loading || !!successMessage}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition border border-transparent hover:border-white/[0.08] disabled:opacity-30"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5 relative z-10">
            {/* Success Alert */}
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

            {/* Error Alert */}
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

            {/* Input Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3 h-3 text-emerald-400" /> Category Identifier
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g. Cultural Excursions, Water Sports..."
                  disabled={loading || !!successMessage}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-900/90 border border-white/[0.08] text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/50 transition-all shadow-inner disabled:opacity-50"
                  required
                  autoFocus
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Categories help organize products and services across your shop catalog.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading || !!successMessage}
                className="px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] text-slate-300 hover:text-white text-xs font-semibold transition disabled:opacity-40"
              >
                Cancel
              </button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || !categoryName.trim() || !!successMessage}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-xs flex items-center gap-2 transition shadow-lg shadow-emerald-500/20 border border-emerald-400/20 disabled:opacity-40 disabled:pointer-events-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Category</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>

          {/* Footer Badge */}
          <div className="px-6 py-3 bg-white/[0.01] border-t border-white/[0.04] flex items-center justify-between text-[10px] text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> Encrypted Endpoint
            </span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-teal-400" /> Enterprise Catalog API
            </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddCategory;
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { FaCamera, FaTimes, FaMapMarkerAlt, FaCompass } from 'react-icons/fa';
import { useAuthStore } from '../store/authStore';

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};

const modalVariants = {
  hidden: { y: "100%", opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", damping: 20, stiffness: 200 },
  },
  exit: {
    y: "100%",
    opacity: 0,
    transition: { duration: 0.3 },
  },
};

export default function ShopEditModal({ shop, onClose }) {
  const setShop = useAuthStore((state) => state.setShop);

  const initialDistrict =
    shop?.location?.district ||
    shop?.addressDetails?.district ||
    (typeof shop?.location === "string" && shop?.location.toLowerCase().includes("polonnaruwa")
      ? "Polonnaruwa"
      : "Anuradhapura");

  const initialCity =
    shop?.location?.city ||
    shop?.addressDetails?.city ||
    (typeof shop?.location === "string"
      ? shop?.location
      : initialDistrict === "Polonnaruwa"
      ? "Polonnaruwa Heritage City"
      : "Anuradhapura Town");

  const initialAddress =
    shop?.location?.address || shop?.addressDetails?.streetAddress || "";

  const rawCoords = shop?.location?.coordinates?.coordinates;
  const initialLng =
    Array.isArray(rawCoords) && rawCoords.length >= 2
      ? rawCoords[0]
      : shop?.addressDetails?.coordinates?.lng || (initialDistrict === "Polonnaruwa" ? 81.0188 : 80.4037);

  const initialLat =
    Array.isArray(rawCoords) && rawCoords.length >= 2
      ? rawCoords[1]
      : shop?.addressDetails?.coordinates?.lat || (initialDistrict === "Polonnaruwa" ? 7.9403 : 8.3114);

  const [form, setForm] = useState({
    name: shop?.name || "",
    activeTime: shop?.activeTime || "",
    description: shop?.description || shop?.businessDescription || "",
    district: initialDistrict,
    city: initialCity,
    address: initialAddress,
    latitude: initialLat,
    longitude: initialLng,
    priceRange: shop?.priceRange || "",
    shopType: shop?.shopType || "restaurant",
    contact: shop?.contact || "",
  });

  const [preview, setPreview] = useState(shop?.photo || null);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "district") {
        if (value === "Polonnaruwa") {
          updated.latitude = 7.9403;
          updated.longitude = 81.0188;
        } else if (value === "Anuradhapura") {
          updated.latitude = 8.3114;
          updated.longitude = 80.4037;
        }
      }
      return updated;
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          formData.append(key, val);
        }
      });
      if (photo) formData.append("photo", photo);

      const res = await axios.put(`/api/shops/${shop._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (res.data?.shop) {
        setShop(res.data.shop);
      }

      setSuccessMsg("✅ Business profile updated successfully!");
      setTimeout(() => {
        setSuccessMsg("");
        onClose();
      }, 1200);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || err.response?.data?.message || "Update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
        <motion.div
          className="relative w-full max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl z-50 text-slate-100 max-h-[90vh] overflow-y-auto"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
            aria-label="Close"
          >
            <FaTimes className="w-4 h-4" />
          </button>

          <div className="text-center mb-5">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Edit Business Profile &amp; Location
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Update branding, North Central Province location, and navigation coordinates.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Image Upload */}
            <div className="flex justify-center">
              <label className="relative group w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-emerald-500/50 shadow-inner cursor-pointer bg-slate-800">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-500">
                    <FaCamera className="text-xl" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <FaCamera className="text-white text-lg" />
                </div>
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
            </div>

            {/* General Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">
                  Business Name <span className="text-rose-400">*</span>
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">
                  Contact Phone <span className="text-rose-400">*</span>
                </label>
                <input
                  name="contact"
                  value={form.contact}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">
                  Establishment Type
                </label>
                <select
                  name="shopType"
                  value={form.shopType}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="restaurant">Restaurant</option>
                  <option value="hotel">Hotel &amp; Resort</option>
                  <option value="villa">Private Villa</option>
                  <option value="guesthouse">Guest House</option>
                  <option value="small_food_shop">Small Food Shop</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">
                  Active Hours
                </label>
                <input
                  name="activeTime"
                  placeholder="e.g. 8:00 AM - 10:00 PM"
                  value={form.activeTime}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Structured North Central Location */}
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <FaMapMarkerAlt />
                <span>North Central Province Location</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 mb-1 block">
                    District <span className="text-rose-400">*</span>
                  </label>
                  <select
                    name="district"
                    value={form.district}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Anuradhapura">Anuradhapura</option>
                    <option value="Polonnaruwa">Polonnaruwa</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 mb-1 block">
                    City / Town <span className="text-rose-400">*</span>
                  </label>
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="e.g. Anuradhapura Town, Mihintale, Polonnaruwa"
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 mb-1 block">
                  Street Address or Landmark
                </label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="e.g. 42 Main Street, Near Sacred Bo Tree"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 mb-1 block flex items-center gap-1">
                    <FaCompass className="text-emerald-400 text-[10px]" />
                    <span>Latitude</span>
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="latitude"
                    value={form.latitude}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 mb-1 block flex items-center gap-1">
                    <FaCompass className="text-emerald-400 text-[10px]" />
                    <span>Longitude</span>
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="longitude"
                    value={form.longitude}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 block">
                Business Description
              </label>
              <textarea
                name="description"
                rows="2"
                value={form.description}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                placeholder="Share highlights about your venue, specialties, or history..."
              />
            </div>

            {/* Messages */}
            {successMsg && <p className="text-emerald-400 text-center text-xs font-semibold">{successMsg}</p>}
            {errorMsg && <p className="text-rose-400 text-center text-xs font-semibold">{errorMsg}</p>}

            {/* Submit */}
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold text-xs transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold text-xs transition disabled:opacity-50 shadow-lg shadow-emerald-600/20"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
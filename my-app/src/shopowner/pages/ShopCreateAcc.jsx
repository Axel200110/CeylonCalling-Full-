import { useRef, useState } from "react";
import { FiAlertCircle, FiCheckCircle, FiUpload } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const DISTRICTS = [
  { id: "anuradhapura", label: "Anuradhapura" },
  { id: "polonnaruwa", label: "Polonnaruwa" },
];

const ShopCreate = () => {
  const [shopData, setShopData] = useState({
    name: "",
    activeTime: "",
    description: "",
    location: "",
    photo: null,
    priceRange: "",
    shopType: "",
    contact: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();
  const navigate = useNavigate();

  // Apple-style subtle shadow, glassmorphism, and soft animations
  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/60 backdrop-blur-sm transition focus:(border-blue-500 ring-2 ring-blue-100) text-gray-900 placeholder-gray-400 text-base outline-none font-medium";
  const labelClass =
    "block text-xs font-semibold text-gray-700 mb-1 ml-1 tracking-wide";
  const fadeIn =
    "transition-opacity duration-300 ease-out opacity-0 data-[show=true]:opacity-100";

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo" && files && files[0]) {
      setShopData({ ...shopData, photo: files[0] });
      setPhotoPreview(URL.createObjectURL(files[0]));
    } else {
      setShopData({ ...shopData, [name]: value });
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    setLoading(true);

    const formData = new FormData();
    Object.entries(shopData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    try {
      const response = await fetch("http://localhost:5000/api/shops", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create shop.");
      }

      setSuccessMessage("Your shop was created successfully!");
      setShopData({
        name: "",
        activeTime: "",
        description: "",
        location: "",
        photo: null,
        priceRange: "",
        shopType: "",
        contact: "",
      });
      setPhotoPreview(null);

      setTimeout(() => {
        setSuccessMessage("");
        setLoading(false);
        navigate("/dashboard");
      }, 1300);
    } catch (error) {
      setErrorMessage(error.message || "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f3f4f6] via-[#e9eaf0] to-[#f9fafb] px-2 sm:px-0">
      <div className="w-full max-w-xl bg-white/70 backdrop-blur-2xl shadow-2xl rounded-3xl border border-gray-100 p-8 sm:p-12 relative overflow-hidden">
        {/* Top Apple-style Glow */}
        <div className="absolute -top-24 left-[55%] w-72 h-72 bg-gradient-to-br from-blue-500/20 to-purple-400/10 blur-3xl rounded-full pointer-events-none" />

        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-6 text-gray-900 tracking-tight select-none drop-shadow-md">
          Create Your Shop
        </h2>

        {/* Success & Error */}
        {successMessage && (
          <div
            className={`flex items-center justify-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3 font-semibold text-sm mb-5 shadow-sm ${fadeIn}`}
            data-show={!!successMessage}
          >
            <FiCheckCircle className="w-5 h-5" />
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div
            className={`flex items-center justify-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 font-semibold text-sm mb-5 shadow-sm ${fadeIn}`}
            data-show={!!errorMessage}
          >
            <FiAlertCircle className="w-5 h-5" />
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={labelClass}>Shop Name</label>
            <input
              name="name"
              value={shopData.name}
              onChange={handleChange}
              placeholder="Apple Bistro"
              className={inputClass}
              required
              autoComplete="off"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Active Time</label>
              <input
                name="activeTime"
                value={shopData.activeTime}
                onChange={handleChange}
                placeholder="8AM - 10PM"
                className={inputClass}
                autoComplete="off"
              />
            </div>
            <div>
              <label className={labelClass}>Price Range</label>
              <input
                name="priceRange"
                value={shopData.priceRange}
                onChange={handleChange}
                placeholder="Rs.100 - Rs.1500"
                className={inputClass}
                autoComplete="off"
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Contact Number</label>
            <input
              name="contact"
              value={shopData.contact}
              onChange={handleChange}
              placeholder="+94 7XXXXXXXX"
              required
              className={inputClass}
              autoComplete="off"
              type="tel"
              pattern="^(\+94\s?\d{9,10})$"
            />
          </div>
          <div>
            <label className={labelClass}>Shop Type</label>
            <select
              name="shopType"
              value={shopData.shopType}
              onChange={handleChange}
              required
              className={inputClass}
            >
              <option value="">Select shop type</option>
              <option value="restaurant">Restaurant</option>
              <option value="small_food_shop">Small Food Shop</option>
              <option value="hotel">Hotel</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              name="description"
              value={shopData.description}
              onChange={handleChange}
              rows={2}
              placeholder="Describe your shop briefly"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>District / දිස්ත්‍රික්කය</label>
            <select
              name="location"
              value={shopData.location}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="">Select District</option>
              {DISTRICTS.map((district) => (
                <option key={district.id} value={district.label}>
                  {district.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500 mt-1">
              Only Anuradhapura and Polonnaruwa are available.
            </p>
          </div>
          <div>
            <label className={labelClass}>Photo</label>
            <button
              type="button"
              onClick={handlePhotoClick}
              className="flex items-center gap-2 w-full bg-gradient-to-tr from-blue-50 to-purple-50 text-blue-700 font-semibold py-3 px-4 rounded-xl border border-blue-100 shadow-sm hover:bg-blue-100/70 transition"
            >
              <FiUpload className="w-5 h-5" />
              {photoPreview ? "Change Photo" : "Upload Photo"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />
            {photoPreview && (
              <div className="mt-3 flex justify-center">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-xl border border-gray-200 shadow"
                />
              </div>
            )}
          </div>
          <div className="pt-2 flex items-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg shadow-indigo-200/30 hover:from-blue-700 hover:to-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 text-lg flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
              ) : (
                <FiCheckCircle className="w-5 h-5" />
              )}
              {loading ? "Saving..." : "Save Shop"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShopCreate;
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Minus, Utensils } from "lucide-react";
import { resolveImageUrl, formatLKR } from "../../utils/formatters";
import { useCartStore } from "../../store/useCartStore";
import { useSiteUserAuthStore } from "../../store/siteUserAuthStore";
import AuthPromptModal from "./AuthPromptModal";

export default function FoodCard({
  food,
  shop,
  onSelectFood,
  index = 0,
}) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { addItem, updateQuantity, getItemQuantity } = useCartStore();
  const isAuthenticated = useSiteUserAuthStore((state) => state.isAuthenticated);
  const quantityInCart = getItemQuantity(food._id);

  const imageSrc = resolveImageUrl(food.picture, "food");
  const [imgUrl, setImgUrl] = useState(imageSrc);

  const handleAdd = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    addItem(food, shop, 1);
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    updateQuantity(food._id, 1);
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    updateQuantity(food._id, -1);
  };

  const handleCardClick = () => {
    if (onSelectFood) {
      onSelectFood(food);
    }
  };

  const categoryName = food.category?.name || "Specialty Dish";

  return (
    <>
      <motion.div
        onClick={handleCardClick}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20px" }}
        whileHover={{ y: -4, boxShadow: "0 16px 30px -10px rgba(15, 23, 42, 0.08)" }}
        transition={{ duration: 0.3, ease: "easeOut", delay: Math.min(index * 0.03, 0.25) }}
        className="group flex flex-col h-full bg-white rounded-2xl sm:rounded-3xl border border-slate-100/90 overflow-hidden cursor-pointer select-none shadow-xs transition-all duration-300"
      >
        {/* 4:3 Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 shrink-0">
          <img
            src={imgUrl}
            alt={food.name || "Dish"}
            onError={() => setImgUrl(resolveImageUrl("", "food"))}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />

          {/* Category Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950/80 border border-white/10 text-[10px] font-bold text-white shadow-sm backdrop-blur-md">
            <Utensils size={10} className="text-emerald-400" />
            <span>{categoryName}</span>
          </div>
        </div>

        {/* Food Details Body */}
        <div className="flex flex-col justify-between flex-1 p-4 sm:p-5 space-y-3">
          <div className="space-y-1">
            <h4 className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight leading-snug group-hover:text-emerald-600 transition-colors line-clamp-1">
              {food.name}
            </h4>
            <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed font-light line-clamp-2">
              Freshly prepared with authentic Sri Lankan herbs, spices and quality ingredients.
            </p>
          </div>

          {/* Pricing & Add To Cart Button */}
          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Price</span>
              <span className="font-extrabold text-slate-900 text-sm sm:text-base text-emerald-600">
                {formatLKR(food.price)}
              </span>
            </div>

            {/* Cart Quantity Control or Add Button */}
            {quantityInCart > 0 && isAuthenticated ? (
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-1 shadow-xs"
              >
                <button
                  type="button"
                  onClick={handleDecrement}
                  className="h-6 w-6 rounded-full bg-white text-emerald-700 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition shadow-xs"
                >
                  <Minus size={12} />
                </button>
                <span className="text-xs font-black text-emerald-900 min-w-[14px] text-center">
                  {quantityInCart}
                </span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  className="h-6 w-6 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center transition shadow-xs"
                >
                  <Plus size={12} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleAdd}
                className="flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold shadow-sm transition duration-200"
              >
                <Plus size={13} />
                <span>Add</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Authentication Prompt Modal for Guest Add-to-Cart */}
      <AuthPromptModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        pendingItem={food}
        pendingShop={shop}
        customTitle="Sign in to add to cart"
        customSubtitle={`Create an account or sign in to add "${food.name}" to your cart and place orders.`}
      />
    </>
  );
}

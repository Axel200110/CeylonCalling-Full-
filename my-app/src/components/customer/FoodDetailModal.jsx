import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingBag, Utensils, Store, Check } from "lucide-react";
import { resolveImageUrl, formatLKR } from "../../utils/formatters";
import { useCartStore } from "../../store/useCartStore";
import { useSiteUserAuthStore } from "../../store/siteUserAuthStore";
import AuthPromptModal from "./AuthPromptModal";

export default function FoodDetailModal({
  food,
  shop,
  isOpen,
  onClose,
}) {
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { addItem } = useCartStore();
  const isAuthenticated = useSiteUserAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setAddedAnimation(false);
      setShowAuthModal(false);
    }
  }, [isOpen, food]);

  if (!food) return null;

  const imageSrc = resolveImageUrl(food.picture, "food");
  const unitPrice = Number(food.price || 0);
  const subtotal = unitPrice * quantity;
  const categoryName = food.category?.name || "Signature Menu";
  const shopName = shop?.name || food.shop?.name || "Restaurant";

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    addItem(food, shop || food.shop, quantity);
    setAddedAnimation(true);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-slate-950/65 backdrop-blur-xs"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl z-10 text-slate-800"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 h-9 w-9 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-md transition shadow-md"
                aria-label="Close details"
              >
                <X size={16} />
              </button>

              {/* Image Banner */}
              <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
                <img
                  src={imageSrc}
                  alt={food.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold shadow-md">
                    {categoryName}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/90 text-slate-900 text-xs font-bold backdrop-blur-md shadow-md flex items-center gap-1">
                    <Store size={12} className="text-emerald-600" />
                    <span>{shopName}</span>
                  </span>
                </div>
              </div>

              {/* Content Details */}
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-xl font-extrabold text-slate-900 tracking-tight leading-snug">
                      {food.name}
                    </h3>
                    <span className="text-xl font-black text-emerald-600 shrink-0">
                      {formatLKR(food.price)}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-light">
                    A traditional Sri Lankan delicacy prepared using fresh island herbs, spices, and top quality ingredients. Served hot and freshly made to order.
                  </p>
                </div>

                {/* Quantity & Add Action */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 bg-slate-100 rounded-2xl p-1.5 border border-slate-200/80">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="h-8 w-8 rounded-xl bg-white text-slate-700 hover:bg-slate-50 flex items-center justify-center font-bold transition shadow-xs"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-extrabold text-slate-900 min-w-[20px] text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="h-8 w-8 rounded-xl bg-white text-slate-700 hover:bg-slate-50 flex items-center justify-center font-bold transition shadow-xs"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Submit button */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl text-xs font-extrabold text-white shadow-lg transition-all ${
                      addedAnimation
                        ? "bg-emerald-600 scale-[0.98]"
                        : "bg-slate-900 hover:bg-emerald-600 hover:shadow-emerald-900/20"
                    }`}
                  >
                    {addedAnimation ? (
                      <>
                        <Check size={16} />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={15} />
                        <span>Add • {formatLKR(subtotal)}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AuthPromptModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        pendingItem={{ ...food, quantity }}
        pendingShop={shop || food.shop}
        customTitle="Sign in to add to cart"
        customSubtitle={`Create an account or sign in to add "${food.name}" to your cart.`}
      />
    </>
  );
}

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      currentShop: null, // { id, name, location }
      isCartOpen: false,
      pendingAuthItem: null, // { item, shop, returnUrl }
      conflictModal: {
        isOpen: false,
        pendingItem: null,
        pendingShop: null,
      },

      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

      setPendingAuthItem: (data) => set({ pendingAuthItem: data }),
      clearPendingAuthItem: () => set({ pendingAuthItem: null }),

      // Consume pending auth item post-login
      consumePendingAuthItem: () => {
        const { pendingAuthItem, addItem } = get();
        if (!pendingAuthItem || !pendingAuthItem.item) return null;
        const { item, shop, returnUrl } = pendingAuthItem;
        addItem(item, shop, item.quantity || 1);
        set({ pendingAuthItem: null });
        return returnUrl || "/discover";
      },

      closeConflictModal: () =>
        set({
          conflictModal: { isOpen: false, pendingItem: null, pendingShop: null },
        }),

      // Add item to cart with shop conflict check
      addItem: (food, shop, quantity = 1) => {
        const { items, currentShop } = get();
        const shopId = shop?._id || shop?.id || (typeof shop === "string" ? shop : null);
        const shopName = shop?.name || "Restaurant";

        // Check if adding from a different shop
        if (items.length > 0 && currentShop && currentShop.id && shopId && currentShop.id !== shopId) {
          // Trigger conflict modal
          set({
            conflictModal: {
              isOpen: true,
              pendingItem: { food, quantity },
              pendingShop: { id: shopId, name: shopName },
            },
          });
          return { success: false, conflict: true };
        }

        const foodId = food._id || food.id;
        const existingIndex = items.findIndex((it) => it.foodId === foodId);

        let newItems;
        if (existingIndex > -1) {
          newItems = [...items];
          newItems[existingIndex] = {
            ...newItems[existingIndex],
            quantity: newItems[existingIndex].quantity + quantity,
          };
        } else {
          newItems = [
            ...items,
            {
              foodId,
              name: food.name,
              price: Number(food.price || 0),
              picture: food.picture,
              category: food.category?.name || "Dish",
              shopId,
              shopName,
              quantity,
            },
          ];
        }

        set({
          items: newItems,
          currentShop: currentShop || { id: shopId, name: shopName },
          isCartOpen: true,
        });

        return { success: true };
      },

      // Overwrite cart when user confirms switching restaurants
      confirmSwitchShopAndAdd: () => {
        const { conflictModal } = get();
        if (!conflictModal.pendingItem || !conflictModal.pendingShop) return;

        const { food, quantity } = conflictModal.pendingItem;
        const shop = conflictModal.pendingShop;
        const foodId = food._id || food.id;

        const newItems = [
          {
            foodId,
            name: food.name,
            price: Number(food.price || 0),
            picture: food.picture,
            category: food.category?.name || "Dish",
            shopId: shop.id,
            shopName: shop.name,
            quantity: quantity || 1,
          },
        ];

        set({
          items: newItems,
          currentShop: { id: shop.id, name: shop.name },
          conflictModal: { isOpen: false, pendingItem: null, pendingShop: null },
          isCartOpen: true,
        });
      },

      updateQuantity: (foodId, delta) => {
        const { items } = get();
        const updated = items
          .map((item) => {
            if (item.foodId === foodId) {
              const newQty = item.quantity + delta;
              return newQty > 0 ? { ...item, quantity: newQty } : null;
            }
            return item;
          })
          .filter(Boolean);

        set({
          items: updated,
          currentShop: updated.length === 0 ? null : get().currentShop,
        });
      },

      removeItem: (foodId) => {
        const { items } = get();
        const updated = items.filter((item) => item.foodId !== foodId);
        set({
          items: updated,
          currentShop: updated.length === 0 ? null : get().currentShop,
        });
      },

      clearCart: () => {
        set({ items: [], currentShop: null });
      },

      getTotalPrice: () => {
        const { items } = get();
        return items.reduce((total, item) => total + (item.price || 0) * item.quantity, 0);
      },

      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },

      getItemQuantity: (foodId) => {
        const { items } = get();
        const found = items.find((it) => it.foodId === foodId);
        return found ? found.quantity : 0;
      },
    }),
    {
      name: "ceylon_calling_cart",
      partialize: (state) => ({
        items: state.items,
        currentShop: state.currentShop,
        pendingAuthItem: state.pendingAuthItem,
      }),
    }
  )
);

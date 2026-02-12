import { create } from "zustand";
import { storeAPI } from "../services/api";

/**
 * Store management for shop items, purchases, and equipped cosmetics.
 * Handles caching and real-time state updates for user inventory.
 */
const useStoreStore = create((set, get) => ({
  // State
  storeItems: [],
  purchasedItems: [],
  equippedItems: {
    theme: null,
    font: null,
    effect: null,
    victory: null,
  },
  isLoading: false,
  isPurchasing: false,
  error: null,
  lastFetched: null,

  // Cache duration (10 minutes - store items change less frequently)
  CACHE_DURATION: 10 * 60 * 1000,

  /**
   * Fetch all available store items with caching.
   */
  fetchStoreItems: async (force = false) => {
    const state = get();
    const now = Date.now();

    // Use cache if valid
    if (
      !force &&
      state.lastFetched &&
      now - state.lastFetched < state.CACHE_DURATION &&
      state.storeItems.length > 0
    ) {
      return state.storeItems;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await storeAPI.getItems();
      const items = response.data;
      
      set({
        storeItems: items,
        isLoading: false,
        lastFetched: now,
        error: null,
      });

      return items;
    } catch (error) {
      console.error("Failed to fetch store items:", error);
      set({
        isLoading: false,
        error: error.response?.data?.error || "Failed to load store items",
      });
      return [];
    }
  },

  /**
   * Fetch user's purchased items and equipped state.
   */
  fetchPurchasedItems: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await storeAPI.getPurchasedItems();
      const data = response.data;

      set({
        purchasedItems: data.purchased_items || [],
        equippedItems: data.equipped_items || {
          theme: null,
          font: null,
          effect: null,
          victory: null,
        },
        isLoading: false,
        error: null,
      });

      return data;
    } catch (error) {
      console.error("Failed to fetch purchased items:", error);
      set({
        isLoading: false,
        error: error.response?.data?.error || "Failed to load your items",
      });
      return null;
    }
  },

  /**
   * Purchase a store item.
   */
  purchaseItem: async (itemId) => {
    set({ isPurchasing: true, error: null });

    try {
      const response = await storeAPI.purchaseItem(itemId);
      const data = response.data;

      // Add to purchased items
      set((state) => ({
        purchasedItems: [...state.purchasedItems, data.item],
        isPurchasing: false,
        error: null,
      }));

      return { success: true, data };
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Purchase failed";
      set({
        isPurchasing: false,
        error: errorMsg,
      });
      return { success: false, error: errorMsg };
    }
  },

  /**
   * Equip a purchased item.
   */
  equipItem: async (itemId, category) => {
    try {
      const response = await storeAPI.equipItem(itemId);
      const data = response.data;

      // Update equipped items locally
      set((state) => ({
        equippedItems: {
          ...state.equippedItems,
          [category.toLowerCase()]: data.item,
        },
        error: null,
      }));

      return { success: true, data };
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Failed to equip item";
      set({ error: errorMsg });
      return { success: false, error: errorMsg };
    }
  },

  /**
   * Unequip an item from a category.
   */
  unequipItem: async (category) => {
    try {
      const response = await storeAPI.unequipItem(category);

      // Remove from equipped items
      set((state) => ({
        equippedItems: {
          ...state.equippedItems,
          [category.toLowerCase()]: null,
        },
        error: null,
      }));

      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Failed to unequip item";
      set({ error: errorMsg });
      return { success: false, error: errorMsg };
    }
  },

  /**
   * Check if user owns a specific item.
   */
  ownsItem: (itemId) => {
    const state = get();
    return state.purchasedItems.some((item) => item.id === itemId);
  },

  /**
   * Get equipped item for a category.
   */
  getEquippedItem: (category) => {
    const state = get();
    return state.equippedItems[category.toLowerCase()] || null;
  },

  /**
   * Clear all cached data.
   */
  clearCache: () => {
    set({
      storeItems: [],
      purchasedItems: [],
      equippedItems: {
        theme: null,
        font: null,
        effect: null,
        victory: null,
      },
      lastFetched: null,
      error: null,
    });
  },

  /**
   * Clear error state.
   */
  clearError: () => set({ error: null }),
}));

export default useStoreStore;

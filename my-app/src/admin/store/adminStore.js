import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/admin"
    : "/api/admin";

axios.defaults.withCredentials = true;

export const useAdminStore = create((set, get) => ({
  users: [],
  shops: [],
  listings: [],
  logs: [],
  settings: {
    maintenanceMode: false,
    userRegistration: true,
    emailNotifications: true,
    systemVersion: "2.1.0",
  },
  isLoading: false,
  error: null,
  isAuthenticated: false,
  isAdminCheckingAuth: true,
  adminUser: null,

  // Admin Auth Actions
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      set({
        isAuthenticated: true,
        adminUser: response.data.user,
        isLoading: false,
        error: null
      });
      // Load initial lists after login
      await get().fetchDashboardData();
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Invalid administrator credentials",
        isLoading: false
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await axios.post(`${API_URL}/logout`);
      set({
        users: [],
        shops: [],
        listings: [],
        logs: [],
        isAuthenticated: false,
        adminUser: null,
        isLoading: false
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isAdminCheckingAuth: true });
    try {
      const response = await axios.get(`${API_URL}/check-auth`);
      set({
        isAuthenticated: true,
        adminUser: response.data.user,
        isAdminCheckingAuth: false
      });
      // Load initial lists if authenticated
      await get().fetchDashboardData();
    } catch (error) {
      set({
        isAuthenticated: false,
        adminUser: null,
        isAdminCheckingAuth: false
      });
    }
  },

  fetchDashboardData: async () => {
    try {
      set({ isLoading: true });
      const [shopsRes, usersRes, listingsRes, logsRes, settingsRes] = await Promise.all([
        axios.get(`${API_URL}/shops`),
        axios.get(`${API_URL}/users`),
        axios.get(`${API_URL}/listings`),
        axios.get(`${API_URL}/logs`),
        axios.get(`${API_URL}/settings`)
      ]);

      set({
        shops: shopsRes.data.shops,
        users: usersRes.data.users,
        listings: listingsRes.data.listings,
        logs: logsRes.data.logs,
        settings: settingsRes.data.settings,
        isLoading: false
      });
    } catch (error) {
      set({ isLoading: false });
      console.error("Error fetching dashboard data:", error);
    }
  },

  // User Actions
  updateUserStatus: async (userId, status) => {
    try {
      const response = await axios.put(`${API_URL}/users/${userId}/status`, { status });
      if (response.data.success) {
        set((state) => {
          const updatedUsers = state.users.map((u) => u.id === userId ? { ...u, status } : u);
          return { users: updatedUsers };
        });
        await get().fetchLogs(); // Reload logs
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await axios.delete(`${API_URL}/users/${userId}`);
      if (response.data.success) {
        set((state) => {
          const updatedUsers = state.users.filter((u) => u.id !== userId);
          return { users: updatedUsers };
        });
        await get().fetchLogs();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  },

  // Shop Actions
  createShop: async (shopData) => {
    try {
      set({ isLoading: true });
      const isFormData = shopData instanceof FormData;
      const config = isFormData ? { headers: { "Content-Type": "multipart/form-data" } } : {};
      const response = await axios.post(`${API_URL}/shops`, shopData, config);
      if (response.data.success) {
        await get().fetchDashboardData();
        set({ isLoading: false });
        return response.data;
      }
    } catch (error) {
      set({ isLoading: false });
      console.error("Error creating shop:", error);
      throw error;
    }
  },

  updateShop: async (shopId, shopData) => {
    try {
      set({ isLoading: true });
      const isFormData = shopData instanceof FormData;
      const config = isFormData ? { headers: { "Content-Type": "multipart/form-data" } } : {};
      const response = await axios.put(`${API_URL}/shops/${shopId}`, shopData, config);
      if (response.data.success) {
        await get().fetchDashboardData();
        set({ isLoading: false });
        return response.data;
      }
    } catch (error) {
      set({ isLoading: false });
      console.error("Error updating shop:", error);
      throw error;
    }
  },

  updateShopStatus: async (shopId, status) => {
    try {
      const response = await axios.put(`${API_URL}/shops/${shopId}/status`, { status });
      if (response.data.success) {
        set((state) => {
          const updatedShops = state.shops.map((s) => s.id === shopId ? { ...s, status } : s);
          return { shops: updatedShops };
        });
        await get().fetchLogs();
      }
    } catch (error) {
      console.error("Error updating shop status:", error);
    }
  },

  deleteShop: async (shopId) => {
    try {
      const response = await axios.delete(`${API_URL}/shops/${shopId}`);
      if (response.data.success) {
        set((state) => {
          const updatedShops = state.shops.filter((s) => s.id !== shopId);
          return { shops: updatedShops };
        });
        await get().fetchLogs();
      }
    } catch (error) {
      console.error("Error deleting shop:", error);
    }
  },

  // Listing Actions
  updateListingStatus: async (listingId, status) => {
    try {
      const response = await axios.put(`${API_URL}/listings/${listingId}/status`, { status });
      if (response.data.success) {
        set((state) => {
          const updatedListings = state.listings.map((l) => l.id === listingId ? { ...l, status } : l);
          return { listings: updatedListings };
        });
        await get().fetchLogs();
      }
    } catch (error) {
      console.error("Error updating listing status:", error);
    }
  },

  deleteListing: async (listingId) => {
    try {
      const response = await axios.delete(`${API_URL}/listings/${listingId}`);
      if (response.data.success) {
        set((state) => {
          const updatedListings = state.listings.filter((l) => l.id !== listingId);
          return { listings: updatedListings };
        });
        await get().fetchLogs();
      }
    } catch (error) {
      console.error("Error deleting listing:", error);
    }
  },

  // Settings Actions
  updateSettings: async (newSettings) => {
    try {
      const response = await axios.put(`${API_URL}/settings`, newSettings);
      if (response.data.success) {
        set({ settings: response.data.settings });
        await get().fetchLogs();
      }
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  },

  fetchLogs: async () => {
    try {
      const response = await axios.get(`${API_URL}/logs`);
      set({ logs: response.data.logs });
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  },

  addLog: async (text, type = "system") => {
    try {
      await get().fetchLogs();
    } catch (error) {
      console.error("Error adding log:", error);
    }
  }
}));

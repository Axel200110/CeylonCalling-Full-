import axios from "axios";
import { create } from "zustand";

const API_URL =
  import.meta.env.MODE === "development"
    ? "/api/admin"
    : "/api/admin";

axios.defaults.withCredentials = true;

export const useAdminStore = create((set, get) => ({
  users: [],
  shops: [],
  listings: [],
  reviews: [],
  auditLogs: [],
  logs: [],
  backups: [],
  stats: null,
  health: null,
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
        error: null,
      });
      await get().fetchDashboardData();
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Invalid administrator credentials",
        isLoading: false,
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
        reviews: [],
        auditLogs: [],
        logs: [],
        stats: null,
        isAuthenticated: false,
        adminUser: null,
        isLoading: false,
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
        isAdminCheckingAuth: false,
      });
    } catch (error) {
      set({
        isAuthenticated: false,
        adminUser: null,
        isAdminCheckingAuth: false,
      });
    }
  },

  updatePassword: async (currentPassword, newPassword) => {
    const res = await axios.put(`${API_URL}/password`, { currentPassword, newPassword });
    return res.data;
  },

  fetchDashboardData: async () => {
    try {
      set({ isLoading: true });
      const [shopsRes, usersRes, listingsRes, logsRes, settingsRes, statsRes] = await Promise.all([
        axios.get(`${API_URL}/shops`),
        axios.get(`${API_URL}/users`),
        axios.get(`${API_URL}/listings`),
        axios.get(`${API_URL}/logs`),
        axios.get(`${API_URL}/settings`),
        axios.get(`${API_URL}/dashboard/stats`).catch(() => ({ data: { stats: null } })),
      ]);

      set({
        shops: shopsRes.data.shops,
        users: usersRes.data.users,
        listings: listingsRes.data.listings,
        logs: logsRes.data.logs,
        settings: settingsRes.data.settings,
        stats: statsRes.data.stats,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      console.error("Error fetching dashboard data:", error);
    }
  },

  // Shop Actions
  fetchShops: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await axios.get(`${API_URL}/shops?${params}`);
      set({ shops: res.data.shops });
      return res.data.shops;
    } catch (error) {
      console.error("Error fetching shops:", error);
      throw error;
    }
  },

  getShopDetails: async (shopId) => {
    try {
      const res = await axios.get(`${API_URL}/shops/${shopId}`);
      return res.data;
    } catch (error) {
      console.error("Error fetching shop details:", error);
      throw error;
    }
  },

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
      throw error;
    }
  },

  updateShopStatus: async (shopId, status, reason = "", options = {}) => {
    try {
      const payload = typeof status === "object"
        ? status
        : { status, reason, ...(typeof reason === "object" ? reason : options) };

      const response = await axios.put(`${API_URL}/shops/${shopId}/status`, payload);
      if (response.data.success) {
        set((state) => {
          const updatedShops = state.shops.map((s) => (s.id === shopId ? { ...s, status: payload.status } : s));
          return { shops: updatedShops };
        });
        await get().fetchLogs();
      }
      return response.data;
    } catch (error) {
      console.error("Error updating shop status:", error);
      throw error;
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
      return response.data;
    } catch (error) {
      console.error("Error deleting shop:", error);
      throw error;
    }
  },

  // Warnings
  issueWarning: async (warningData) => {
    try {
      const res = await axios.post(`${API_URL}/warnings`, warningData);
      return res.data;
    } catch (error) {
      console.error("Error issuing warning:", error);
      throw error;
    }
  },

  resolveWarning: async (warningId, notes) => {
    try {
      const res = await axios.put(`${API_URL}/warnings/${warningId}/resolve`, { resolutionNotes: notes });
      return res.data;
    } catch (error) {
      console.error("Error resolving warning:", error);
      throw error;
    }
  },

  // Reviews Moderation
  fetchReviews: async (type = "shop", status = "all") => {
    try {
      const res = await axios.get(`${API_URL}/reviews?type=${type}&status=${status}`);
      set({ reviews: res.data.reviews });
      return res.data.reviews;
    } catch (error) {
      console.error("Error fetching reviews:", error);
      throw error;
    }
  },

  moderateReview: async (reviewId, status, reason = "", targetType = "shop") => {
    try {
      const res = await axios.put(`${API_URL}/reviews/${reviewId}/moderate`, { status, reason, targetType });
      if (res.data.success) {
        set((state) => ({
          reviews: state.reviews.map((r) => (r.id === reviewId ? { ...r, status, moderationReason: reason } : r)),
        }));
      }
      return res.data;
    } catch (error) {
      console.error("Error moderating review:", error);
      throw error;
    }
  },

  deleteReview: async (reviewId, targetType = "shop") => {
    try {
      const res = await axios.delete(`${API_URL}/reviews/${reviewId}?targetType=${targetType}`);
      if (res.data.success) {
        set((state) => ({
          reviews: state.reviews.filter((r) => r.id !== reviewId),
        }));
      }
      return res.data;
    } catch (error) {
      console.error("Error deleting review:", error);
      throw error;
    }
  },

  // Audit Logs
  fetchAuditLogs: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await axios.get(`${API_URL}/audit-logs?${params}`);
      set({ auditLogs: res.data.logs });
      return res.data.logs;
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      throw error;
    }
  },

  // Backups
  createBackup: async () => {
    try {
      const res = await axios.post(`${API_URL}/backups/create`);
      await get().fetchBackups();
      return res.data;
    } catch (error) {
      console.error("Error creating backup:", error);
      throw error;
    }
  },

  fetchBackups: async () => {
    try {
      const res = await axios.get(`${API_URL}/backups`);
      set({ backups: res.data.backups });
      return res.data.backups;
    } catch (error) {
      console.error("Error fetching backups:", error);
      throw error;
    }
  },

  fetchSystemHealth: async () => {
    try {
      const res = await axios.get(`${API_URL}/system-health`);
      set({ health: res.data.health });
      return res.data.health;
    } catch (error) {
      console.error("Error fetching health:", error);
      throw error;
    }
  },

  // User Actions
  updateUserStatus: async (userId, status) => {
    try {
      const response = await axios.put(`${API_URL}/users/${userId}/status`, { status });
      if (response.data.success) {
        set((state) => ({
          users: state.users.map((u) => (u.id === userId ? { ...u, status } : u)),
        }));
        await get().fetchLogs();
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await axios.delete(`${API_URL}/users/${userId}`);
      if (response.data.success) {
        set((state) => ({
          users: state.users.filter((u) => u.id !== userId),
        }));
        await get().fetchLogs();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  },

  // Listing Actions
  updateListingStatus: async (listingId, status) => {
    try {
      const response = await axios.put(`${API_URL}/listings/${listingId}/status`, { status });
      if (response.data.success) {
        set((state) => ({
          listings: state.listings.map((l) => (l.id === listingId ? { ...l, status } : l)),
        }));
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
        set((state) => ({
          listings: state.listings.filter((l) => l.id !== listingId),
        }));
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
  },
}));

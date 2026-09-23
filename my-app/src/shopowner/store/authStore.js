import axios from "axios";
import { create } from "zustand";

const API_URL =
  import.meta.env.MODE === "development"
    ? "/api/auth"
    : "/api/auth";
const SHOP_URL =
  import.meta.env.MODE === "development"
    ? "/api/shops"
    : "/api/shops";
const SHOPOWNER_URL =
  import.meta.env.MODE === "development"
    ? "/api/shopowner"
    : "/api/shopowner";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set, get) => ({
  user: null,
  shop: null,
  promotions: [],
  announcements: [],
  reviews: [],
  orders: [],
  rooms: [],
  bookings: [],
  dashboardStats: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  signup: async () => {
    const error = new Error("Shop owner accounts must be created by an administrator.");
    set({ error: error.message, isLoading: false });
    throw error;
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      set({
        isAuthenticated: true,
        user: response.data.user,
        error: null,
        isLoading: false,
      });
      await get().fetchShop();
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message || "Error logging in",
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null, message: null });
    try {
      await axios.post(`${API_URL}/logout`);
      set({
        user: null,
        shop: null,
        promotions: [],
        announcements: [],
        reviews: [],
        orders: [],
        rooms: [],
        isAuthenticated: false,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: "Error logging out",
        isLoading: false,
      });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null, message: null });
    try {
      const response = await axios.get(`${API_URL}/check-auth`);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
      await get().fetchShop();
    } catch (error) {
      set({
        error: null,
        isCheckingAuth: false,
        isAuthenticated: false,
        user: null,
        shop: null,
      });
    }
  },

  fetchShop: async () => {
    set({ isLoading: true });
    try {
      const res = await axios.get(`${SHOP_URL}/my-shop`);
      set({ shop: res.data.shop, isLoading: false });
    } catch (err) {
      set({ shop: null, isLoading: false });
    }
  },

  updateOperationalSettings: async (settingsData) => {
    try {
      const res = await axios.put(`${SHOPOWNER_URL}/settings/operational`, settingsData);
      set({ shop: res.data.shop });
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  // Promotions & Offers
  fetchPromotions: async () => {
    try {
      const res = await axios.get(`${SHOPOWNER_URL}/promotions`);
      set({ promotions: res.data });
      return res.data;
    } catch (error) {
      console.error("Failed to fetch promotions", error);
    }
  },

  createPromotion: async (promoData) => {
    const res = await axios.post(`${SHOPOWNER_URL}/promotions`, promoData);
    await get().fetchPromotions();
    return res.data;
  },

  deletePromotion: async (id) => {
    const res = await axios.delete(`${SHOPOWNER_URL}/promotions/${id}`);
    await get().fetchPromotions();
    return res.data;
  },

  // Announcements
  fetchAnnouncements: async () => {
    try {
      const res = await axios.get(`${SHOPOWNER_URL}/announcements`);
      set({ announcements: res.data });
      return res.data;
    } catch (error) {
      console.error("Failed to fetch announcements", error);
    }
  },

  createAnnouncement: async (annData) => {
    const res = await axios.post(`${SHOPOWNER_URL}/announcements`, annData);
    await get().fetchAnnouncements();
    return res.data;
  },

  deleteAnnouncement: async (id) => {
    const res = await axios.delete(`${SHOPOWNER_URL}/announcements/${id}`);
    await get().fetchAnnouncements();
    return res.data;
  },

  // Reviews & Feedback
  fetchReviews: async () => {
    try {
      const res = await axios.get(`${SHOPOWNER_URL}/reviews`);
      set({ reviews: res.data });
      return res.data;
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    }
  },

  replyToReview: async (reviewId, replyMessage) => {
    const res = await axios.post(`${SHOPOWNER_URL}/reviews/${reviewId}/reply`, { replyMessage });
    await get().fetchReviews();
    return res.data;
  },

  // Orders
  fetchOrders: async () => {
    try {
      const res = await axios.get(`${SHOPOWNER_URL}/orders`);
      const orderList = Array.isArray(res.data) ? res.data : (res.data?.orders || []);
      set({ orders: orderList });
      return res.data;
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
  },

  updateOrderStatus: async (orderId, status) => {
    const res = await axios.put(`${SHOPOWNER_URL}/orders/${orderId}/status`, { status });
    await get().fetchOrders();
    return res.data;
  },

  // Rooms (For Hotels/Villas/GuestHouses)
  fetchRooms: async () => {
    try {
      const res = await axios.get(`${SHOPOWNER_URL}/rooms`);
      set({ rooms: res.data });
      return res.data;
    } catch (error) {
      console.error("Failed to fetch rooms", error);
    }
  },

  createRoom: async (roomData) => {
    const isFormData = roomData instanceof FormData;
    const config = isFormData ? { headers: { "Content-Type": "multipart/form-data" } } : {};
    const res = await axios.post(`${SHOPOWNER_URL}/rooms`, roomData, config);
    await get().fetchRooms();
    return res.data;
  },

  updateRoom: async (roomId, roomData) => {
    const isFormData = roomData instanceof FormData;
    const config = isFormData ? { headers: { "Content-Type": "multipart/form-data" } } : {};
    const res = await axios.put(`${SHOPOWNER_URL}/rooms/${roomId}`, roomData, config);
    await get().fetchRooms();
    return res.data;
  },

  updateRoomAvailability: async (roomId, availabilityData) => {
    const res = await axios.patch(`${SHOPOWNER_URL}/rooms/${roomId}/availability`, availabilityData);
    await get().fetchRooms();
    return res.data;
  },

  deleteRoom: async (roomId) => {
    const res = await axios.delete(`${SHOPOWNER_URL}/rooms/${roomId}`);
    await get().fetchRooms();
    return res.data;
  },

  // Real Dashboard Stats
  fetchDashboardStats: async () => {
    try {
      const res = await axios.get(`${SHOPOWNER_URL}/dashboard-stats`);
      set({ dashboardStats: res.data, shop: res.data.shop });
      return res.data;
    } catch (error) {
      console.error("Failed to fetch dashboard stats", error);
    }
  },

  // Accommodation Bookings
  fetchBookings: async () => {
    try {
      const res = await axios.get(`${SHOPOWNER_URL}/bookings`);
      set({ bookings: res.data });
      return res.data;
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    }
  },

  updateBookingStatus: async (bookingId, status) => {
    const res = await axios.put(`${SHOPOWNER_URL}/bookings/${bookingId}/status`, { status });
    await get().fetchBookings();
    return res.data;
  },
}));

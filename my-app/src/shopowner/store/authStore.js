import axios from "axios";
import { create } from "zustand";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/auth"
    : "/api/auth";
const SHOP_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/shops"
    : "/api/shops";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set, get) => ({
  user: null,
  shop: null,
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
        error:
          error.response?.data?.message ||
          error.message ||
          "Error logging in",
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

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const response = await axios.post(`${API_URL}/verify-email`, { code });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      await get().fetchShop();
      return response.data;
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          error.message ||
          "Error verifying email",
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
        error: null,
      });
      await get().fetchShop();
    } catch (error) {
      set({
        user: null,
        shop: null,
        isCheckingAuth: false,
        isAuthenticated: false,
        error: null,
      });
    }
  },

  fetchShop: async () => {
    try {
      const shopResponse = await axios.get(`${SHOP_URL}/my-shop`);
      set({ shop: shopResponse.data.shop });
    } catch (error) {
      set({ shop: null });
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, { email });
      set({
        message: response.data.message,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Error sending reset password email",
      });
      throw error;
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, {
        password,
      });
      set({
        message: response.data.message,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Error resetting password",
      });
      throw error;
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const response = await axios.post(`${API_URL}/change-password`, {
        currentPassword,
        newPassword,
      });
      set({
        isLoading: false,
        error: null,
        message: response.data.message,
      });
      return response.data;
    } catch (error) {
      set({
        isLoading: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Error changing password",
      });
      throw error;
    }
  },

  updateProfile: async (name, email) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const response = await axios.post(`${API_URL}/update-profile`, {
        name,
        email,
      });
      set({
        user: response.data.user,
        isLoading: false,
        error: null,
        message: response.data.message,
      });
      return response.data;
    } catch (error) {
      set({
        isLoading: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Error updating profile",
      });
      throw error;
    }
  },
}));
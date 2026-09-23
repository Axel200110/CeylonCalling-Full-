import axios from "axios";
import { create } from "zustand";

const API_URL =
  import.meta.env.MODE === "development"
    ? "/api/siteuser"
    : "/api/siteuser";

axios.defaults.withCredentials = true;

export const useSiteUserAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isCheckingAuth: true,
  error: null,
  message: null,

  signup: async (email, password, name) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const res = await axios.post(`${API_URL}/signup`, { email, password, name });
      set({
        user: res.data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        message: "Account created successfully",
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const res = await axios.post(`${API_URL}/verify-email`, { code });
      set({
        user: res.data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        message: "Email verified successfully",
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Verification failed",
        isLoading: false,
      });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      set({
        user: res.data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Login failed",
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null, message: null });
    try {
      await axios.post(`${API_URL}/logout`);
      set({ user: null, isAuthenticated: false, isLoading: false, error: null });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Logout failed",
        isLoading: false,
      });
      throw error;
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null, message: null });
    try {
      await axios.post(`${API_URL}/forgot-password`, { email });
      set({ isLoading: false, message: "Password reset link sent to your email" });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error sending reset email",
        isLoading: false,
      });
      throw error;
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null, message: null });
    try {
      await axios.post(`${API_URL}/reset-password/${token}`, { password });
      set({ isLoading: false, message: "Password reset successful" });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error resetting password",
        isLoading: false,
      });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isLoading: true, isCheckingAuth: true, error: null });
    try {
      const res = await axios.get(`${API_URL}/check-auth`);
      set({
        user: res.data.user,
        isAuthenticated: true,
        isLoading: false,
        isCheckingAuth: false,
        error: null,
      });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isCheckingAuth: false,
        error: null,
      });
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const res = await axios.post(`${API_URL}/change-password`, { currentPassword, newPassword });
      set({ isLoading: false, message: res.data.message, error: null });
      return res.data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error changing password",
      });
      throw error;
    }
  },

  updateProfile: async (name, email) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const res = await axios.post(`${API_URL}/update-profile`, { name, email });
      set({
        user: res.data.user,
        isLoading: false,
        message: res.data.message,
        error: null,
      });
      return res.data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error updating profile",
      });
      throw error;
    }
  },
}));
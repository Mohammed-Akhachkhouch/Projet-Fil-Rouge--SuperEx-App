import axios from "axios";
import { API_URL } from "../config/env";

export const http = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Lazy import to avoid require cycle
let authStoreModule = null;
const getAuthStore = async () => {
  if (!authStoreModule) {
    authStoreModule = await import("../store/authStore");
  }
  return authStoreModule.useAuthStore;
};

// Request interceptor - add token from Zustand store
http.interceptors.request.use(async (config) => {
  try {
    const useAuthStore = await getAuthStore();
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // Ignore errors during auth store initialization
  }
  return config;
});

// Response interceptor - handle 401 errors
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Don't trigger logout for login/signup failures (invalid credentials)
    const isAuthRequest = error.config?.url?.includes("/auth/login") || error.config?.url?.includes("/auth/signup");

    if (error.response?.status === 401 && !isAuthRequest) {
      try {
        const useAuthStore = await getAuthStore();
        const state = useAuthStore.getState();
        
        // Only logout if we actually have a session to clear
        if (state.token) {
           // Clear auth state - Zustand persist will also clear storage
           state.logout();
        }
      } catch (e) {
        // Ignore errors during logout
      }
    }
    return Promise.reject(error);
  }
);

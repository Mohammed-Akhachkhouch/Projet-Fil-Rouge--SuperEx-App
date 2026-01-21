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

http.interceptors.request.use(async (config) => {
  try {
    const useAuthStore = await getAuthStore();
    const token = useAuthStore.getState().token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch (e) {
    console.log("Error getting token:", e);
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const useAuthStore = await getAuthStore();
        await useAuthStore.getState().logout();
      } catch (e) {
        console.log("Logout trigger error:", e);
      }
    }
    return Promise.reject(error);
  }
);

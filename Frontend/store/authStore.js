import { create } from "zustand";
import { logout as logoutService } from "../services/authService";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,

  setAuth: (user, token) => set({ user, token }),

  logout: async () => {
    try {
      await logoutService();
    } catch (error) {
      console.log("Logout error:", error);
    } finally {
      set({ user: null, token: null });
    }
  },
}));

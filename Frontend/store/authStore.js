import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { http } from "../services/http";
import * as Updates from "expo-updates";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      _hasHydrated: false,

      setAuth: (user, token) => set({ user, token }),

      setHasHydrated: (state) => set({ _hasHydrated: state }),

      logout: async () => {
        try {
          // Inline the logout API call to avoid require cycle
          await http.post("/auth/logout");
        } catch (error) {
          // Ignore 404 if logout endpoint doesn't exist
          if (error?.response?.status !== 404) {
            console.log("Logout error:", error);
          }
        } finally {
          // Clear auth state
          set({ user: null, token: null });

          // Force remove from storage to ensure persistence is cleared
          await AsyncStorage.removeItem("auth-storage");


        }
      },

      // Helper to check if user is authenticated
      isAuthenticated: () => {
        const state = get();
        return !!(state.token && state.user);
      },
    }),
    {
      name: "auth-storage", // unique name for storage key
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist user and token, not internal flags
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
      onRehydrateStorage: () => (state) => {
        // Called when hydration is complete
        state?.setHasHydrated(true);
      },
    }
  )
);


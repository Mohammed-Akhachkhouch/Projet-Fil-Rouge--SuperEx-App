import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { http } from "../services/http";
import * as Updates from "expo-updates";
import { DevSettings, Platform } from "react-native";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      _hasHydrated: false,

      setAuth: (user, token) => set({ user, token }),

      setHasHydrated: (state) => set({ _hasHydrated: state }),

      logout: async () => {
        set({ user: null, token: null });
      },

      isAuthenticated: () => {
        const state = get();
        return !!(state.token && state.user);
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ user: state.user, token: state.token }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

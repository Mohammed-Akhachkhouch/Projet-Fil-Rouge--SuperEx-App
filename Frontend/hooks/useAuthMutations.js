import { useMutation } from "@tanstack/react-query";
import { login, signup } from "../services/authService";
import { useAuthStore } from "../store/authStore";

export function useLoginMutation() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      console.log("LOGIN SUCCESS:", data.user?.email);
      // Zustand persist middleware automatically saves to AsyncStorage
      setAuth(data.user, data.token);
    },
  });
}

export function useSignupMutation() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      console.log("SIGNUP SUCCESS:", data.user?.email);
      // Zustand persist middleware automatically saves to AsyncStorage
      setAuth(data.user, data.token);
    },
  });
}


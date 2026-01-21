import { useMutation } from "@tanstack/react-query";
import { login, signup } from "../services/authService";
import { useAuthStore } from "../store/authStore";

export function useLoginMutation() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      console.log("LOGIN SUCCESS - API Response:", JSON.stringify(data, null, 2));
      console.log("Setting auth with user:", data.user, "token:", data.token ? "exists" : "missing");
      // Zustand persist middleware automatically saves to AsyncStorage
      setAuth(data.user, data.token);
      // Verify it was set
      console.log("Auth store after setAuth:", useAuthStore.getState());
    },
  });
}

export function useSignupMutation() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      console.log("SIGNUP SUCCESS - API Response:", JSON.stringify(data, null, 2));
      console.log("Setting auth with user:", data.user, "token:", data.token ? "exists" : "missing");
      // Zustand persist middleware automatically saves to AsyncStorage
      setAuth(data.user, data.token);
      // Verify it was set
      console.log("Auth store after setAuth:", useAuthStore.getState());
    },
  });
}

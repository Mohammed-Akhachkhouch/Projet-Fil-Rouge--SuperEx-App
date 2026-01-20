import { http } from "./http";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const login = async ({ email, password }) => {
  const res = await http.post("/auth/login", { email, password });
  return res.data;
};

export const signup = async ({ username, email, password, role }) => {
  const res = await http.post("/auth/signup", { username, email, password, role });
  return res.data;
};

export const logout = async () => {
  try {
    // استدعاء API logout (إن وجد)
    await http.post("/auth/logout");
  } catch (error) {
    // نتابع حتى لو فشل API call
    console.log("Logout API call failed:", error.message);
  } finally {
    // حذف البيانات المحفوظة
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("userData");
  }
};

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
    // إذا كانت الـ API لا تحتوي على endpoint للـ logout (404)، نتجاهل الخطأ
    const status = error?.response?.status;
    if (status && status === 404) {
      // لا نطبع أي شيء - نتعامل مع الحالة كما لو أن الخروج ناجح
    } else {
      // اطبع باقي الأخطاء لمساعدة التصحيح
      console.log("Logout API call failed:", error.message);
    }
  } finally {
    // حذف البيانات المحفوظة
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("userData");
  }
};

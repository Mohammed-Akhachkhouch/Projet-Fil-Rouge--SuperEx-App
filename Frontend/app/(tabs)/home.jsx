import Homescreen from "../Homescreen";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../store/authStore";

export default function Home() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    // إذا المستخدم غير مسجل دخول نرجع للـ welcome
    if (!user) router.replace("/");
  }, [user]);

  return <Homescreen />;
}

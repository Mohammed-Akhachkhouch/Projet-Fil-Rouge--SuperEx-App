import { View, Text, StyleSheet } from "react-native";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../store/authStore";

export default function SellerScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    // حماية: غير seller يقدر يدخل
    if (!user) router.replace("/"); // يرجع للـ welcome
    else if (user.role !== "seller") router.replace("/(tabs)/home"); // يرجع للهوم
  }, [user]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seller Dashboard</Text>
      <Text style={styles.sub}>
        Welcome, {user?.username || user?.name || "Seller"} 👋
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Next step</Text>
        <Text style={styles.cardText}>
          Here you will add products (CRUD) from backend.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "900", color: "#111" },
  sub: { marginTop: 6, color: "#64748b", fontWeight: "600" },
  card: {
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
  },
  cardTitle: { fontWeight: "900", color: "#111", marginBottom: 6 },
  cardText: { color: "#64748b", fontWeight: "600" },
});

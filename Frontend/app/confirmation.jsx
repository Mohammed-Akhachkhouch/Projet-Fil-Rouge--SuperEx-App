import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function Confirmation() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>✅ Order Confirmed</Text>
      <Text style={styles.sub}>Order ID: {orderId}</Text>

      <TouchableOpacity style={styles.primary} onPress={() => router.push(`/order/${orderId}`)}>
        <Text style={styles.primaryText}>Track Order</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondary} onPress={() => router.replace("/(tabs)")}>
        <Text style={styles.secondaryText}>Back Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff", padding: 16, justifyContent: "center" },
  title: { fontSize: 26, fontWeight: "900", textAlign: "center", color: "#111" },
  sub: { marginTop: 10, textAlign: "center", color: "#444", fontWeight: "700" },
  primary: {
    marginTop: 20,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#34A853",
    justifyContent: "center",
    alignItems: "center",
  },
  primaryText: { color: "#fff", fontWeight: "900" },
  secondary: {
    marginTop: 12,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryText: { color: "#111", fontWeight: "800" },
});

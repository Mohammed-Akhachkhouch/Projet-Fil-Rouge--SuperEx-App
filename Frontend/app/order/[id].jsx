import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { useOrder } from "../../hooks/useOrderQueries.js";

export default function OrderDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const { data, isLoading, error } = useOrder(id);

  if (isLoading) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text style={{ fontWeight: "800" }}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text style={{ color: "red", fontWeight: "800" }}>Error loading order</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.back} onPress={() => router.back()}>← Back</Text>

      <Text style={styles.title}>Order #{data.order.id}</Text>
      <Text style={styles.status}>Status: {data.order.status}</Text>

      <Text style={styles.section}>Items:</Text>
      {data.items.map((it) => (
        <Text key={`${it.orderId}-${it.productId}`} style={styles.item}>
          • Product #{it.productId}  x{it.quantity}  —  ${Number(it.price).toFixed(2)}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff", padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  back: { fontWeight: "900", color: "#111", marginBottom: 8 },
  title: { fontSize: 22, fontWeight: "900", color: "#111" },
  status: { marginTop: 6, color: "#444", fontWeight: "700" },
  section: { marginTop: 16, fontWeight: "900", color: "#111" },
  item: { marginTop: 8, color: "#333", fontWeight: "600" },
});

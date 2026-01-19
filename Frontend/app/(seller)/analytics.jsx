import { View, Text, StyleSheet } from "react-native";

export default function SellerAnalytics() {
  return (
    <View style={styles.screen}>
      <Text style={styles.h1}>Sales Analytics</Text>
      <Text style={styles.sub}>Charts will be added later (recharts / victory)</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Revenue</Text>
        <Text style={styles.value}>$12,450.00</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Orders</Text>
        <Text style={styles.value}>342</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff", padding: 20 },
  h1: { fontSize: 22, fontWeight: "900", color: "#111" },
  sub: { marginTop: 4, color: "#6B7280", fontWeight: "600" },

  card: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#EEF2F6",
    borderRadius: 16,
    padding: 14,
  },
  label: { color: "#6B7280", fontWeight: "800" },
  value: { marginTop: 6, fontSize: 20, fontWeight: "900", color: "#111" },
});

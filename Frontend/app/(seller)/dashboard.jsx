import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SellerDashboard() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.h1}>Seller Dashboard</Text>
      <Text style={styles.sub}>Quick overview of your store performance</Text>

      <View style={styles.cardsRow}>
        <View style={styles.card}>
          <Ionicons name="cash-outline" size={22} color="#34A853" />
          <Text style={styles.cardLabel}>Revenue</Text>
          <Text style={styles.cardValue}>$1,240.00</Text>
        </View>

        <View style={styles.card}>
          <Ionicons name="receipt-outline" size={22} color="#34A853" />
          <Text style={styles.cardLabel}>Orders</Text>
          <Text style={styles.cardValue}>56</Text>
        </View>
      </View>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>Pending Orders</Text>
        <View style={styles.item}>
          <Text style={styles.itemTitle}>#ORD-8421</Text>
          <Text style={styles.itemSub}>2 items • $24.50</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.itemTitle}>#ORD-8418</Text>
          <Text style={styles.itemSub}>1 item • $10.90</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 20, paddingBottom: 30 },
  h1: { fontSize: 22, fontWeight: "900", color: "#111" },
  sub: { marginTop: 4, color: "#6B7280", fontWeight: "600" },

  cardsRow: { flexDirection: "row", gap: 12, marginTop: 16 },
  card: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#EEF2F6",
    borderRadius: 16,
    padding: 14,
    backgroundColor: "#fff",
  },
  cardLabel: { marginTop: 8, color: "#6B7280", fontWeight: "700" },
  cardValue: { marginTop: 6, fontSize: 18, fontWeight: "900", color: "#111" },

  block: {
    marginTop: 18,
    borderWidth: 1,
    borderColor: "#EEF2F6",
    borderRadius: 16,
    padding: 14,
  },
  blockTitle: { fontSize: 16, fontWeight: "900", color: "#111", marginBottom: 10 },
  item: { paddingVertical: 10, borderTopWidth: 1, borderTopColor: "#F3F4F6" },
  itemTitle: { fontWeight: "900", color: "#111" },
  itemSub: { marginTop: 3, color: "#6B7280", fontWeight: "600" },
});

import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";

const MOCK_ORDERS = [
  { id: "ORD-8421", status: "pending", items: 2, total: 24.5 },
  { id: "ORD-8418", status: "processing", items: 1, total: 10.9 },
  { id: "ORD-8410", status: "ready", items: 3, total: 42.2 },
];

export default function SellerOrders() {
  return (
    <View style={styles.screen}>
      <Text style={styles.h1}>Orders</Text>

      <FlatList
        contentContainerStyle={{ padding: 20, paddingBottom: 30 }}
        data={MOCK_ORDERS}
        keyExtractor={(o) => o.id}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.id}>{item.id}</Text>
              <Text style={styles.meta}>
                {item.items} items • ${item.total}
              </Text>
            </View>

            <TouchableOpacity style={styles.btn} activeOpacity={0.9}>
              <Text style={styles.btnText}>Details</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff", paddingTop: 14 },
  h1: { paddingHorizontal: 20, fontSize: 22, fontWeight: "900", color: "#111" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#EEF2F6",
    borderRadius: 16,
    padding: 14,
  },
  id: { fontWeight: "900", color: "#111", fontSize: 16 },
  meta: { marginTop: 4, color: "#6B7280", fontWeight: "600" },
  btn: {
    backgroundColor: "#13ec5b",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  btnText: { fontWeight: "900", color: "#0d1b12" },
});

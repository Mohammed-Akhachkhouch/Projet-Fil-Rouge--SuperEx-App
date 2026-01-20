import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native";
import { useSellerOrders } from "../../hooks/useSellerQueries";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

export default function SellerOrders() {
  const [refreshing, setRefreshing] = useState(false);
  const { data, isLoading, error, refetch } = useSellerOrders();

  const orders = data?.orders || [];

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#34A853" />
        <Text style={styles.loadingText}>Loading orders...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle-outline" size={48} color="#E11D48" />
        <Text style={styles.errorText}>Error loading orders</Text>
        <Text style={styles.errorSub}>{error?.message || "Something went wrong"}</Text>
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.center}>
        <Ionicons name="cube-outline" size={48} color="#9AA0A6" />
        <Text style={styles.emptyTitle}>No orders yet</Text>
        <Text style={styles.emptySub}>Orders from customers will appear here</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.h1}>Orders</Text>

      <FlatList
        contentContainerStyle={{ padding: 20, paddingBottom: 30 }}
        data={orders}
        keyExtractor={(o) => String(o.id)}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#34A853"
          />
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <Text style={styles.id}>Order #{item.id}</Text>
                <View style={[styles.status, { backgroundColor: item.status === 'pending' ? '#FEF3C7' : '#D1FAE5' }]}>
                  <Text style={[styles.statusText, { color: item.status === 'pending' ? '#B45309' : '#059669' }]}>
                    {item.status}
                  </Text>
                </View>
              </View>
              <Text style={styles.customer}>From: {item.customerName}</Text>
              <Text style={styles.meta}>
                {item.items.length} item{item.items.length !== 1 ? 's' : ''} • ${item.total.toFixed(2)}
              </Text>
              <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
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
  status: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: { fontSize: 12, fontWeight: "700" },
  customer: { fontSize: 14, color: "#34A853", fontWeight: "600", marginBottom: 4 },
  meta: { fontSize: 13, color: "#6B7280", fontWeight: "600", marginBottom: 4 },
  date: { fontSize: 12, color: "#9AA0A6", fontWeight: "500" },
  btn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#34A853",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 12 },

  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff", padding: 20 },
  loadingText: { marginTop: 12, fontSize: 16, fontWeight: "600", color: "#6B7280" },
  emptyTitle: { marginTop: 12, fontSize: 18, fontWeight: "900", color: "#111" },
  emptySub: { marginTop: 6, color: "#6B7280", textAlign: "center" },
  errorText: { marginTop: 12, fontSize: 18, fontWeight: "900", color: "#111" },
  errorSub: { marginTop: 6, color: "#E11D48", textAlign: "center", fontSize: 14 },
});

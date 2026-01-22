import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useSellerStats } from "../../hooks/useSellerQueries";

export default function SellerDashboard() {
  const [refreshing, setRefreshing] = useState(false);
  const { data, isLoading, error, refetch } = useSellerStats();

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
        <Text style={styles.loadingText}>Loading stats...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle-outline" size={48} color="#E11D48" />
        <Text style={styles.errorText}>Failed to load dashboard</Text>
        <Text style={styles.errorSub}>{error?.message || "Something went wrong"}</Text>
      </View>
    );
  }

  const { totalRevenue = 0, totalOrders = 0, totalProducts = 0, recentOrders = [] } = data || {};

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor="#34A853"
        />
      }
    >
      <Text style={styles.h1}>Seller Dashboard</Text>
      <Text style={styles.sub}>Quick overview of your store performance</Text>

      <View style={styles.cardsRow}>
        <View style={styles.card}>
          <Ionicons name="cash-outline" size={22} color="#34A853" />
          <Text style={styles.cardLabel}>Revenue</Text>
          <Text style={styles.cardValue}>${totalRevenue.toFixed(2)}</Text>
        </View>

        <View style={styles.card}>
          <Ionicons name="receipt-outline" size={22} color="#34A853" />
          <Text style={styles.cardLabel}>Orders</Text>
          <Text style={styles.cardValue}>{totalOrders}</Text>
        </View>
      </View>

      <View style={styles.cardsRow}>
        <View style={styles.card}>
          <Ionicons name="cube-outline" size={22} color="#34A853" />
          <Text style={styles.cardLabel}>Products</Text>
          <Text style={styles.cardValue}>{totalProducts}</Text>
        </View>
      </View>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>Recent Orders</Text>
        {recentOrders.length === 0 ? (
          <Text style={styles.emptyText}>No orders yet</Text>
        ) : (
          recentOrders.map((order) => (
            <View key={order.id} style={styles.item}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.itemTitle}>#{order.id}</Text>
                <Text style={[styles.statusText, { color: order.status === 'pending' ? '#B45309' : '#059669' }]}>
                  {order.status}
                </Text>
              </View>
              <Text style={styles.itemSub}>
                {order.customer} • {order.itemsCount} item{order.itemsCount !== 1 ? 's' : ''} • ${order.total.toFixed(2)}
              </Text>
              <Text style={styles.date}>{new Date(order.date).toLocaleDateString()}</Text>
            </View>
          ))
        )}
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

  statusText: { fontSize: 12, fontWeight: "700" },
  date: { fontSize: 12, color: "#9CA3AF", marginTop: 4 },
  emptyText: { color: "#9CA3AF", textAlign: "center", fontStyle: "italic", padding: 10 },

  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff", padding: 20 },
  loadingText: { marginTop: 12, fontSize: 16, fontWeight: "600", color: "#6B7280" },
  errorText: { marginTop: 12, fontSize: 18, fontWeight: "900", color: "#111" },
  errorSub: { marginTop: 6, color: "#E11D48", textAlign: "center", fontSize: 14 },
});

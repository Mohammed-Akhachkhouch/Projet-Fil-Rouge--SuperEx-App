import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { http } from "../../services/http";
import { useState, useCallback } from "react";
import { useRouter } from "expo-router";

export default function SellerDashboard() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const { data: stats, isLoading, error, refetch } = useQuery({
    queryKey: ["sellerStats"],
    queryFn: async () => {
      const res = await http.get("/seller/stats");
      return res.data;
    },
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  if (isLoading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#34A853" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Failed to load dashboard data</Text>
        <Text style={styles.errorSub}>{error.message}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#34A853"
        />
      }
    >
      <Text style={styles.h1}>Seller Dashboard</Text>
      <Text style={styles.sub}>Quick overview of your store performance</Text>

      <View style={styles.cardsRow}>
        <View style={styles.card}>
          <View style={styles.iconBg}>
            <Ionicons name="cash-outline" size={24} color="#34A853" />
          </View>
          <Text style={styles.cardLabel}>Total Revenue</Text>
          <Text style={styles.cardValue}>${stats?.totalRevenue?.toFixed(2) || "0.00"}</Text>
        </View>

        <View style={styles.card}>
          <View style={[styles.iconBg, { backgroundColor: "#E0F2FE" }]}>
            <Ionicons name="receipt-outline" size={24} color="#0284C7" />
          </View>
          <Text style={styles.cardLabel}>Total Orders</Text>
          <Text style={[styles.cardValue, { color: "#0284C7" }]}>{stats?.totalOrders || 0}</Text>
        </View>
      </View>

      <View style={styles.cardsRow}>
        <View style={styles.card}>
          <View style={[styles.iconBg, { backgroundColor: "#fae8ff" }]}>
            <Ionicons name="cube-outline" size={24} color="#d946ef" />
          </View>
          <Text style={styles.cardLabel}>Products</Text>
          <Text style={[styles.cardValue, { color: "#d946ef" }]}>{stats?.totalProducts || 0}</Text>
        </View>
      </View>

      <View style={styles.block}>
        <View style={styles.blockHeader}>
          <Text style={styles.blockTitle}>Recent Orders</Text>
          <Text onPress={() => router.push("/(seller)/orders")} style={styles.seeAll}>See All</Text>
        </View>

        {stats?.recentOrders?.length > 0 ? (
          stats.recentOrders.map((order) => (
            <View key={order.id} style={styles.item}>
              <View>
                <Text style={styles.itemTitle}>Order #{order.id}</Text>
                <Text style={styles.itemSub}>{order.itemsCount} items • {new Date(order.date).toLocaleDateString()}</Text>
              </View>
              <View style={styles.itemRight}>
                <Text style={styles.itemPrice}>${order.total.toFixed(2)}</Text>
                <Text style={[
                  styles.statusBadge,
                  { color: order.status === 'completed' ? '#34A853' : '#F59E0B' }
                ]}>
                  {order.status}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No orders yet.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 20, paddingBottom: 30 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },

  h1: { fontSize: 24, fontWeight: "900", color: "#111" },
  sub: { marginTop: 4, color: "#6B7280", fontWeight: "600", marginBottom: 24 },

  cardsRow: { flexDirection: "row", gap: 12, marginBottom: 12 },
  card: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#EEF2F6",
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#fff",
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  iconBg: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: "#D1FAE5", justifyContent: "center", alignItems: "center", marginBottom: 12
  },
  cardLabel: { fontSize: 13, color: "#6B7280", fontWeight: "700" },
  cardValue: { marginTop: 4, fontSize: 20, fontWeight: "900", color: "#166534" },

  block: {
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#EEF2F6",
    borderRadius: 20,
    padding: 20,
    backgroundColor: "#fff",
  },
  blockHeader: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16
  },
  blockTitle: { fontSize: 18, fontWeight: "900", color: "#111" },
  seeAll: { fontSize: 14, fontWeight: "700", color: "#34A853" },

  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6"
  },
  itemTitle: { fontWeight: "800", color: "#111", fontSize: 15 },
  itemSub: { marginTop: 4, color: "#9CA3AF", fontWeight: "600", fontSize: 13 },
  itemRight: { alignItems: "flex-end" },
  itemPrice: { fontWeight: "900", color: "#111", fontSize: 15 },
  statusBadge: { fontSize: 12, fontWeight: "700", marginTop: 4, textTransform: "capitalize" },

  emptyText: { textAlign: "center", color: "#9CA3AF", marginTop: 20, marginBottom: 10 },
  errorText: { fontSize: 16, fontWeight: "bold", color: "#EF4444" },
  errorSub: { color: "#6B7280", marginTop: 4 }
});

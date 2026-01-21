import React from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useOrder } from "../../hooks/useOrderQueries.js";

export default function OrderDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const { data, isLoading, error } = useOrder(id);

  if (isLoading) {
    return (
      <View style={[styles.screen, styles.center]}>
        <ActivityIndicator size="large" color="#34A853" />
        <Text style={styles.loadingText}>Loading Order...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
        <Text style={styles.errorText}>Oops! Could not load order.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { order, items } = data;
  const totalPrice = items.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);

  // Status Helper
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return { bg: '#FEF3C7', text: '#D97706', icon: 'time' };
      case 'processing': return { bg: '#E0F2FE', text: '#0284C7', icon: 'settings' };
      case 'completed': return { bg: '#DCFCE7', text: '#16A34A', icon: 'checkmark-circle' };
      case 'cancelled': return { bg: '#FEE2E2', text: '#DC2626', icon: 'close-circle' };
      default: return { bg: '#F3F4F6', text: '#4B5563', icon: 'help-circle' };
    }
  };

  const statusStyle = getStatusColor(order.status);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Status Card */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.label}>Order ID</Text>
              <Text style={styles.value}>#{order.id}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
              <Ionicons name={statusStyle.icon} size={14} color={statusStyle.text} style={{ marginRight: 4 }} />
              <Text style={[styles.statusText, { color: statusStyle.text }]}>{order.status}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <Text style={styles.dateLabel}>Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
        </View>

        {/* Items List */}
        <Text style={styles.sectionTitle}>Items ({items.length})</Text>
        <View style={styles.card}>
          {items.map((it, index) => (
            <View key={`${it.orderId}-${it.productId}`}>
              <View style={styles.itemRow}>
                {/* If product image exists (it.Product.image), use it. Else placeholder. */}
                <View style={styles.itemImagePlaceholder}>
                  <Ionicons name="cube-outline" size={24} color="#999" />
                </View>

                <View style={{ flex: 1, paddingHorizontal: 12 }}>
                  <Text style={styles.itemName} numberOfLines={2}>
                    {it.Product?.name || `Product #${it.productId}`}
                  </Text>
                  <Text style={styles.itemMeta}>{it.quantity} x ${Number(it.price).toFixed(2)}</Text>
                </View>

                <Text style={styles.itemTotal}>
                  ${(Number(it.price) * it.quantity).toFixed(2)}
                </Text>
              </View>
              {index < items.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* Payment Summary */}
        <Text style={styles.sectionTitle}>Payment Summary</Text>
        <View style={styles.card}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${totalPrice.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>$2.99</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>$4.50</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${(totalPrice + 2.99 + 4.50).toFixed(2)}</Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F7F9FC" },
  center: { justifyContent: "center", alignItems: "center" },

  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 16, paddingVertical: 12
  },
  iconBtn: {
    width: 40, height: 40, backgroundColor: "#fff", borderRadius: 20,
    justifyContent: "center", alignItems: "center",
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5, elevation: 1
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#111" },
  content: { padding: 16 },

  // States
  loadingText: { marginTop: 10, color: "#666", fontWeight: "600" },
  errorText: { marginTop: 10, color: "#333", fontWeight: "700", fontSize: 16, marginBottom: 20 },
  backBtn: { backgroundColor: "#111", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  backBtnText: { color: "#fff", fontWeight: "700" },

  // Cards
  card: {
    backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 20,
    shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 8, elevation: 2
  },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  label: { fontSize: 12, color: "#666", marginBottom: 4 },
  value: { fontSize: 18, fontWeight: "800", color: "#111" },
  statusBadge: { flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: "700", textTransform: "capitalize" },
  dateLabel: { fontSize: 12, color: "#999", marginTop: 12 },

  divider: { height: 1, backgroundColor: "#F3F4F6", marginVertical: 12 },

  // Items
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#111", marginBottom: 10, marginLeft: 4 },
  itemRow: { flexDirection: "row", alignItems: "center" },
  itemImagePlaceholder: {
    width: 48, height: 48, borderRadius: 8, backgroundColor: "#F3F4F6",
    justifyContent: "center", alignItems: "center"
  },
  itemName: { fontSize: 14, fontWeight: "600", color: "#111", marginBottom: 4 },
  itemMeta: { fontSize: 12, color: "#666" },
  itemTotal: { fontSize: 14, fontWeight: "700", color: "#111" },

  // Summary
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  summaryLabel: { color: "#666", fontSize: 14 },
  summaryValue: { color: "#111", fontSize: 14, fontWeight: "600" },
  totalLabel: { fontSize: 18, fontWeight: "700", color: "#111" },
  totalValue: { fontSize: 18, fontWeight: "800", color: "#34A853" },
});

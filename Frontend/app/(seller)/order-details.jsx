
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSellerOrders } from "../../hooks/useSellerQueries";
import { Ionicons } from "@expo/vector-icons";

export default function OrderDetails() {
    const { id } = useLocalSearchParams();
    const { data } = useSellerOrders();

    const order = data?.orders?.find((o) => String(o.id) === String(id));

    if (!order) {
        return (
            <View style={styles.center}>
                <Ionicons name="alert-circle-outline" size={48} color="#E11D48" />
                <Text style={styles.errorText}>Order not found</Text>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={20} color="#fff" />
                    <Text style={styles.backBtnText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 40 }}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                    <Ionicons name="arrow-back" size={24} color="#111" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Order #{order.id}</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* Status Card */}
            <View style={styles.section}>
                <View style={styles.card}>
                    <Text style={styles.label}>Status</Text>
                    <View style={[styles.statusBadge, { backgroundColor: order.status === 'pending' ? '#FEF3C7' : '#D1FAE5' }]}>
                        <Text style={[styles.statusText, { color: order.status === 'pending' ? '#B45309' : '#059669' }]}>
                            {order.status.toUpperCase()}
                        </Text>
                    </View>
                </View>
                <Text style={styles.date}>Placed on {new Date(order.createdAt).toLocaleString()}</Text>
            </View>

            {/* Customer Info */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Customer</Text>
                <View style={styles.card}>
                    <View style={styles.row}>
                        <Ionicons name="person-outline" size={20} color="#6B7280" />
                        <Text style={styles.infoText}>{order.customerName || "Guest User"}</Text>
                    </View>
                    {order.shippingAddress && (
                        <View style={[styles.row, { marginTop: 12, alignItems: 'flex-start' }]}>
                            <Ionicons name="location-outline" size={20} color="#6B7280" />
                            <Text style={[styles.infoText, { flex: 1 }]}>{order.shippingAddress}</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Items */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Items ({order.items?.length || 0})</Text>
                <View style={styles.card}>
                    {order.items?.map((item, index) => (
                        <View key={index} style={[styles.itemRow, index !== order.items.length - 1 && styles.borderBottom]}>
                            <View style={styles.itemInfo}>
                                <Text style={styles.itemName}>{item.productName || "Product Item"}</Text>
                                <Text style={styles.itemQty}>x{item.quantity}</Text>
                            </View>
                            <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                        </View>
                    ))}

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>${order.total.toFixed(2)}</Text>
                    </View>
                </View>
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: "#F9FAFB" },
    center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
    errorText: { marginTop: 12, fontSize: 18, fontWeight: "bold", color: "#111", marginBottom: 20 },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 20,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#EEF2F6",
    },
    headerTitle: { fontSize: 18, fontWeight: "bold", color: "#111" },
    iconBtn: { padding: 8 },
    section: { paddingHorizontal: 20, marginTop: 20 },
    sectionTitle: { fontSize: 16, fontWeight: "700", color: "#374151", marginBottom: 10 },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: "#EEF2F6",
        shadowColor: "#000",
        shadowOpacity: 0.02,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    label: { fontSize: 14, color: "#6B7280", marginBottom: 6 },
    statusBadge: {
        alignSelf: "flex-start",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusText: { fontSize: 12, fontWeight: "700" },
    date: { marginTop: 8, fontSize: 13, color: "#9CA3AF" },
    row: { flexDirection: "row", alignItems: "center", gap: 10 },
    infoText: { fontSize: 15, color: "#111" },
    itemRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 12 },
    borderBottom: { borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
    itemInfo: { flex: 1 },
    itemName: { fontSize: 15, fontWeight: "600", color: "#111" },
    itemQty: { fontSize: 13, color: "#6B7280", marginTop: 2 },
    itemPrice: { fontSize: 15, fontWeight: "600", color: "#111" },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: "#EEF2F6",
    },
    totalLabel: { fontSize: 16, fontWeight: "700", color: "#111" },
    totalValue: { fontSize: 18, fontWeight: "900", color: "#34A853" },
    backBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#34A853",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        gap: 8,
    },
    backBtnText: { color: "#fff", fontWeight: "600" },
});

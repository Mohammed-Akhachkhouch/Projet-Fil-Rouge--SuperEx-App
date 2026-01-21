import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useOrders } from '../../hooks/useOrderQueries';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";

export default function Orders() {
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { data, isLoading, error, refetch } = useOrders();

  useEffect(() => {
    if (error) {
      console.log('Orders Error:', error);
    }
  }, [error]);

  const orders = data?.orders || [];

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return { bg: '#FEF3C7', text: '#D97706', icon: 'time-outline' };
      case 'processing': return { bg: '#E0F2FE', text: '#0284C7', icon: 'settings-outline' };
      case 'completed': return { bg: '#DCFCE7', text: '#16A34A', icon: 'checkmark-circle-outline' };
      case 'cancelled': return { bg: '#FEE2E2', text: '#DC2626', icon: 'close-circle-outline' };
      default: return { bg: '#F3F4F6', text: '#4B5563', icon: 'help-circle-outline' };
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
        <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
        <Text style={styles.errorText}>Oops! Could not load orders.</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={refetch}>
          <Text style={styles.retryBtnText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
      </View>

      {orders.length === 0 ? (
        <View style={styles.center}>
          <View style={styles.emptyIconBg}>
            <Ionicons name="cart-outline" size={32} color="#9AA0A6" />
          </View>
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptySub}>Start shopping and track your orders here.</Text>
          <TouchableOpacity style={styles.shopBtn} onPress={() => router.push('/(tabs)/home')}>
            <Text style={styles.shopBtnText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#34A853"
            />
          }
          renderItem={({ item }) => {
            const statusStyle = getStatusColor(item.status);
            return (
              <TouchableOpacity
                style={styles.card}
                activeOpacity={0.7}
                onPress={() => router.push(`/order/${item.id}`)}
              >
                <View style={styles.cardHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={styles.iconCircle}>
                      <Ionicons name="receipt-outline" size={18} color="#34A853" />
                    </View>
                    <View style={{ marginLeft: 10 }}>
                      <Text style={styles.orderId}>Order #{item.id}</Text>
                      <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#CCC" />
                </View>

                <View style={styles.divider} />

                <View style={styles.cardFooter}>
                  <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                    <Ionicons name={statusStyle.icon} size={14} color={statusStyle.text} style={{ marginRight: 4 }} />
                    <Text style={[styles.statusText, { color: statusStyle.text }]}>
                      {item.status || "Unknown"}
                    </Text>
                  </View>
                  <Text style={styles.viewDetailsText}>View Details</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F9FC' },
  header: {
    paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#F0F0F0'
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#111' },

  listContent: { padding: 16 },

  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16,
    shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 8, elevation: 2,
    borderWidth: 1, borderColor: '#F0F0F0'
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  iconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#DCFCE7', justifyContent: 'center', alignItems: 'center' },
  orderId: { fontSize: 15, fontWeight: '700', color: '#111' },
  date: { fontSize: 12, color: '#888', marginTop: 2 },

  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 12 },

  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: '700', textTransform: 'capitalize' },
  viewDetailsText: { fontSize: 13, fontWeight: '600', color: '#34A853' },

  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loadingText: { marginTop: 12, fontSize: 16, fontWeight: '600', color: '#666' },

  errorText: { marginTop: 12, fontSize: 16, fontWeight: '700', color: '#333' },
  retryBtn: { marginTop: 16, backgroundColor: '#111', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  retryBtnText: { color: '#fff', fontWeight: '700' },

  emptyIconBg: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#111' },
  emptySub: { marginTop: 6, color: '#666', textAlign: 'center', maxWidth: 250, lineHeight: 20 },
  shopBtn: { marginTop: 24, backgroundColor: '#34A853', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  shopBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});

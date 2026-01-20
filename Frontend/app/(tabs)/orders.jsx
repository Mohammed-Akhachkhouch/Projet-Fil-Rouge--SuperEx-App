import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useOrders } from '../../hooks/useOrderQueries';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';

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
        <Text style={styles.errorSub}>{error?.message || JSON.stringify(error)}</Text>
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.center}>
        <Ionicons name="cart-outline" size={48} color="#9AA0A6" />
        <Text style={styles.emptyTitle}>No orders yet</Text>
        <Text style={styles.emptySub}>Start shopping to create your first order</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Orders</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#34A853"
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => router.push(`/order/${item.id}`)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.id}>Order #{item.id}</Text>
              <View style={[styles.status, { backgroundColor: item.status === 'Delivered' ? '#D1FAE5' : '#FEF3C7' }]}>
                <Text style={[styles.statusText, { color: item.status === 'Delivered' ? '#059669' : '#B45309' }]}>
                  {item.status}
                </Text>
              </View>
            </View>
            <Text style={styles.meta}>Created: {new Date(item.createdAt).toLocaleDateString()}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 24, fontWeight: '900', color: '#111', marginBottom: 12 },
  
  card: {
    borderWidth: 1,
    borderColor: '#EEF2F6',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  id: { fontSize: 16, fontWeight: '900', color: '#111' },
  status: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: { fontSize: 12, fontWeight: '700' },
  meta: { marginTop: 6, color: '#6B7280', fontWeight: '700' },

  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20 },
  loadingText: { marginTop: 12, fontSize: 16, fontWeight: '600', color: '#6B7280' },
  emptyTitle: { marginTop: 12, fontSize: 18, fontWeight: '900', color: '#111' },
  emptySub: { marginTop: 6, color: '#6B7280', textAlign: 'center' },
  errorText: { marginTop: 12, fontSize: 18, fontWeight: '900', color: '#111' },
  errorSub: { marginTop: 6, color: '#E11D48', textAlign: 'center' },
});

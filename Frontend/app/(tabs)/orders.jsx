import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';

const MOCK_ORDERS = [
  { id: 'SX-123456', status: 'On the way', total: 18.40 },
  { id: 'SX-999111', status: 'Delivered', total: 9.99 },
];

export default function Orders() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Orders</Text>

      <FlatList
        data={MOCK_ORDERS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => router.push(`/order/${item.id}`)}
          >
            <Text style={styles.id}>{item.id}</Text>
            <Text style={styles.meta}>{item.status} • ${item.total.toFixed(2)}</Text>
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
  id: { fontSize: 16, fontWeight: '900', color: '#111' },
  meta: { marginTop: 6, color: '#6B7280', fontWeight: '700' },
});

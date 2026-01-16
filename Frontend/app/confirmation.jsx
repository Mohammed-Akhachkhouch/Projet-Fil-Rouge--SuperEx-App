import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Confirmation() {
  const router = useRouter();
  const { orderId, total, address } = useLocalSearchParams();

  return (
    <View style={styles.screen}>
      <View style={styles.iconWrap}>
        <Ionicons name="checkmark" size={40} color="#0d1b12" />
      </View>

      <Text style={styles.title}>Order Confirmed 🎉</Text>
      <Text style={styles.subtitle}>
        Your order has been placed successfully.
      </Text>

      <View style={styles.card}>
        <Row label="Order ID" value={orderId ? String(orderId) : '—'} />
        <Row label="Total" value={total ? `$${Number(total).toFixed(2)}` : '—'} />
        <Row label="Address" value={address ? String(address) : '—'} />
      </View>

      <TouchableOpacity
        style={styles.primaryBtn}
        activeOpacity={0.9}
        onPress={() => router.replace('/(tabs)/orders')}
      >
        <Text style={styles.primaryText}>Track Order</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryBtn}
        activeOpacity={0.9}
        onPress={() => router.replace('/(tabs)')}
      >
        <Text style={styles.secondaryText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

function Row({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value} numberOfLines={2}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  iconWrap: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#13ec5b',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#111',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 18,
  },
  card: {
    borderWidth: 1,
    borderColor: '#EEF2F6',
    borderRadius: 18,
    padding: 14,
    marginBottom: 18,
  },
  row: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  label: { color: '#6B7280', fontWeight: '800', marginBottom: 4 },
  value: { color: '#111', fontWeight: '900' },

  primaryBtn: {
    height: 54,
    borderRadius: 16,
    backgroundColor: '#34A853',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryText: { color: '#fff', fontWeight: '900', fontSize: 16 },

  secondaryBtn: {
    height: 54,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  secondaryText: { color: '#111', fontWeight: '900', fontSize: 16 },
});

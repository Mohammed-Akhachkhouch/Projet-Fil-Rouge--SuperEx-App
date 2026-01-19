import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '../../store/cartStore.js';
import { useRouter } from 'expo-router';

export default function Cart() {
  const items = useCartStore((s) => s.items);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const totalPrice = useCartStore((s) => s.totalPrice);
  const router = useRouter();

  const total = totalPrice();

  if (items.length === 0) {
    return (
      <View style={styles.center}>
        <Ionicons name="cart-outline" size={64} color="#9AA0A6" />
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySub}>Add items to see them here.</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>My Cart</Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 140 }}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Image source={item.image} style={styles.image} />

            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
              {!!item.qtyLabel && <Text style={styles.meta}>{item.qtyLabel}</Text>}
              <Text style={styles.price}>${Number(item.price).toFixed(2)}</Text>

              <View style={styles.controls}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => setQuantity(item.id, item.quantity - 1)}
                >
                  <Text style={styles.qtyBtnText}>-</Text>
                </TouchableOpacity>

                <Text style={styles.qtyValue}>{item.quantity}</Text>

                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => setQuantity(item.id, item.quantity + 1)}
                >
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity onPress={() => removeFromCart(item.id)}>
              <Ionicons name="trash-outline" size={22} color="#E11D48" />
            </TouchableOpacity>
          </View>
        )}
      />

     
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalPrice}>${total.toFixed(2)}</Text>
        </View>

        <TouchableOpacity
  style={styles.checkoutBtn}
  activeOpacity={0.9}
  onPress={() => router.push('/checkout')}
>
  <Text style={styles.checkoutText}>Checkout</Text>
</TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 24, fontWeight: '900', color: '#111', marginBottom: 12 },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#EEF2F6',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  image: { width: 62, height: 62, borderRadius: 12, resizeMode: 'cover', backgroundColor: '#F3F4F6' },
  name: { fontSize: 16, fontWeight: '800', color: '#111' },
  meta: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  price: { marginTop: 6, fontSize: 14, fontWeight: '900', color: '#111' },

  controls: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  qtyBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center', alignItems: 'center',
  },
  qtyBtnText: { fontSize: 18, fontWeight: '900', color: '#111' },
  qtyValue: { width: 32, textAlign: 'center', fontWeight: '900', fontSize: 16, color: '#111' },

  footer: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#EEF2F6',
    borderRadius: 18,
    padding: 14,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalText: { fontSize: 14, fontWeight: '700', color: '#6B7280' },
  totalPrice: { fontSize: 18, fontWeight: '900', color: '#111' },

  checkoutBtn: {
    marginTop: 12,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#34A853',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutText: { color: '#fff', fontSize: 16, fontWeight: '900' },

  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20 },
  emptyTitle: { marginTop: 12, fontSize: 18, fontWeight: '900', color: '#111' },
  emptySub: { marginTop: 6, color: '#6B7280', textAlign: 'center' },
});

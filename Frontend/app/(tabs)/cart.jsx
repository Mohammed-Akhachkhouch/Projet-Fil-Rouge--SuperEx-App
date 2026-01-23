import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, RefreshControl, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '../../store/cartStore.js';
import { useRouter } from 'expo-router';
import { SafeAreaView } from "react-native-safe-area-context";
import { scaleFontSize, moderateScale, scaleWidth } from '../../utils/responsive';

export default function Cart() {
  const [refreshing, setRefreshing] = useState(false);
  const items = useCartStore((s) => s.items);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const totalPrice = useCartStore((s) => s.totalPrice); // Assuming totalPrice is a selector returning a function
  const router = useRouter();

  // Execute totalPrice function if it is one, otherwise use it as value (safeguard)
  const total = typeof totalPrice === 'function' ? totalPrice() : (totalPrice || 0);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      setRefreshing(false);
    }
  };

  if (items.length === 0) {
    return (
      <View style={styles.center}>
        <View style={styles.emptyIconBg}>
          <Ionicons name="cart-outline" size={48} color="#9AA0A6" />
        </View>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySub}>Looks like you haven't added anything to your cart yet.</Text>
        <TouchableOpacity style={styles.startShopBtn} onPress={() => router.push('/(tabs)/home')}>
          <Text style={styles.startShopText}>Start Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Cart</Text>
        <View style={styles.itemCountBadge}>
          <Text style={styles.itemCountText}>{items.length} Items</Text>
        </View>
      </View>

      <FlatList
        data={items}
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
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />

            <View style={{ flex: 1, marginLeft: 16 }}>
              <View style={styles.rowTop}>
                <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
                <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.trashBtn}>
                  <Ionicons name="trash-outline" size={20} color="#E11D48" />
                </TouchableOpacity>
              </View>

              {!!item.qtyLabel && <Text style={styles.meta}>{item.qtyLabel}</Text>}

              <View style={styles.rowBottom}>
                <Text style={styles.price}>${Number(item.price).toFixed(2)}</Text>

                <View style={styles.controls}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => setQuantity(item.id, Math.max(1, item.quantity - 1))}
                  >
                    <Ionicons name="remove" size={18} color="#111" />
                  </TouchableOpacity>

                  <Text style={styles.qtyValue}>{item.quantity}</Text>

                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => setQuantity(item.id, item.quantity + 1)}
                  >
                    <Ionicons name="add" size={18} color="#111" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}
      />

      <View style={styles.footerContainer}>
        <View style={styles.footer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalPrice}>${total.toFixed(2)}</Text>
          </View>

          <TouchableOpacity
            style={styles.checkoutBtn}
            activeOpacity={0.8}
            onPress={() => router.push('/checkout')}
          >
            <Text style={styles.checkoutText}>Proceed to Checkout</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F9FC' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: moderateScale(20), paddingVertical: moderateScale(16), backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#F0F0F0'
  },
  headerTitle: { fontSize: scaleFontSize(22), fontWeight: '800', color: '#111' },
  itemCountBadge: { backgroundColor: '#F3F4F6', paddingHorizontal: moderateScale(10), paddingVertical: moderateScale(6), borderRadius: moderateScale(20) },
  itemCountText: { fontSize: scaleFontSize(12), fontWeight: '700', color: '#111' },

  listContent: { padding: moderateScale(16), paddingBottom: moderateScale(140) },

  row: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: moderateScale(16),
    padding: moderateScale(12),
    marginBottom: moderateScale(16),
    shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 8, elevation: 2
  },
  image: { width: scaleWidth(80), height: scaleWidth(80), borderRadius: moderateScale(12), backgroundColor: '#F3F4F6' },

  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  name: { fontSize: scaleFontSize(16), fontWeight: '700', color: '#111', flex: 1, paddingRight: moderateScale(8) },
  trashBtn: { padding: moderateScale(4) },

  meta: { fontSize: scaleFontSize(13), color: '#888', marginTop: moderateScale(4) },

  rowBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: moderateScale(12) },
  price: { fontSize: scaleFontSize(18), fontWeight: '800', color: '#111' },

  controls: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: moderateScale(12), padding: moderateScale(4) },
  qtyBtn: {
    width: scaleWidth(28), height: scaleWidth(28), borderRadius: moderateScale(8),
    backgroundColor: '#fff',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 2, elevation: 1
  },
  qtyValue: { width: scaleWidth(30), textAlign: 'center', fontWeight: '700', fontSize: scaleFontSize(14), color: '#111' },

  footerContainer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'transparent'
  },
  footer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: moderateScale(24), borderTopRightRadius: moderateScale(24),
    padding: moderateScale(24),
    paddingBottom: moderateScale(32),
    shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 20, elevation: 10
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: moderateScale(20) },
  totalLabel: { fontSize: scaleFontSize(16), fontWeight: '600', color: '#666' },
  totalPrice: { fontSize: scaleFontSize(24), fontWeight: '800', color: '#111' },

  checkoutBtn: {
    height: moderateScale(56),
    borderRadius: moderateScale(16),
    backgroundColor: '#34A853',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#34A853", shadowOpacity: 0.25, shadowRadius: 10, elevation: 5
  },
  checkoutText: { color: '#fff', fontSize: scaleFontSize(16), fontWeight: '700', marginRight: moderateScale(8) },

  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: moderateScale(32) },
  emptyIconBg: { width: scaleWidth(80), height: scaleWidth(80), borderRadius: moderateScale(40), backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', marginBottom: moderateScale(24) },
  emptyTitle: { fontSize: scaleFontSize(20), fontWeight: '800', color: '#111' },
  emptySub: { marginTop: moderateScale(8), color: '#6B7280', textAlign: 'center', fontSize: scaleFontSize(15), lineHeight: scaleFontSize(22) },
  startShopBtn: { marginTop: moderateScale(32), backgroundColor: '#111', paddingHorizontal: moderateScale(24), paddingVertical: moderateScale(14), borderRadius: moderateScale(14) },
  startShopText: { color: '#fff', fontWeight: '700', fontSize: scaleFontSize(16) }
});

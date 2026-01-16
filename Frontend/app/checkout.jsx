import { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

import { useCartStore } from './store/cartStore';

export default function Checkout() {
  const router = useRouter();

  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice);
  const clearCart = useCartStore((s) => s.clearCart);

  const [address, setAddress] = useState('My Address');
  const [location, setLocation] = useState(null);
  const [loadingLoc, setLoadingLoc] = useState(true);
  const [locError, setLocError] = useState('');

  const total = totalPrice();

  useEffect(() => {
    (async () => {
      try {
        setLoadingLoc(true);
        setLocError('');

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocError('Location permission denied');
          setLoadingLoc(false);
          return;
        }

        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const coords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
        setLocation(coords);

        const rev = await Location.reverseGeocodeAsync(coords);
        if (rev?.[0]) {
          const a = rev[0];
          const formatted = `${a.name || ''} ${a.street || ''}, ${a.city || ''}, ${a.country || ''}`.trim();
          if (formatted.length > 5) setAddress(formatted);
        }

        setLoadingLoc(false);
      } catch (e) {
        setLocError('Failed to get location');
        setLoadingLoc(false);
      }
    })();
  }, []);

  const region = useMemo(() => {
    if (!location) return null;
    return {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }, [location]);

  const handlePlaceOrder = () => {
  const fakeOrderId = `SX-${Math.floor(Math.random() * 900000 + 100000)}`;

  clearCart();

  router.replace({
    pathname: '/confirmation',
    params: {
      orderId: fakeOrderId,
      total: String(total),
      address,
    },
  });
};


  if (items.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyTitle}>No items to checkout</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.link}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Checkout</Text>
      </View>

      <View style={styles.mapBox}>
        {loadingLoc ? (
          <View style={styles.mapLoading}>
            <ActivityIndicator />
            <Text style={{ marginTop: 8, color: '#6B7280' }}>Getting your location…</Text>
          </View>
        ) : locError ? (
          <View style={styles.mapLoading}>
            <Text style={{ color: '#E11D48', fontWeight: '800' }}>{locError}</Text>
            <Text style={{ marginTop: 6, color: '#6B7280', textAlign: 'center' }}>
              You can still type your address below.
            </Text>
          </View>
        ) : (
          <MapView style={styles.map} initialRegion={region} showsUserLocation>
            {location && (
              <Marker coordinate={location} title="You are here" />
            )}
          </MapView>
        )}
      </View>

      <View style={styles.addressBox}>
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <TextInput
          value={address}
          onChangeText={setAddress}
          placeholder="Enter your address"
          style={styles.addressInput}
        />
      </View>

      <View style={styles.itemsHeader}>
        <Text style={styles.sectionTitle}>Your Items</Text>
        <Text style={styles.itemsCount}>{items.length} items</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Image source={item.image} style={styles.image} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
              {!!item.qtyLabel && <Text style={styles.meta}>{item.qtyLabel}</Text>}
              <Text style={styles.lineTotal}>
                ${Number(item.price).toFixed(2)} × {item.quantity} = {(Number(item.price) * item.quantity).toFixed(2)}$
              </Text>
            </View>
          </View>
        )}
      />

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalPrice}>${total.toFixed(2)}</Text>
        </View>

        <TouchableOpacity style={styles.placeBtn} onPress={handlePlaceOrder} activeOpacity={0.9}>
          <Text style={styles.placeText}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff', padding: 20 },

  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  back: { fontWeight: '900', color: '#111' },
  title: { fontSize: 22, fontWeight: '900', color: '#111' },

  mapBox: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEF2F6',
    backgroundColor: '#F9FAFB',
  },
  map: { flex: 1 },
  mapLoading: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },

  addressBox: {
    borderWidth: 1,
    borderColor: '#EEF2F6',
    borderRadius: 16,
    padding: 14,
    backgroundColor: '#fff',
    marginTop: 12,
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: '#111' },
  addressInput: {
    marginTop: 10,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    color: '#111',
    backgroundColor: '#F9FAFB',
  },

  itemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemsCount: { color: '#6B7280', fontWeight: '700' },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEF2F6',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  image: { width: 58, height: 58, borderRadius: 12, resizeMode: 'cover', backgroundColor: '#F3F4F6' },
  name: { fontSize: 15, fontWeight: '900', color: '#111' },
  meta: { marginTop: 2, fontSize: 12, color: '#6B7280' },
  lineTotal: { marginTop: 8, fontWeight: '800', color: '#111' },

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
  totalText: { color: '#6B7280', fontWeight: '800' },
  totalPrice: { fontSize: 18, fontWeight: '900', color: '#111' },

  placeBtn: {
    marginTop: 12,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#34A853',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeText: { color: '#fff', fontSize: 16, fontWeight: '900' },

  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyTitle: { fontSize: 18, fontWeight: '900', color: '#111' },
  link: { marginTop: 10, color: '#34A853', fontWeight: '800' },
});

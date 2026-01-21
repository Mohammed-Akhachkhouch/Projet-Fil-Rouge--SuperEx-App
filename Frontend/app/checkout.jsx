import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

import { useCartStore } from "../store/cartStore.js";
import { useCreateOrderMutation } from "../hooks/useOrderMutations.js";

export default function Checkout() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const totalPrice = useCartStore((s) => s.totalPrice());


  const createOrderMut = useCreateOrderMutation();

  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          setLoadingLocation(false);
          return;
        }

        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);

        let addressResponse = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude
        });

        if (addressResponse.length > 0) {
          const addr = addressResponse[0];
          const street = addr.street || addr.name || '';
          const city = addr.city || addr.subregion || '';
          const country = addr.country || '';
          setAddress({
            title: addr.name || "Current Location",
            full: [street, city, country].filter(Boolean).join(', ')
          });
        }
      } catch (e) {
        console.log("Location Error:", e);
        setErrorMsg('Could not fetch location');
      } finally {
        setLoadingLocation(false);
      }
    })();
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handlePlaceOrder = async () => {
    try {
      const payload = {
        items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
        shippingAddress: address ? address.full : "Unknown Location"
      };

      const data = await createOrderMut.mutateAsync(payload);

      clearCart();
      clearCart();
      router.replace({
        pathname: "/confirmation",
        params: {
          orderId: data.orderId,
          address: address ? address.full : "Unknown Location",
          lat: location ? location.latitude : null,
          lng: location ? location.longitude : null
        }
      });
    } catch (e) {
      console.log("ORDER ERROR:", e?.response?.data?.message || e.message);
      Alert.alert("Order Failed", "Something went wrong. Please try again.");
    }
  };

  const deliveryFee = 2.99;
  const tax = 4.50;
  const grandTotal = (typeof totalPrice === 'number' ? totalPrice : 0) + deliveryFee + tax;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionHeader}>Delivery Address</Text>
        <View style={styles.card}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <View style={styles.addressRow}>
                <Ionicons name="location" size={20} color="#0EA5E9" style={{ marginRight: 6 }} />
                <Text style={styles.addressTitle}>
                  {loadingLocation ? "Locating..." : (address?.title || "My Location")}
                </Text>
              </View>
              <Text style={styles.addressText} numberOfLines={2}>
                {errorMsg ? errorMsg : (address?.full || "Fetching address...")}
              </Text>

              <TouchableOpacity style={[styles.editBtn, { alignSelf: 'flex-start', marginTop: 8 }]}>
                <Text style={styles.editBtnText}>Change</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.mapContainer}>
              {location ? (
                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                  }}
                  scrollEnabled={false}
                  zoomEnabled={false}
                  pitchEnabled={false}
                  rotateEnabled={false}
                >
                  <Marker
                    coordinate={{ latitude: location.latitude, longitude: location.longitude }}
                  />
                </MapView>
              ) : (
                <View style={[styles.map, { backgroundColor: '#E0F2FE', justifyContent: 'center', alignItems: 'center' }]}>
                  <ActivityIndicator color="#0EA5E9" />
                </View>
              )}
            </View>
          </View>
        </View>

        <Text style={styles.sectionHeader}>Delivery Time</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          <TouchableOpacity style={[styles.timeOption, styles.timeOptionActive]}>
            <Ionicons name="flash" size={18} color="#111" />
            <View style={{ marginLeft: 8 }}>
              <Text style={styles.timeTitle}>Express</Text>
              <Text style={styles.timeSubtitle}>30 - 45 min</Text>
            </View>
            <View style={styles.radioSelected} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.timeOption}>
            <Ionicons name="time-outline" size={18} color="#666" />
            <View style={{ marginLeft: 8 }}>
              <Text style={[styles.timeTitle, { color: "#666" }]}>Today</Text>
              <Text style={styles.timeSubtitle}>1:00 PM - 2:00 PM</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.itemsHeaderRow}>
          <Text style={styles.sectionHeader}>Order Summary</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.editGreen}>Edit Cart</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          {items.map((item, index) => (
            <View key={item.id}>
              <View style={styles.itemRow}>
                <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="contain" />
                <View style={{ flex: 1, paddingHorizontal: 12 }}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemQty}>{item.quantity} {item.qtyLabel || 'unit'}</Text>
                </View>
                <Text style={styles.itemPrice}>${item.price}</Text>
              </View>
              {index < items.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
          {items.length === 0 && <Text style={{ textAlign: 'center', color: '#999', padding: 20 }}>Your cart is empty</Text>}
        </View>

        <Text style={styles.sectionHeader}>Payment Method</Text>
        <View style={styles.card}>
          <View style={styles.addressRow}>
            <View style={styles.cardIconBg}>
              <View style={styles.cardIconInner} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.addressTitle}>Visa ending in 4242</Text>
              <Text style={styles.addressText}>Expires 12/25</Text>
            </View>
            <Ionicons name="checkmark-circle" size={24} color="#34A853" />
          </View>
        </View>

        <View style={[styles.card, { marginTop: 24, paddingVertical: 20 }]}>
          <View style={styles.costRow}>
            <Text style={styles.costLabel}>Subtotal</Text>
            <Text style={styles.costValue}>${(typeof totalPrice === 'number' ? totalPrice : 0).toFixed(2)}</Text>
          </View>
          <View style={styles.costRow}>
            <Text style={styles.costLabel}>Delivery Fee</Text>
            <Text style={styles.costValue}>${deliveryFee.toFixed(2)}</Text>
          </View>
          <View style={styles.costRow}>
            <Text style={styles.costLabel}>Tax & Fees</Text>
            <Text style={styles.costValue}>${tax.toFixed(2)}</Text>
          </View>
          <View style={[styles.divider, { marginVertical: 12 }]} />
          <View style={styles.costRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${grandTotal.toFixed(2)}</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.payBtn, (items.length === 0 || createOrderMut.isPending) && { opacity: 0.7 }]}
          onPress={handlePlaceOrder}
          disabled={items.length === 0 || createOrderMut.isPending}
        >
          <Text style={styles.payBtnText}>
            {createOrderMut.isPending ? "Placing Order..." : "Place Order"}
          </Text>
          <View style={styles.priceTag}>
            <Text style={styles.priceTagText}>${grandTotal.toFixed(2)}</Text>
            <Ionicons name="arrow-forward" size={16} color="#000" />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F9FC" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  iconBtn: {
    width: 40, height: 40,
    backgroundColor: "#fff",
    borderRadius: 20,
    justifyContent: "center", alignItems: "center",
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5, elevation: 1
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#111" },
  scrollContent: { padding: 16 },

  sectionHeader: { fontSize: 16, fontWeight: "700", color: "#111", marginBottom: 12, marginTop: 4 },
  itemsHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12, marginTop: 8 },
  editGreen: { color: "#34A853", fontWeight: "600", fontSize: 14 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 8, elevation: 2
  },

  // Address
  addressRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  addressTitle: { fontWeight: "700", fontSize: 16, color: "#111" },
  addressText: { color: "#666", fontSize: 13, lineHeight: 18 },
  editBtn: { backgroundColor: "#F3F4F6", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  editBtnText: { fontSize: 12, fontWeight: "700", color: "#111" },

  // Map Real
  mapContainer: {
    width: 100, height: 80,
    borderRadius: 12,
    marginLeft: 16,
    overflow: "hidden",
    borderWidth: 1, borderColor: "#DBEAFE"
  },
  map: {
    width: '100%',
    height: '100%',
  },

  // Time Options
  horizontalScroll: { flexDirection: "row", marginBottom: 20, marginHorizontal: -16, paddingHorizontal: 16 },
  timeOption: {
    width: 150,
    backgroundColor: "#fff",
    padding: 12, borderRadius: 12,
    marginRight: 12,
    borderWidth: 1, borderColor: "#E5E7EB",
    flexDirection: "row", alignItems: "center"
  },
  timeOptionActive: { backgroundColor: "#34A853", borderColor: "#34A853" },
  timeTitle: { fontWeight: "700", fontSize: 14, color: "#111" },
  timeSubtitle: { fontSize: 11, color: "#666", marginTop: 2 },
  radioSelected: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#000", position: 'absolute', top: 8, right: 8 },

  // Items
  itemRow: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
  itemImage: { width: 50, height: 50, borderRadius: 8, backgroundColor: "#F3F4F6" },
  itemName: { fontWeight: "600", color: "#111", fontSize: 14 },
  itemQty: { color: "#888", fontSize: 12, marginTop: 2 },
  itemPrice: { fontWeight: "700", fontSize: 14, color: "#111" },
  divider: { height: 1, backgroundColor: "#F3F4F6", marginVertical: 8 },

  // Payment
  cardIconBg: { width: 40, height: 28, backgroundColor: "#F3F4F6", borderRadius: 4, justifyContent: "center", alignItems: "center" },
  cardIconInner: { width: 24, height: 16, backgroundColor: "#1A1F71", borderRadius: 2 },

  // Costs
  costRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  costLabel: { color: "#666", fontSize: 14 },
  costValue: { color: "#111", fontSize: 14, fontWeight: "600" },
  totalLabel: { fontSize: 18, fontWeight: "700", color: "#111" },
  totalValue: { fontSize: 18, fontWeight: "800", color: "#111" },

  // Footer
  footer: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    backgroundColor: "#fff",
    padding: 16, paddingBottom: 32,
    borderTopWidth: 1, borderTopColor: "#F3F4F6",
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 10
  },
  payBtn: {
    backgroundColor: "#34A853", height: 56, borderRadius: 16,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20
  },
  payBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  priceTag: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8,
    flexDirection: "row", alignItems: "center", gap: 6
  },
  priceTagText: { color: "#000", fontWeight: "700", fontSize: 14 }
});

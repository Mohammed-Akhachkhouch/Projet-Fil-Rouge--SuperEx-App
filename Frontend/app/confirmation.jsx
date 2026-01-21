import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";

export default function Confirmation() {
  const router = useRouter();
  const { orderId, address, lat, lng } = useLocalSearchParams();

  const getDeliveryTime = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() + 45);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);
  const hasLocation = !isNaN(latitude) && !isNaN(longitude);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <Text style={styles.headerTitle}>Confirmation</Text>
        <TouchableOpacity onPress={() => router.replace("/(tabs)/home")}>
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.iconContainer}>
          <View style={styles.successRing}>
            <View style={styles.successCircle}>
              <Ionicons name="checkmark-sharp" size={40} color="#fff" />
            </View>
          </View>
        </View>

        <Text style={styles.title}>Order Placed Successfully!</Text>
        <Text style={styles.subtitle}>Your groceries are being packed with care.</Text>

        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.deliveryBadge}>
              <Ionicons name="time-outline" size={16} color="#34A853" style={{ marginRight: 4 }} />
              <Text style={styles.deliveryBadgeText}>ESTIMATED DELIVERY</Text>
            </View>
          </View>

          <Text style={styles.timeText}>{getDeliveryTime()} Today</Text>

          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <Ionicons name="location" size={18} color="#0EA5E9" style={{ marginRight: 6 }} />
                <Text style={styles.addrName}>Delivery Location</Text>
              </View>
              <Text style={styles.addrText} numberOfLines={3}>{address || "123 Green Street, New York"}</Text>

              <TouchableOpacity style={{ marginTop: 8 }}>
                <Text style={styles.editLink}>Edit Instructions</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.mapContainer}>
              {hasLocation ? (
                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                  }}
                  scrollEnabled={false}
                  zoomEnabled={false}
                  pitchEnabled={false}
                  rotateEnabled={false}
                >
                  <Marker coordinate={{ latitude, longitude }} />
                </MapView>
              ) : (
                <View style={[styles.map, { backgroundColor: '#E0F2FE', justifyContent: 'center', alignItems: 'center' }]}>
                  <Ionicons name="map" size={24} color="#0EA5E9" />
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={[styles.card, { marginTop: 16 }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={styles.sectionLabel}>ORDER NUMBER</Text>
            <Text style={styles.orderId}>#{orderId ? orderId.toString().slice(0, 8) : '----'}</Text>
          </View>

          <View style={styles.divider} />

          <View style={{ alignItems: 'center', paddingVertical: 12 }}>
            <Text style={{ color: '#999', fontSize: 13 }}>View Full Receipt</Text>
            <Ionicons name="chevron-down" size={16} color="#999" style={{ marginTop: 2 }} />
          </View>
        </View>

        <View style={{ height: 40 }} />

        <TouchableOpacity style={styles.trackBtn} onPress={() => router.push(`/order/${orderId}`)}>
          <Text style={styles.trackBtnText}>Track Order</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.homeBtn} onPress={() => router.replace("/(tabs)/home")}>
          <Text style={styles.homeBtnText}>Back to Home</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F9FC" },
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 20, paddingVertical: 16
  },
  headerTitle: { fontSize: 16, fontWeight: "600", color: "#111" },
  content: { padding: 20, paddingBottom: 40, alignItems: 'center' },

  iconContainer: { marginBottom: 24, marginTop: 10 },
  successRing: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: "#DCFCE7",
    justifyContent: "center", alignItems: "center",
    shadowColor: "#34A853", shadowOpacity: 0.2, shadowRadius: 20, elevation: 10
  },
  successCircle: {
    width: 70, height: 70, borderRadius: 35,
    backgroundColor: "#34A853",
    justifyContent: "center", alignItems: "center",
    shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, elevation: 5
  },

  title: { fontSize: 24, fontWeight: "800", color: "#111", textAlign: "center", marginBottom: 8 },
  subtitle: { fontSize: 14, color: "#666", textAlign: "center", marginBottom: 32, paddingHorizontal: 40, lineHeight: 20 },

  card: {
    width: '100%',
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 2
  },
  cardHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  deliveryBadge: { flexDirection: "row", alignItems: "center" },
  deliveryBadgeText: { color: "#34A853", fontWeight: "700", fontSize: 11, letterSpacing: 0.5 },
  timeText: { fontSize: 22, fontWeight: "800", color: "#111", marginBottom: 16 },

  progressBar: { height: 6, backgroundColor: "#F3F4F6", borderRadius: 3, marginBottom: 20, overflow: 'hidden' },
  progressFill: { width: '30%', height: '100%', backgroundColor: "#34A853", borderRadius: 3 },

  addressRow: { flexDirection: "row" },
  locationIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#F3F4F6", justifyContent: "center", alignItems: "center" },
  addrName: { fontWeight: "700", fontSize: 15, color: "#111", marginBottom: 2 },
  editLink: { fontSize: 12, color: "#34A853", fontWeight: "600" },
  addrText: { fontSize: 13, color: "#777", lineHeight: 18 },

  mapContainer: {
    width: 80, height: 80,
    borderRadius: 12,
    marginLeft: 10,
    overflow: "hidden",
    borderWidth: 1, borderColor: "#DBEAFE"
  },
  map: { width: '100%', height: '100%' },

  sectionLabel: { fontSize: 11, color: "#888", fontWeight: "700", letterSpacing: 0.5 },
  orderId: { fontSize: 14, fontWeight: "700", color: "#34A853", backgroundColor: "#DCFCE7", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  divider: { height: 1, backgroundColor: "#F3F4F6", marginVertical: 8 },

  trackBtn: {
    width: '100%', height: 56, borderRadius: 16,
    backgroundColor: "#34A853",
    flexDirection: "row", justifyContent: "center", alignItems: "center",
    marginBottom: 16,
    shadowColor: "#34A853", shadowOpacity: 0.25, shadowRadius: 10, elevation: 4
  },
  trackBtnText: { color: "#fff", fontSize: 16, fontWeight: "700", marginRight: 8 },

  homeBtn: { paddingVertical: 12 },
  homeBtnText: { color: "#111", fontWeight: "700", fontSize: 15 }
});

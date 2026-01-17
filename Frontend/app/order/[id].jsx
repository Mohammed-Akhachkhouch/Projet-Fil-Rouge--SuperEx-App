import { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Linking, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const STEPS = [
  { key: 'placed', title: 'Order placed', subtitle: 'We received your order' },
  { key: 'confirmed', title: 'Confirmed', subtitle: 'We are preparing your items' },
  { key: 'on_the_way', title: 'On the way', subtitle: 'Driver is heading to you' },
  { key: 'delivered', title: 'Delivered', subtitle: 'Enjoy your groceries!' },
];

const CURRENT_STEP_INDEX = 2;

export default function TrackOrder() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [userLoc, setUserLoc] = useState(null);
  const [loadingLoc, setLoadingLoc] = useState(true);
  const [locError, setLocError] = useState('');

 
  const drivers = useMemo(() => {
    if (!userLoc) return [];
    const { latitude, longitude } = userLoc;

    return [
      {
        id: 'd1',
        name: 'Youssef',
        phone: '+212600000001',
        coord: { latitude: latitude + 0.004, longitude: longitude + 0.003 },
      },
      {
        id: 'd2',
        name: 'Sara',
        phone: '+212600000002',
        coord: { latitude: latitude - 0.003, longitude: longitude + 0.002 },
      },
      {
        id: 'd3',
        name: 'Hamza',
        phone: '+212600000003',
        coord: { latitude: latitude + 0.002, longitude: longitude - 0.004 },
      },
    ];
  }, [userLoc]);

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

        setUserLoc({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });

        setLoadingLoc(false);
      } catch (e) {
        setLocError('Failed to get location');
        setLoadingLoc(false);
      }
    })();
  }, []);

  const region = useMemo(() => {
    if (!userLoc) return null;
    return {
      latitude: userLoc.latitude,
      longitude: userLoc.longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    };
  }, [userLoc]);

  const callDriver = async (phone) => {
   
    const url = `tel:${phone}`;
    const can = await Linking.canOpenURL(url);
    if (can) Linking.openURL(url);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Track Order</Text>
      </View>

     
      <View style={styles.mapBox}>
        {loadingLoc ? (
          <View style={styles.mapLoading}>
            <ActivityIndicator />
            <Text style={styles.muted}>Loading map…</Text>
          </View>
        ) : locError ? (
          <View style={styles.mapLoading}>
            <Text style={styles.error}>{locError}</Text>
            <Text style={styles.muted}>Enable location to see drivers on the map.</Text>
          </View>
        ) : (
          <MapView style={styles.map} initialRegion={region} showsUserLocation>
            
            {userLoc && (
              <Marker coordinate={userLoc} title="You">
                <View style={styles.userPin}>
                  <Ionicons name="person" size={14} color="#0d1b12" />
                </View>
              </Marker>
            )}

       
            {drivers.map((d) => (
              <Marker key={d.id} coordinate={d.coord} title={d.name} description="Available driver">
                <View style={styles.driverPin}>
                  <Ionicons name="bicycle" size={14} color="#fff" />
                </View>
              </Marker>
            ))}
          </MapView>
        )}
      </View>

    
      <View style={styles.card}>
        <Text style={styles.orderId}>Order ID</Text>
        <Text style={styles.orderIdValue}>{String(id || '—')}</Text>

        <View style={styles.badge}>
          <Ionicons name="time-outline" size={16} color="#0d1b12" />
          <Text style={styles.badgeText}>Estimated: 20-35 min</Text>
        </View>
      </View>

      
      <Text style={styles.sectionTitle}>Available Drivers</Text>

      {drivers.length === 0 ? (
        <Text style={styles.muted}>No drivers to show.</Text>
      ) : (
        <FlatList
          data={drivers}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 10 }}
          renderItem={({ item }) => (
            <View style={styles.driverRow}>
              <View>
                <Text style={styles.driverName}>{item.name}</Text>
                <Text style={styles.driverPhone}>{item.phone}</Text>
              </View>

              <TouchableOpacity style={styles.callBtn} onPress={() => callDriver(item.phone)}>
                <Ionicons name="call" size={18} color="#0d1b12" />
                <Text style={styles.callText}>Call</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

    
      <Text style={[styles.sectionTitle, { marginTop: 8 }]}>Status</Text>

      <FlatList
        data={STEPS}
        keyExtractor={(item) => item.key}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item, index }) => {
          const done = index <= CURRENT_STEP_INDEX;
          const isCurrent = index === CURRENT_STEP_INDEX;

          return (
            <View style={styles.stepRow}>
              <View style={styles.left}>
                <View style={[styles.dot, done && styles.dotDone, isCurrent && styles.dotCurrent]}>
                  {done ? <Ionicons name="checkmark" size={14} color="#0d1b12" /> : null}
                </View>
                {index < STEPS.length - 1 ? (
                  <View style={[styles.line, done && styles.lineDone]} />
                ) : null}
              </View>

              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>{item.title}</Text>
                <Text style={styles.stepSubtitle}>{item.subtitle}</Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  back: { fontWeight: '900', color: '#111' },
  title: { fontSize: 22, fontWeight: '900', color: '#111' },

  mapBox: {
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEF2F6',
    backgroundColor: '#F9FAFB',
    marginBottom: 12,
  },
  map: { flex: 1 },
  mapLoading: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  muted: { marginTop: 8, color: '#6B7280', fontWeight: '600', textAlign: 'center' },
  error: { color: '#E11D48', fontWeight: '900', textAlign: 'center' },

  userPin: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#13ec5b',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  driverPin: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#34A853',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },

  card: {
    borderWidth: 1,
    borderColor: '#EEF2F6',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
  },
  orderId: { color: '#6B7280', fontWeight: '800' },
  orderIdValue: { marginTop: 4, fontSize: 18, fontWeight: '900', color: '#111' },
  badge: {
    marginTop: 10,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EAF7EE',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  badgeText: { fontWeight: '800', color: '#0d1b12' },

  sectionTitle: { fontSize: 16, fontWeight: '900', color: '#111', marginBottom: 10 },

  driverRow: {
    borderWidth: 1,
    borderColor: '#EEF2F6',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  driverName: { fontSize: 15, fontWeight: '900', color: '#111' },
  driverPhone: { marginTop: 4, color: '#6B7280', fontWeight: '700' },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#13ec5b',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
  },
  callText: { fontWeight: '900', color: '#0d1b12' },

  stepRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14 },
  left: { width: 34, alignItems: 'center' },
  dot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  dotDone: { borderColor: '#13ec5b', backgroundColor: '#13ec5b' },
  dotCurrent: { borderColor: '#34A853', backgroundColor: '#34A853' },
  line: { width: 2, flex: 1, backgroundColor: '#E5E7EB', marginTop: 4 },
  lineDone: { backgroundColor: '#34A853' },

  stepContent: { flex: 1, paddingLeft: 10 },
  stepTitle: { fontSize: 15, fontWeight: '900', color: '#111' },
  stepSubtitle: { marginTop: 4, color: '#6B7280', fontWeight: '600' },
});

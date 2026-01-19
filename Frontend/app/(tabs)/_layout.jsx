import { Tabs, useRouter } from "expo-router";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../store/authStore.js";

export default function TabsLayout() {
  const router = useRouter();

  // ✅ نجيبو user من الستور ونحددو isSeller
  const user = useAuthStore((s) => s.user);
  const isSeller = user?.role === "seller";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#34A853",
        tabBarInactiveTintColor: "#9AA0A6",
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
        },
      }}
    >
      {/* ✅ Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />

      {/* ✅ Search */}
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" color={color} size={size} />
          ),
        }}
      />

      {/* ✅ Cart (وسط) */}
      <Tabs.Screen
        name="cart"
        options={{
          title: "",
          tabBarButton: () => (
            <View style={styles.cartWrapper}>
              <TouchableOpacity
                style={styles.cartButton}
                activeOpacity={0.85}
                onPress={() => router.push("/(tabs)/cart")} // ✅ مهم داخل tabs
              >
                <Ionicons name="cart" size={26} color="#fff" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      {/* ✅ Orders */}
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt" color={color} size={size} />
          ),
        }}
      />

      {/* ✅ Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />

      {/* ✅ Seller: يبان غير إلا كان seller */}
      <Tabs.Screen
        name="seller"
        options={{
          title: "Seller",
          href: isSeller ? "/(tabs)/seller" : null, // ✅ hide if not seller
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="storefront-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  cartWrapper: {
    position: "absolute",
    bottom: 18,
    alignSelf: "center",
  },
  cartButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#34A853",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
  },
});

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../store/authStore";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function Profile() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!user) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#34A853" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.replace("/");
    } catch (error) {
      console.log("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      {/* Profile Header */}
      <View style={styles.headerCard}>
        <View style={styles.avatar}>
          <Ionicons name="person-circle" size={80} color="#34A853" />
        </View>
        <Text style={styles.nameText}>{user.name || user.username || "User"}</Text>
        <Text style={styles.emailText}>{user.email || "No email"}</Text>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Ionicons name="shield-checkmark" size={16} color="#34A853" />
            <Text style={styles.badgeText}>{user.role || "customer"}</Text>
          </View>
        </View>
      </View>

      {/* Profile Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Information</Text>

        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Ionicons name="person-outline" size={20} color="#64748b" />
              <Text style={styles.infoLabel}>Full Name</Text>
            </View>
            <Text style={styles.infoValue}>{user.name || user.username || "—"}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Ionicons name="mail-outline" size={20} color="#64748b" />
              <Text style={styles.infoLabel}>Email</Text>
            </View>
            <Text style={styles.infoValue}>{user.email || "—"}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Ionicons name="phone-portrait-outline" size={20} color="#64748b" />
              <Text style={styles.infoLabel}>Phone</Text>
            </View>
            <Text style={styles.infoValue}>{user.phone || "—"}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Ionicons name="location-outline" size={20} color="#64748b" />
              <Text style={styles.infoLabel}>Address</Text>
            </View>
            <Text style={styles.infoValue}>{user.address || "—"}</Text>
          </View>

          {user.role === "seller" && (
            <>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <View style={styles.infoLeft}>
                  <Ionicons name="storefront-outline" size={20} color="#64748b" />
                  <Text style={styles.infoLabel}>Store Name</Text>
                </View>
                <Text style={styles.infoValue}>{user.storeName || "—"}</Text>
              </View>
            </>
          )}
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={handleLogout}
        disabled={isLoggingOut}
        activeOpacity={0.85}
      >
        {isLoggingOut ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons name="log-out-outline" size={20} color="#fff" />
            <Text style={styles.logoutText}>Logout</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 20, paddingBottom: 40 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  loadingText: { marginTop: 12, color: "#6B7280", fontWeight: "600" },

  headerCard: {
    alignItems: "center",
    paddingVertical: 28,
    borderWidth: 1,
    borderColor: "#EEF2F6",
    borderRadius: 16,
    marginBottom: 24,
    backgroundColor: "#f8fafc",
  },

  avatar: { marginBottom: 16 },

  nameText: {
    fontSize: 22,
    fontWeight: "900",
    color: "#111",
    marginBottom: 4,
  },

  emailText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "600",
    marginBottom: 12,
  },

  badgeRow: {
    flexDirection: "row",
    gap: 8,
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#D1FAE5",
    borderRadius: 8,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#059669",
    textTransform: "capitalize",
  },

  section: { marginBottom: 28 },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#111",
    marginBottom: 12,
  },

  infoBox: {
    borderWidth: 1,
    borderColor: "#EEF2F6",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 14,
  },

  infoLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },

  infoLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#64748b",
  },

  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
    textAlign: "right",
    flex: 1,
  },

  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
  },

  logoutBtn: {
    height: 50,
    borderRadius: 12,
    backgroundColor: "#E11D48",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
    shadowColor: "#E11D48",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
  },
});

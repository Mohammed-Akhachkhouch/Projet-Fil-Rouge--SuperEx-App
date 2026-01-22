import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Modal, TextInput, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../store/authStore";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSellerProfile } from "../../hooks/useSellerQueries";
import { updateSellerProfile } from "../../services/sellerService";

export default function SellerProfile() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const logout = useAuthStore((s) => s.logout);

  const { data: sellerData, isLoading } = useSellerProfile();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);

  // Form state
  const [storeName, setStoreName] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  const [storePhone, setStorePhone] = useState("");

  useEffect(() => {
    if (sellerData) {
      setStoreName(sellerData.storeName || "");
      setStoreAddress(sellerData.storeAddress || "");
      setStorePhone(sellerData.storePhone || "");
    }
  }, [sellerData]);

  const updateMutation = useMutation({
    mutationFn: updateSellerProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-profile"] });
      setEditModalVisible(false);
      Alert.alert("Success", "Store profile updated successfully");
    },
    onError: (error) => {
      Alert.alert("Error", error.response?.data?.message || "Failed to update profile");
    },
  });

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

  const handleSave = () => {
    updateMutation.mutate({
      storeName,
      storeAddress,
      storePhone,
    });
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#34A853" />
      </View>
    );
  }

  const user = sellerData || {};

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <View style={styles.headerCard}>
        <View style={styles.avatar}>
          <Ionicons name="storefront" size={80} color="#34A853" />
        </View>
        <Text style={styles.storeName}>{user.storeName || "My Store"}</Text>
        <Text style={styles.ownerName}>Owner: {user.username || "Seller"}</Text>

        <TouchableOpacity style={styles.editBtn} onPress={() => setEditModalVisible(true)}>
          <Ionicons name="create-outline" size={20} color="#fff" />
          <Text style={styles.editBtnText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Store Details</Text>

        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Ionicons name="storefront-outline" size={20} color="#64748b" />
              <Text style={styles.infoLabel}>Store Name</Text>
            </View>
            <Text style={styles.infoValue}>{user.storeName || "—"}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Ionicons name="location-outline" size={20} color="#64748b" />
              <Text style={styles.infoLabel}>Store Address</Text>
            </View>
            <Text style={styles.infoValue}>{user.storeAddress || "—"}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Ionicons name="call-outline" size={20} color="#64748b" />
              <Text style={styles.infoLabel}>Store Phone</Text>
            </View>
            <Text style={styles.infoValue}>{user.storePhone || "—"}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Information</Text>

        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Ionicons name="person-outline" size={20} color="#64748b" />
              <Text style={styles.infoLabel}>Username</Text>
            </View>
            <Text style={styles.infoValue}>{user.username || "—"}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Ionicons name="mail-outline" size={20} color="#64748b" />
              <Text style={styles.infoLabel}>Email</Text>
            </View>
            <Text style={styles.infoValue}>{user.email || "—"}</Text>
          </View>
        </View>
      </View>

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

      {/* Edit Modal */}
      <Modal
        visible={isEditModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Store Profile</Text>
              <Pressable onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={24} color="#111" />
              </Pressable>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Store Name</Text>
                <TextInput
                  style={styles.input}
                  value={storeName}
                  onChangeText={setStoreName}
                  placeholder="Enter store name"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Store Address</Text>
                <TextInput
                  style={styles.input}
                  value={storeAddress}
                  onChangeText={setStoreAddress}
                  placeholder="Enter store address"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Store Phone</Text>
                <TextInput
                  style={styles.input}
                  value={storePhone}
                  onChangeText={setStorePhone}
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                />
              </View>

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSave}
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveBtnText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 20, paddingBottom: 40 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },

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
  storeName: { fontSize: 22, fontWeight: "900", color: "#111", marginBottom: 4 },
  ownerName: { fontSize: 13, color: "#64748b", fontWeight: "600", marginBottom: 16 },

  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#34A853",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  editBtnText: { color: "#fff", fontWeight: "600", fontSize: 14 },

  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: "900", color: "#111", marginBottom: 12 },

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
  infoLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  infoLabel: { fontSize: 14, fontWeight: "700", color: "#64748b" },
  infoValue: { fontSize: 14, fontWeight: "600", color: "#111", textAlign: "right", flex: 1 },
  divider: { height: 1, backgroundColor: "#f1f5f9" },

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
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "900" },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: "900", color: "#111" },
  form: { gap: 16 },
  inputGroup: { gap: 8 },
  label: { fontSize: 14, fontWeight: "700", color: "#374151" },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    fontSize: 16,
    backgroundColor: "#F9FAFB",
  },
  saveBtn: {
    backgroundColor: "#34A853",
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  saveBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

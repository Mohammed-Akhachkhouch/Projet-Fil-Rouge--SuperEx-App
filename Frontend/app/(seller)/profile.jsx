import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from "react-native";
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { getSellerProfile, updateSellerProfile } from "../../services/sellerService";

export default function SellerProfile() {
  const qc = useQueryClient();
  const [storeName, setStoreName] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  const [storePhone, setStorePhone] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { data: profile, isLoading } = useQuery({
    queryKey: ["seller-profile"],
    queryFn: getSellerProfile,
  });

  const updateMutation = useMutation({
    mutationFn: updateSellerProfile,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["seller-profile"] });
      qc.invalidateQueries({ queryKey: ["seller-products"] });
      setSuccessMessage("✓ Store information updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    },
    onError: (error) => {
      Alert.alert("Error", error?.response?.data?.message || "Failed to update profile");
    },
  });

  useEffect(() => {
    if (profile) {
      setStoreName(profile.storeName || "");
      setStoreAddress(profile.storeAddress || "");
      setStorePhone(profile.storePhone || "");
    }
  }, [profile]);

  const handleSave = () => {
    if (!storeName.trim()) {
      Alert.alert("Error", "Please enter store name");
      return;
    }

    updateMutation.mutate({
      storeName: storeName.trim(),
      storeAddress: storeAddress.trim(),
      storePhone: storePhone.trim(),
    });
  };

  if (isLoading) {
    return (
      <View style={[styles.screen, styles.center]}>
        <ActivityIndicator size="large" color="#34A853" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.h1}>Store Profile</Text>
      <Text style={styles.sub}>Update your store information</Text>

      {successMessage && (
        <View style={styles.successBox}>
          <Text style={styles.successText}>{successMessage}</Text>
        </View>
      )}

      <View style={styles.block}>
        {/* Store Name */}
        <View style={styles.field}>
          <Text style={styles.label}>Store Name</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="storefront" size={18} color="#64748b" />
            <TextInput
              style={styles.input}
              placeholder="SuperMarket Express"
              value={storeName}
              onChangeText={setStoreName}
              placeholderTextColor="#cbd5e1"
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Store Address</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="location" size={18} color="#64748b" />
            <TextInput
              style={styles.input}
              placeholder="742 Evergreen Terrace"
              value={storeAddress}
              onChangeText={setStoreAddress}
              placeholderTextColor="#cbd5e1"
              multiline
              numberOfLines={2}
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Store Phone (Optional)</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="call" size={18} color="#64748b" />
            <TextInput
              style={styles.input}
              placeholder="+1 (555) 123-4567"
              value={storePhone}
              onChangeText={setStorePhone}
              placeholderTextColor="#cbd5e1"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <TouchableOpacity 
          style={styles.saveBtn}
          onPress={handleSave}
          disabled={updateMutation.isPending}
          activeOpacity={0.9}
        >
          {updateMutation.isPending ? (
            <ActivityIndicator color="#0d1b12" />
          ) : (
            <View style={styles.buttonContent}>
              <Ionicons name="checkmark" size={20} color="#0d1b12" />
              <Text style={styles.saveText}>Save Store Information</Text>
            </View>
          )}
        </TouchableOpacity>

        {updateMutation.isError && (
          <Text style={styles.error}>
            {updateMutation.error?.response?.data?.message || "Error saving profile"}
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff", padding: 16 },
  center: { justifyContent: "center", alignItems: "center" },
  h1: { fontSize: 22, fontWeight: "900", color: "#111" },
  sub: { marginTop: 4, color: "#6B7280", fontWeight: "600", marginBottom: 16 },

  successBox: {
    backgroundColor: "#ecfdf5",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#34A853",
  },
  successText: {
    color: "#166534",
    fontWeight: "700",
    fontSize: 14,
  },

  block: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#f8fafc",
  },

  field: {
    marginBottom: 16,
  },

  label: { 
    marginBottom: 8,
    fontWeight: "700", 
    color: "#111",
    fontSize: 14,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 14,
    minHeight: 52,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: "#1a1a1a",
    paddingVertical: 12,
  },

  saveBtn: {
    marginTop: 24,
    height: 54,
    borderRadius: 14,
    backgroundColor: "#34A853",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    shadowColor: "#34A853",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },

  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  saveText: { 
    fontWeight: "900", 
    color: "#fff", 
    fontSize: 16,
  },

  error: {
    color: "#dc2626",
    marginTop: 12,
    fontWeight: "600",
    textAlign: "center",
    backgroundColor: "#fee2e2",
    padding: 12,
    borderRadius: 8,
  },
});

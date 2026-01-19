import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct } from "../../services/sellerService";

export default function InventoryScreen() {
  const qc = useQueryClient();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState("");

  const addMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["seller-products"] });
      setName("");
      setPrice("");
      setStock("");
      setCategoryId("");
      setImage("");
    },
  });

  const handleAdd = () => {
    addMutation.mutate({
      name,
      price,
      stock,
      categoryId,
      image, // image URL
    });
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Add New Product</Text>
      <Text style={styles.subtitle}>Fill product details</Text>

      {/* Name */}
      <View style={styles.field}>
        <Text style={styles.label}>Product Name</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="pricetag-outline" size={18} color="#64748b" />
          <TextInput
            style={styles.input}
            placeholder="Apple"
            value={name}
            onChangeText={setName}
          />
        </View>
      </View>

      {/* Price */}
      <View style={styles.field}>
        <Text style={styles.label}>Price (MAD)</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="cash-outline" size={18} color="#64748b" />
          <TextInput
            style={styles.input}
            placeholder="3.50"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />
        </View>
      </View>

      {/* Stock */}
      <View style={styles.field}>
        <Text style={styles.label}>Stock</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="cube-outline" size={18} color="#64748b" />
          <TextInput
            style={styles.input}
            placeholder="100"
            keyboardType="numeric"
            value={stock}
            onChangeText={setStock}
          />
        </View>
      </View>

      {/* Category ID */}
      <View style={styles.field}>
        <Text style={styles.label}>Category ID</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="grid-outline" size={18} color="#64748b" />
          <TextInput
            style={styles.input}
            placeholder="1"
            keyboardType="numeric"
            value={categoryId}
            onChangeText={setCategoryId}
          />
        </View>
      </View>

      {/* Image URL */}
      <View style={styles.field}>
        <Text style={styles.label}>Image URL</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="image-outline" size={18} color="#64748b" />
          <TextInput
            style={styles.input}
            placeholder="https://..."
            value={image}
            onChangeText={setImage}
          />
        </View>
      </View>

      {/* Submit */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleAdd}
        activeOpacity={0.9}
        disabled={addMutation.isPending}
      >
        {addMutation.isPending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Add Product</Text>
        )}
      </TouchableOpacity>

      {/* Error */}
      {addMutation.isError && (
        <Text style={styles.error}>
          {addMutation.error?.response?.data?.message ||
            addMutation.error.message}
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#0d1b12",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 20,
    fontWeight: "600",
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1a1a1a",
  },
  button: {
    backgroundColor: "#34A853",
    height: 56,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#34A853",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  error: {
    color: "red",
    marginTop: 12,
    fontWeight: "600",
    textAlign: "center",
  },
});

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { createProduct, getMyProducts } from "../../services/sellerService";
import { useCategories } from "../../hooks/useCategories";

export default function InventoryScreen() {
  const qc = useQueryClient();
  const { data: categories = [] } = useCategories();
  const { data: myProducts = [] } = useQuery({
    queryKey: ["seller-products"],
    queryFn: getMyProducts,
  });

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const addMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["seller-products"] });
      setName("");
      setPrice("");
      setStock("");
      setCategoryId("");
      setImage("");
      setDescription("");
      setSuccessMessage("✓ Product added successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    },
    onError: (error) => {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to add product"
      );
    },
  });

  const handleAdd = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Enter product name");
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      Alert.alert("Error", "Enter a valid price");
      return;
    }
    if (!categoryId) {
      Alert.alert("Error", "Select a category");
      return;
    }
    if (!stock || parseInt(stock) < 0) {
      Alert.alert("Error", "Enter a valid stock quantity");
      return;
    }

    addMutation.mutate({
      name: name.trim(),
      price: parseFloat(price),
      stock: parseInt(stock),
      categoryId: parseInt(categoryId),
      image: image.trim() || null,
      description: description.trim() || null,
    });
  };

  const selectedCategory = categories.find(
    (cat) => cat.id === parseInt(categoryId)
  );

  const renderCategoryItem = (category) => (
    <Pressable
      style={styles.categoryOption}
      onPress={() => {
        setCategoryId(category.id.toString());
        setShowCategoryModal(false);
      }}
    >
      <View
        style={[
          styles.categoryRadio,
          categoryId === category.id.toString() && styles.categoryRadioActive,
        ]}
      >
        {categoryId === category.id.toString() && (
          <Ionicons name="checkmark" size={14} color="#34A853" />
        )}
      </View>
      <Text style={styles.categoryOptionText}>{category.name}</Text>
    </Pressable>
  );

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Inventory Management</Text>
      <Text style={styles.subtitle}>Add new products</Text>

      {successMessage && (
        <View style={styles.successBox}>
          <Text style={styles.successText}>{successMessage}</Text>
        </View>
      )}

      <View style={styles.field}>
        <Text style={styles.label}>Product Name</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="pricetag-outline" size={18} color="#64748b" />
          <TextInput
            style={styles.input}
            placeholder="e.g., Red Apple"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#cbd5e1"
          />
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Price (MAD)</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="cash-outline" size={18} color="#64748b" />
          <TextInput
            style={styles.input}
            placeholder="3.50"
            keyboardType="decimal-pad"
            value={price}
            onChangeText={setPrice}
            placeholderTextColor="#cbd5e1"
          />
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Stock Quantity</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="cube-outline" size={18} color="#64748b" />
          <TextInput
            style={styles.input}
            placeholder="100"
            keyboardType="number-pad"
            value={stock}
            onChangeText={setStock}
            placeholderTextColor="#cbd5e1"
          />
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Category</Text>
        <TouchableOpacity
          style={styles.categoryButton}
          onPress={() => setShowCategoryModal(true)}
        >
          <Ionicons name="list-outline" size={18} color="#64748b" />
          <Text
            style={[
              styles.categoryButtonText,
              !categoryId && styles.placeholderText,
            ]}
          >
            {selectedCategory ? selectedCategory.name : "Select a category"}
          </Text>
          <Ionicons name="chevron-down" size={18} color="#64748b" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={showCategoryModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowCategoryModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <Pressable onPress={() => setShowCategoryModal(false)}>
                <Ionicons name="close" size={24} color="#1a1a1a" />
              </Pressable>
            </View>
            <FlatList
              data={categories}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => renderCategoryItem(item)}
              scrollEnabled={categories.length > 5}
            />
          </View>
        </Pressable>
      </Modal>

      <View style={styles.field}>
        <Text style={styles.label}>Description (Optional)</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="document-text-outline" size={18} color="#64748b" />
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Product description..."
            multiline
            numberOfLines={3}
            value={description}
            onChangeText={setDescription}
            placeholderTextColor="#cbd5e1"
          />
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Image URL (Optional)</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="image-outline" size={18} color="#64748b" />
          <TextInput
            style={styles.input}
            placeholder="https://..."
            value={image}
            onChangeText={setImage}
            placeholderTextColor="#cbd5e1"
          />
        </View>
      </View>

      {image && (
        <View style={styles.imagePreviewContainer}>
          <Text style={styles.previewLabel}>Image Preview:</Text>
          <Image
            source={{ uri: image }}
            style={styles.imagePreview}
            onError={() => {
              Alert.alert("Error", "Cannot load image from this URL");
            }}
          />
        </View>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={handleAdd}
        activeOpacity={0.9}
        disabled={addMutation.isPending}
      >
        {addMutation.isPending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <View style={styles.buttonContent}>
            <Ionicons name="add-circle" size={20} color="#fff" />
            <Text style={styles.buttonText}>Add Product</Text>
          </View>
        )}
      </TouchableOpacity>

      {addMutation.isError && (
        <Text style={styles.error}>
          {addMutation.error?.response?.data?.message ||
            addMutation.error.message}
        </Text>
      )}

      <View style={styles.productsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Products ({myProducts.length})</Text>
          <Ionicons name="checkmark-circle" size={24} color="#34A853" />
        </View>

        {myProducts.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="cube-outline" size={48} color="#cbd5e1" />
            <Text style={styles.emptyText}>No products added yet</Text>
          </View>
        ) : (
          <FlatList
            data={myProducts}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.productCard}>
                <View style={styles.productHeader}>
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.productCategory}>
                      {item.Category?.name || "No category"}
                    </Text>
                  </View>
                  {item.image && (
                    <Image
                      source={{ uri: item.image }}
                      style={styles.productThumbnail}
                    />
                  )}
                </View>
                <View style={styles.productDetails}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Price:</Text>
                    <Text style={styles.detailValue}>{item.price} MAD</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Stock:</Text>
                    <Text style={styles.detailValue}>{item.stock}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Status:</Text>
                    <Text
                      style={[
                        styles.detailValue,
                        item.isActive
                          ? styles.statusActive
                          : styles.statusInactive,
                      ]}
                    >
                      {item.isActive ? "Active" : "Inactive"}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
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
  placeholderText: {
    color: "#cbd5e1",
  },
  descriptionInput: {
    height: 100,
    paddingVertical: 12,
    textAlignVertical: "top",
  },
  categoryButton: {
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
  categoryButtonText: {
    flex: 1,
    fontSize: 16,
    color: "#1a1a1a",
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  categoryOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  categoryRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#cbd5e1",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryRadioActive: {
    borderColor: "#34A853",
    backgroundColor: "#f0f9ff",
  },
  categoryOptionText: {
    fontSize: 16,
    color: "#1a1a1a",
    fontWeight: "500",
  },
  imagePreviewContainer: {
    marginBottom: 16,
  },
  previewLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 8,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    backgroundColor: "#f1f5f9",
  },
  button: {
    backgroundColor: "#34A853",
    height: 56,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    shadowColor: "#34A853",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0.5,
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
  productsSection: {
    marginTop: 32,
    marginBottom: 40,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0d1b12",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: "#cbd5e1",
    marginTop: 12,
    fontWeight: "500",
  },
  productCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  productHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  productCategory: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
  },
  productThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#e2e8f0",
    marginLeft: 8,
  },
  productDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  detailItem: {
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "600",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1a1a1a",
    marginTop: 2,
  },
  statusActive: {
    color: "#34A853",
  },
  statusInactive: {
    color: "#ef4444",
  },
});

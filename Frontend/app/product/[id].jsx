import { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { fetchProductById } from '../../services/productsService.js';
import { useCartStore } from '../../store/cartStore.js';

export default function ProductDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const addToCart = useCartStore((s) => s.addToCart);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id),
    enabled: !!id,
  });

  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#34A853" />
      </View>
    );
  }

  if (isError || !product) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Product not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.link}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const inc = () => setQuantity((q) => q + 1);
  const dec = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleAdd = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      seller: product.seller?.username || "Unknown",
    }, quantity);
    router.back();
  };

  const sellerName = product?.seller?.storeName || product?.seller?.username || "Unknown Store";
  const storeAddress = product?.seller?.storeAddress || "";
  const storePhone = product?.seller?.storePhone || "";
  const categoryName = product?.Category?.name || "Unknown Category";

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 30 }}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Image 
        source={product?.image && typeof product.image === "string" && product.image.startsWith("http")
          ? { uri: product.image }
          : require('../../assets/images/Vegetables.png')
        } 
        style={styles.image} 
      />

      <View style={styles.content}>
        <Text style={styles.name}>{product.name}</Text>
        
        <View style={styles.storeInfo}>
          <Ionicons name="storefront" size={16} color="#34A853" />
          <View style={styles.storeDetails}>
            <Text style={styles.storeName}>{sellerName}</Text>
            {storeAddress && <Text style={styles.storeAddress}>{storeAddress}</Text>}
            {storePhone && <Text style={styles.storePhone}>{storePhone}</Text>}
          </View>
        </View>
        
        <View style={styles.categoryBadge}>
          <Ionicons name="pricetag" size={14} color="#fff" />
          <Text style={styles.categoryText}>{categoryName}</Text>
        </View>

        {product.description && (
          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionLabel}>Description:</Text>
            <Text style={styles.desc}>{product.description}</Text>
          </View>
        )}

        <View style={styles.row}>
          <View>
            <Text style={styles.priceLabel}>Price</Text>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            {product.qtyLabel && (
              <Text style={styles.qtyLabel}>per {product.qtyLabel}</Text>
            )}
          </View>

          <View style={styles.qtyBox}>
            <TouchableOpacity style={styles.qtyBtn} onPress={dec}>
              <Text style={styles.qtyBtnText}>-</Text>
            </TouchableOpacity>

            <Text style={styles.qtyValue}>{quantity}</Text>

            <TouchableOpacity style={styles.qtyBtn} onPress={inc}>
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.stockInfo}>
          <Ionicons name="cube" size={16} color={product.stock > 0 ? "#34A853" : "#ef4444"} />
          <Text style={[styles.stockText, product.stock > 0 ? styles.inStock : styles.outOfStock]}>
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </Text>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <Ionicons name="checkmark-circle" size={20} color="#34A853" />
            <Text style={styles.infoText}>Available</Text>
          </View>
          <View style={styles.infoCard}>
            <Ionicons name="shield-checkmark" size={20} color="#34A853" />
            <Text style={styles.infoText}>Quality</Text>
          </View>
          <View style={styles.infoCard}>
            <Ionicons name="time" size={20} color="#34A853" />
            <Text style={styles.infoText}>Fresh</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.addBtn, product.stock === 0 && styles.addBtnDisabled]} 
          onPress={handleAdd}
          disabled={product.stock === 0}
          activeOpacity={0.9}
        >
          <Text style={styles.addBtnText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  screen: { flex: 1, backgroundColor: '#fff' },
  backBtn: { padding: 20, paddingBottom: 10 },
  backText: { fontSize: 16, fontWeight: '700', color: '#111' },
  title: { fontSize: 18, fontWeight: '700', color: '#111', marginBottom: 12 },
  link: { fontSize: 14, color: '#34A853', fontWeight: '600' },

  image: {
    width: '100%',
    height: 280,
    resizeMode: 'cover',
  },

  content: { padding: 20 },
  name: { fontSize: 24, fontWeight: '800', color: '#111' },
  
  storeInfo: { 
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    gap: 10, 
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
  },
  storeDetails: {
    flex: 1,
  },
  storeName: { 
    fontSize: 15, 
    fontWeight: '700', 
    color: '#34A853',
  },
  storeAddress: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  storePhone: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },

  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#34A853',
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },

  descriptionBox: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f9fafb',
    borderLeftWidth: 3,
    borderLeftColor: '#34A853',
    borderRadius: 8,
  },
  descriptionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#34A853',
    marginBottom: 6,
  },
  desc: { 
    color: '#444', 
    lineHeight: 20,
    fontSize: 14,
  },

  row: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  priceLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 4,
  },
  price: { fontSize: 24, fontWeight: '900', color: '#111' },
  qtyLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },

  qtyBox: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    overflow: 'hidden',
  },
  qtyBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  qtyBtnText: { fontSize: 18, fontWeight: '700', color: '#111' },
  qtyValue: { width: 44, textAlign: 'center', fontSize: 16, fontWeight: '700' },

  stockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    padding: 10,
    backgroundColor: '#fafafa',
    borderRadius: 8,
  },
  stockText: { fontSize: 14, fontWeight: '600' },
  inStock: { color: '#34A853' },
  outOfStock: { color: '#ef4444' },

  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  infoCard: {
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111',
  },

  addBtn: {
    backgroundColor: '#34A853',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#34A853',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  addBtnDisabled: {
    backgroundColor: '#cbd5e1',
    shadowOpacity: 0,
  },
  addBtnText: { fontSize: 16, fontWeight: '800', color: '#fff' },
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchProductById } from '../../services/productsService.js';
import { useCartStore } from '../../store/cartStore.js';

const { width } = Dimensions.get('window');

export default function ProductDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const addToCart = useCartStore((s) => s.addToCart);

  const cartItems = useCartStore((s) => s.items);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id),
    enabled: !!id,
  });

  const [quantity, setQuantity] = useState(1);
  const [expandedSection, setExpandedSection] = useState(null); // 'nutrition' or 'origin'

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

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const stockLabel = product.stock > 0 && product.stock < 10 ? `Only ${product.stock} left` : null;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.headerSafe} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
            <Ionicons name="chevron-back" size={24} color="#111" />
          </TouchableOpacity>
          <View style={styles.rightIcons}>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="heart-outline" size={24} color="#111" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/(tabs)/cart')}>
              <Ionicons name="cart-outline" size={24} color="#111" />
              {cartItems.length > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartItems.length}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.imageContainer}>
          <Image
            source={product?.image && typeof product.image === "string" && product.image.startsWith("http")
              ? { uri: product.image }
              : require('../../assets/images/Vegetables.png')
            }
            style={styles.image}
          />
          <View style={styles.dotsContainer}>
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>

        <View style={styles.sheet}>
          <View style={styles.titleRow}>
            <Text style={styles.name}>{product.name}</Text>
            {stockLabel && (
              <View style={styles.stockBadge}>
                <Ionicons name="alert-circle-outline" size={12} color="#B45309" />
                <Text style={styles.stockBadgeText}>{stockLabel}</Text>
              </View>
            )}
          </View>

          <Text style={styles.subtext}>
            {product.qtyLabel || '1kg Bunch'} • Sourced locally
          </Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            <Text style={styles.oldPrice}>${(product.price * 1.2).toFixed(2)}</Text>
            <View style={styles.saveBadge}>
              <Text style={styles.saveText}>SAVE 20%</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.desc}>
              {product.description || "Fresh and organic produce sourced directly from local farmers. Perfect for your daily nutritional needs."}
            </Text>
          </View>

          <View style={styles.accordionContainer}>
            <TouchableOpacity style={styles.accordionHeader} onPress={() => toggleSection('nutrition')}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.accordionIcon}>
                  <Ionicons name="color-filter-outline" size={18} color="#0EA5E9" />
                </View>
                <Text style={styles.accordionTitle}>Nutrition Facts</Text>
              </View>
              <Ionicons name={expandedSection === 'nutrition' ? "chevron-up" : "chevron-down"} size={20} color="#666" />
            </TouchableOpacity>
            {expandedSection === 'nutrition' && (
              <View style={styles.accordionContent}>
                <Text style={styles.accordionText}>Calories: 89 • Protein: 1.1g • Carbs: 22.8g</Text>
              </View>
            )}

            <TouchableOpacity style={styles.accordionHeader} onPress={() => toggleSection('origin')}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={[styles.accordionIcon, { backgroundColor: '#DCFCE7' }]}>
                  <Ionicons name="leaf-outline" size={18} color="#16A34A" />
                </View>
                <Text style={styles.accordionTitle}>Origin & Storage</Text>
              </View>
              <Ionicons name={expandedSection === 'origin' ? "chevron-up" : "chevron-down"} size={20} color="#666" />
            </TouchableOpacity>
            {expandedSection === 'origin' && (
              <View style={styles.accordionContent}>
                <Text style={styles.accordionText}>Country of Origin: USA • Store in a cool, dry place.</Text>
              </View>
            )}
          </View>



        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.qtyControl}>
          <TouchableOpacity onPress={dec} style={styles.qtyBtn}>
            <Ionicons name="remove" size={20} color="#111" />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{quantity}</Text>
          <TouchableOpacity onPress={inc} style={styles.qtyBtn}>
            <Ionicons name="add" size={20} color="#34A853" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.addBtn, product.stock === 0 && styles.disabledBtn]}
          onPress={handleAdd}
          disabled={product.stock === 0}
        >
          <Ionicons name="cart" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.addBtnText}>
            {product.stock === 0 ? "Out of Stock" : `Add to Cart - $${(product.price * quantity).toFixed(2)}`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },

  headerSafe: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10
  },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center', alignItems: 'center', marginLeft: 10,
    shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, elevation: 3
  },
  rightIcons: { flexDirection: 'row' },
  badge: { position: 'absolute', top: -2, right: -2, backgroundColor: '#EF4444', borderRadius: 10, width: 18, height: 18, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },

  imageContainer: {
    height: 380, width: width, backgroundColor: '#FDFBF7', // Light beige bg like reference
    justifyContent: 'center', alignItems: 'center',
    paddingTop: 60
  },
  image: { width: 280, height: 280, resizeMode: 'contain' },
  dotsContainer: { flexDirection: 'row', position: 'absolute', bottom: 30 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#D1D5DB', marginHorizontal: 4 },
  activeDot: { backgroundColor: '#34A853' },

  sheet: {
    backgroundColor: '#fff',
    marginTop: -20,
    borderTopLeftRadius: 32, borderTopRightRadius: 32,
    padding: 24,
    minHeight: 500,
  },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  name: { fontSize: 26, fontWeight: '800', color: '#111', flex: 1, marginRight: 10 },
  stockBadge: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF3C7',
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8
  },
  stockBadgeText: { color: '#B45309', fontSize: 11, fontWeight: '700', marginLeft: 4 },

  subtext: { color: '#34A853', fontWeight: '600', fontSize: 13, marginTop: 4 },

  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 16, marginBottom: 24 },
  price: { fontSize: 28, fontWeight: '900', color: '#34A853' },
  oldPrice: { fontSize: 16, textDecorationLine: 'line-through', color: '#9CA3AF', marginLeft: 12 },
  saveBadge: { backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginLeft: 12 },
  saveText: { color: '#16A34A', fontSize: 11, fontWeight: '800' },

  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#111', marginBottom: 8 },
  desc: { color: '#6B7280', fontSize: 14, lineHeight: 22 },

  // Accordion
  accordionContainer: { marginTop: 0, marginBottom: 24 },
  accordionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6'
  },
  accordionIcon: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: '#E0F2FE',
    justifyContent: 'center', alignItems: 'center', marginRight: 12
  },
  accordionTitle: { fontSize: 15, fontWeight: '600', color: '#111' },
  accordionContent: { paddingVertical: 12, paddingHorizontal: 44 },
  accordionText: { color: '#666', fontSize: 13 },

  // Suggested
  viewAll: { color: '#34A853', fontWeight: '700', fontSize: 13 },
  suggestedCard: { width: 140, marginRight: 16, backgroundColor: '#fff', borderRadius: 16 },
  suggestedImgContainer: {
    width: '100%', height: 100, backgroundColor: '#F9FAFB', borderRadius: 16,
    justifyContent: 'center', alignItems: 'center', marginBottom: 8
  },
  suggestedName: { fontSize: 14, fontWeight: '700', color: '#111' },
  suggestedWeight: { fontSize: 11, color: '#999', marginTop: 2 },
  suggestedPrice: { fontSize: 14, fontWeight: '800', color: '#111', marginTop: 4 },
  suggestedAdd: {
    position: 'absolute', bottom: 0, right: 0,
    width: 28, height: 28, borderRadius: 8, backgroundColor: '#F3F4F6',
    justifyContent: 'center', alignItems: 'center'
  },

  // Footer
  footer: {
    position: 'absolute', bottom: 0, left: 0, width: width,
    backgroundColor: '#fff',
    padding: 20, paddingBottom: 30,
    flexDirection: 'row', alignItems: 'center', gap: 16,
    borderTopWidth: 1, borderTopColor: '#F3F4F6',
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 10
  },
  qtyControl: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#F9FAFB', borderRadius: 12, padding: 4, width: 120, height: 50,
    borderWidth: 1, borderColor: '#E5E7EB'
  },
  qtyBtn: { width: 40, height: '100%', justifyContent: 'center', alignItems: 'center' },
  qtyText: { fontSize: 18, fontWeight: '700', color: '#111' },

  addBtn: {
    flex: 1, height: 50, backgroundColor: '#34A853', borderRadius: 12,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    shadowColor: "#34A853", shadowOpacity: 0.25, shadowRadius: 8, elevation: 4
  },
  disabledBtn: { backgroundColor: '#9CA3AF', shadowOpacity: 0 },
  addBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});

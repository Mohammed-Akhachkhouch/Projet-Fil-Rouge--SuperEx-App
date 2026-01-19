import { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { PRODUCTS } from '../../data/products.js';
import { useCartStore } from '../../store/cartStore.js';

export default function ProductDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const addToCart = useCartStore((s) => s.addToCart);

  const product = useMemo(
    () => PRODUCTS.find((p) => p.id === String(id)),
    [id]
  );

  const [quantity, setQuantity] = useState(1);

  if (!product) {
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
    addToCart(product, quantity);
    router.back();
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 30 }}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Image source={product.image} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.meta}>{product.qtyLabel} • {product.category}</Text>

        <Text style={styles.desc}>{product.description}</Text>

        <View style={styles.row}>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>

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

        <TouchableOpacity style={styles.addBtn} onPress={handleAdd} activeOpacity={0.9}>
          <Text style={styles.addBtnText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  backBtn: { padding: 20, paddingBottom: 10 },
  backText: { fontSize: 16, fontWeight: '700', color: '#111' },

  image: {
    width: '100%',
    height: 280,
    resizeMode: 'cover',
  },

  content: { padding: 20 },
  name: { fontSize: 24, fontWeight: '800', color: '#111' },
  meta: { marginTop: 6, color: '#6B7280', fontWeight: '600' },
  desc: { marginTop: 14, color: '#444', lineHeight: 20 },

  row: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  price: { fontSize: 22, fontWeight: '900', color: '#111' },

  qtyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  qtyBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnText: { fontSize: 18, fontWeight: '900' },
  qtyValue: { width: 30, textAlign: 'center', fontWeight: '800', fontSize: 16 },

  addBtn: {
    marginTop: 18,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#34A853',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },

  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '800' },
  link: { marginTop: 10, color: '#34A853', fontWeight: '700' },
});

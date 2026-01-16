import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';

import SearchBar from '../component/SearchBar';
import ProductCard from '../component/ProductCard';

const ALL_PRODUCTS = [
  { id: 'p1', name: 'Organic Bananas', qty: '1 bunch', price: '1.29', category: 'Fruits & Veg', image: require('../../assets/images/Vegetables.png') },
  { id: 'p2', name: 'Whole Milk', qty: '1 Gallon', price: '3.49', category: 'Fruits & Veg', image: require('../../assets/images/dairy.png') },
  { id: 'p3', name: 'Baguette', qty: '1 pc', price: '0.89', category: 'Fruits & Veg', image: require('../../assets/images/bakery.png') },
  { id: 'p4', name: 'Chicken Breast', qty: '1 kg', price: '6.90', category: 'Fruits & Veg', image: require('../../assets/images/meat.png') },
];

export default function CategoryPage() {
  const router = useRouter();
  const { name } = useLocalSearchParams();
  const [search, setSearch] = useState('');

  const categoryName = decodeURIComponent(String(name));

  const filtered = useMemo(() => {
    const byCat = ALL_PRODUCTS.filter((p) => p.category === categoryName);
    const q = search.trim().toLowerCase();
    if (!q) return byCat;
    return byCat.filter((p) => p.name.toLowerCase().includes(q));
  }, [categoryName, search]);

  return (
    <View style={styles.screen}>
      <Text style={styles.back} onPress={() => router.back()}>← Back</Text>
      <Text style={styles.title}>{categoryName}</Text>

      <SearchBar value={search} onChange={setSearch} />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 30 }}
        renderItem={({ item }) => (
          <View style={{ flex: 1, marginBottom: 12 }}>
            <ProductCard item={item} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff', padding: 20 },
  back: { fontWeight: '800', color: '#111', marginBottom: 8 },
  title: { fontSize: 22, fontWeight: '900', color: '#111', marginBottom: 10 },
});

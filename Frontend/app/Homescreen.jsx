import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';

import SearchBar from './component/SearchBar';
import CategoryCard from './component/CategoryCard';
import ProductCard from './component/ProductCard';

import meat from '../assets/images/meat.png';
import dairy from '../assets/images/dairy.png';
import bakery from '../assets/images/bakery.png';
import fruitsvegetables from '../assets/images/Vegetables.png';
import bananas from '../assets/images/dairy.png';
import milk from '../assets/images/meat.png'

export default function Homescreen() {
  const [search, setSearch] = useState('');
  const [showAll, setShowAll] = useState(false);

 



  const CATEGORIES = [
  { id: '1', title: 'Fruits & Veg', image: fruitsvegetables },
  { id: '2', title: 'Meat', image: meat },
  { id: '3', title: 'Dairy & Eggs', image: dairy },
  { id: '4', title: 'Bakery', image: bakery },
  { id: '5', title: 'Seafood', image: meat },
  { id: '6', title: 'Snacks', image: bakery },
  { id: '7', title: 'Drinks', image: dairy },
  { id: '8', title: 'Frozen', image: fruitsvegetables },
];
const POPULAR = [
  { id: 'p1', name: 'Organic Bananas', qty: '1 bunch (approx 6)', price: '1.29', image: bananas },
  { id: 'p2', name: 'Whole Milk', qty: '1 Gallon', price: '3.49', image: milk },
];

const FRESH_ARRIVALS = [
  { id: 'f1', name: 'Strawberries', qty: '500g', price: '2.99', image: fruitsvegetables, tag: 'New' },
  { id: 'f2', name: 'Yogurt', qty: '6 cups', price: '4.20', image: dairy, tag: 'Fresh' },
  { id: 'f3', name: 'Baguette', qty: '1 pc', price: '0.89', image: bakery, tag: 'New' },
];



   const displayedCategories = showAll
  ? CATEGORIES
  : CATEGORIES.slice(0, 4);

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <SearchBar value={search} onChange={setSearch} />

        <View style={styles.sectionHeader}>
  <Text style={styles.sectionTitle}>Shop by Category</Text>

  <Text
    style={styles.seeAll}
    onPress={() => setShowAll(!showAll)}
  >
    {showAll ? 'See less' : 'See all'}
  </Text>
</View>





        <FlatList
  data={displayedCategories}
  keyExtractor={(item) => item.id}
  numColumns={2}
  scrollEnabled={false}
  renderItem={({ item }) => (
    <CategoryCard
      title={item.title}
      image={item.image}
      onPress={() => console.log(item.title)}
    />
  )}
/>
<View style={{ marginTop: 20 }}>
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>Popular Near You</Text>
  </View>

  <FlatList
    data={POPULAR}
    horizontal
    showsHorizontalScrollIndicator={false}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => (
      <ProductCard
        item={item}
        onAdd={() => console.log('Add:', item.name)}
        onFav={() => console.log('Fav:', item.name)}
      />
    )}
  />
</View>
<View style={{ marginTop: 20 }}>
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>Fresh Arrivals</Text>
    <Text style={styles.seeAll}>See all</Text>
  </View>

  <FlatList
    data={FRESH_ARRIVALS}
    horizontal
    showsHorizontalScrollIndicator={false}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => (
      <ProductCard
        item={item}
        onAdd={() => console.log('Add fresh:', item.name)}
        onFav={() => console.log('Fav fresh:', item.name)}
      />
    )}
  />
</View>


      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 20 },
  sectionHeader: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111' },
  seeAll: { color: '#34A853', fontWeight: '600' },
});

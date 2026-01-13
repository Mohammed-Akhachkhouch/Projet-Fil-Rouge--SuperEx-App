import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';

import SearchBar from './component/SearchBar';
import CategoryCard from './component/CategoryCard';

import meat from '../assets/images/meat.png';
import dairy from '../assets/images/dairy.png';
import bakery from '../assets/images/bakery.png';
import fruitsvegetables from '../assets/images/Vegetables.png';

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

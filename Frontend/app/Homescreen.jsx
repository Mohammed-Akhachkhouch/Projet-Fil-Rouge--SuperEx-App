import { View, Text, StyleSheet, ScrollView, FlatList, ActivityIndicator, RefreshControl } from "react-native";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { StatusBar } from "expo-status-bar";
import { useState, useRef, useMemo } from "react";
import { useRouter } from "expo-router";

import SearchBar from "./component/SearchBar";
import CategoryCard from "./component/CategoryCard";
import ProductCard from "./component/ProductCard";

import { useCategories } from "../hooks/useCategories";
import { useProducts } from "../hooks/useProducts";

export default function Homescreen() {
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const sheetRef = useRef(null);
  const snapPoints = useMemo(() => ["85%"], []);
  const [catSearch, setCatSearch] = useState("");

  const router = useRouter();

  const { data: categories = [], isLoading: catLoading, refetch: refetchCategories } = useCategories();
  const { data: products = [], isLoading: prodLoading, refetch: refetchProducts } = useProducts();

  const openCategoriesSheet = () => {
    setCatSearch("");
    sheetRef.current?.present();
  };

  const closeCategoriesSheet = () => {
    sheetRef.current?.dismiss();
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchCategories(), refetchProducts()]);
    } finally {
      setRefreshing(false);
    }
  };

  const displayedCategories = categories.slice(0, 4);

  const filteredCategories = (categories || []).filter((c) => {
    const label = (c?.name || "").toLowerCase();
    return label.includes(catSearch.trim().toLowerCase());
  });


  const POPULAR = products.slice(0, 6);
  const FRESH_ARRIVALS = products.slice(6, 12);

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />

      <ScrollView 
        contentContainerStyle={styles.container} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#34A853"
          />
        }
      >
        <SearchBar value={search} onChange={setSearch} />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <Text style={styles.seeAll} onPress={openCategoriesSheet}>
            see all
          </Text>
        </View>

        {catLoading ? (
          <ActivityIndicator style={{ marginVertical: 12 }} />
        ) : (
          <FlatList
            data={displayedCategories}
            keyExtractor={(item) => String(item.id)}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={{ gap: 12 }}
            renderItem={({ item }) => (
              <View style={{ flex: 1, marginBottom: 12 }}>
                <CategoryCard
                  name={item.name}
                  image={item.image}
                  onPress={() => router.push(`/category/${encodeURIComponent(item.name)}`)}
                />
              </View>
            )}
          />
        )}

        <View style={{ marginTop: 20 }}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Near You</Text>
          </View>

          {prodLoading ? (
            <ActivityIndicator style={{ marginVertical: 12 }} />
          ) : (
            <FlatList
              data={POPULAR}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <ProductCard
                  item={item}
                  onAdd={() => console.log("Add:", item.name)}
                  onFav={() => console.log("Fav:", item.name)}
                />
              )}
            />
          )}
        </View>

        <View style={{ marginTop: 20 }}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Fresh Arrivals</Text>
          </View>

          {prodLoading ? (
            <ActivityIndicator style={{ marginVertical: 12 }} />
          ) : (
            <FlatList
              data={FRESH_ARRIVALS}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <ProductCard
                  item={{ ...item, tag: "New" }} // tag مؤقت
                  onAdd={() => console.log("Add fresh:", item.name)}
                  onFav={() => console.log("Fav fresh:", item.name)}
                />
              )}
            />
          )}
        </View>
      </ScrollView>

      <BottomSheetModal ref={sheetRef} index={0} snapPoints={snapPoints} enablePanDownToClose>
        <BottomSheetView style={styles.sheetContent}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>All Categories</Text>
            <Text style={styles.sheetClose} onPress={closeCategoriesSheet}>
              Close
            </Text>
          </View>

          <SearchBar value={catSearch} onChange={setCatSearch} />

          <FlatList
            data={filteredCategories}
            keyExtractor={(item) => String(item.id)}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            columnWrapperStyle={{ gap: 12 }}
            renderItem={({ item }) => (
              <View style={{ flex: 1, marginBottom: 12 }}>
                <CategoryCard
                  name={item.name}
                  image={item.image}
                  onPress={() => {
                    closeCategoriesSheet();
                    router.push(`/category/${encodeURIComponent(item.name)}`);
                  }}
                />
              </View>
            )}
          />
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 20 },
  sectionHeader: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#111" },
  seeAll: { color: "#34A853", fontWeight: "600" },

  sheetContent: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111",
  },
  sheetClose: {
    color: "#34A853",
    fontWeight: "700",
  },
});

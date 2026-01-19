import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";

import SearchBar from "../component/SearchBar";
import ProductCard from "../component/ProductCard";

import { useProducts } from "../../hooks/useProducts";
import { useCategories } from "../../hooks/useCategories";

export default function CategoryPage() {
  const router = useRouter();
  const { name } = useLocalSearchParams();

  const [search, setSearch] = useState("");

  const categoryName = decodeURIComponent(String(name || ""));

  const { data: categories = [], isLoading: catLoading, error: catError } = useCategories();
  const { data: products = [], isLoading: prodLoading, error: prodError } = useProducts();

  const categoryId = useMemo(() => {
    const found = categories.find((c) => (c.name || c.title) === categoryName);
    return found?.id;
  }, [categories, categoryName]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    const byCat = categoryId
      ? products.filter((p) => p.categoryId === categoryId)
      : [];

    if (!q) return byCat;

    return byCat.filter((p) => (p.name || "").toLowerCase().includes(q));
  }, [products, categoryId, search]);

  const isLoading = catLoading || prodLoading;
  const error = catError || prodError;

  if (isLoading) {
    return (
      <View style={[styles.screen, styles.center]}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text style={styles.error}>Error loading data: {error.message}</Text>
      </View>
    );
  }

  if (!categoryId) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text style={styles.error}>Category not found: {categoryName}</Text>
        <Text style={styles.back} onPress={() => router.back()}>
          ← Back
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.back} onPress={() => router.back()}>
        ← Back
      </Text>

      <Text style={styles.title}>{categoryName}</Text>

      <SearchBar value={search} onChange={setSearch} />

      {filtered.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No products found in this category</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          columnWrapperStyle={{ gap: 12 }}
          contentContainerStyle={{ paddingTop: 10, paddingBottom: 30 }}
          renderItem={({ item }) => (
            <View style={{ flex: 1, marginBottom: 12 }}>
              <ProductCard item={item} />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff", padding: 20 },
  back: { fontWeight: "800", color: "#111", marginBottom: 8 },
  title: { fontSize: 22, fontWeight: "900", color: "#111", marginBottom: 10 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  error: { color: "red", fontSize: 16, textAlign: "center" },
  emptyText: { color: "#666", fontSize: 16, textAlign: "center", marginTop: 20 },
});

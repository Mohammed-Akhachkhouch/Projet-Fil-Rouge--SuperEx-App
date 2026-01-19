import { View, Text, StyleSheet, Image, TouchableOpacity, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import placeholder from "../../assets/images/Vegetables.png";

export default function ProductCard({ item, onAdd }) {
  const router = useRouter();

  const imageSource =
    item?.imageUrl && typeof item.imageUrl === "string" && item.imageUrl.startsWith("http")
      ? { uri: item.imageUrl }
      : placeholder;

  const goDetails = () => router.push(`/product/${item.id}`);

  return (
    <Pressable style={styles.card} onPress={goDetails}>
      <View style={styles.imageWrap}>
        <Image source={imageSource} style={styles.image} />
        <TouchableOpacity style={styles.favBtn} onPress={goDetails}>
          <Ionicons name="heart-outline" size={18} color="#7B8794" />
        </TouchableOpacity>
      </View>

      <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.qty} numberOfLines={1}>{item.qtyLabel || ""}</Text>

      <View style={styles.bottomRow}>
        <Text style={styles.price}>${Number(item.price).toFixed(2)}</Text>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={(e) => {
            e.stopPropagation?.();
            onAdd?.(item);
          }}
        >
          <Ionicons name="add" size={18} color="#0d1b12" />
        </TouchableOpacity>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { width: 170, backgroundColor: "#fff", borderRadius: 16, padding: 12, marginRight: 12, borderWidth: 1, borderColor: "#EEF2F6" },
  imageWrap: { height: 92, borderRadius: 14, overflow: "hidden", backgroundColor: "#F7F8FA", justifyContent: "center", alignItems: "center" },
  image: { width: "100%", height: "100%", resizeMode: "cover" },
  favBtn: { position: "absolute", top: 10, right: 10, width: 30, height: 30, borderRadius: 15, backgroundColor: "rgba(255,255,255,0.9)", justifyContent: "center", alignItems: "center" },
  name: { marginTop: 10, fontSize: 15, fontWeight: "700", color: "#111" },
  qty: { marginTop: 2, fontSize: 12, color: "#7B8794" },
  bottomRow: { marginTop: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  price: { fontSize: 16, fontWeight: "800", color: "#111" },
  addBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: "#13ec5b", justifyContent: "center", alignItems: "center" },
});

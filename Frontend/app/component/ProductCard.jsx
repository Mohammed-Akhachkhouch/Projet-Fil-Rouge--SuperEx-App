import { View, Text, StyleSheet, Image, TouchableOpacity,Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ProductCard({ item, onAdd, onFav }) {
  const router = useRouter();

  const goDetailes = () => {
    router.push(`/product/${item.id}`);
  }
  return (
    <Pressable style={styles.card} onPress={goDetailes}>
      <View style={styles.imageWrap}>
        <Image source={item.image} style={styles.image} />

        <TouchableOpacity style={styles.favBtn} onPress={() => router.push(`/product/${item.id}`)}>
          <Ionicons name="heart-outline" size={18} color="#7B8794" />
        </TouchableOpacity>
      </View>
      {item.tag ? (
  <View style={styles.tag}>
    <Text style={styles.tagText}>{item.tag}</Text>
  </View>
) : null}


      <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.qty} numberOfLines={1}>{item.qty}</Text>

      <View style={styles.bottomRow}>
        <Text style={styles.price}>${item.price}</Text>

        <TouchableOpacity style={styles.addBtn} onPress={() => onAdd?.(item)}>
          <Ionicons name="add" size={18} color="#0d1b12" />
        </TouchableOpacity>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 170,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  imageWrap: {
    height: 92,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#F7F8FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  favBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tag: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(19,236,91,0.95)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0d1b12',
  },
  name: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
  },
  qty: {
    marginTop: 2,
    fontSize: 12,
    color: '#7B8794',
  },
  bottomRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111',
  },
  addBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#13ec5b',
    justifyContent: 'center',
    alignItems: 'center',
  },

});

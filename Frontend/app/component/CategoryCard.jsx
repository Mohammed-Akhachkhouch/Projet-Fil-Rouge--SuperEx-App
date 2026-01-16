import { Text, StyleSheet, TouchableOpacity, ImageBackground, View } from 'react-native';

export default function CategoryCard({ title, image, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <ImageBackground source={image} style={styles.image} imageStyle={styles.imageRadius}>
        <View style={styles.overlay} />
        <Text style={styles.title}>{title}</Text>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
    margin: 8,
  },
  image: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 12,
  },
  imageRadius: {
    borderRadius: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});

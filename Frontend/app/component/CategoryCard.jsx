import { Text, StyleSheet, TouchableOpacity, ImageBackground, View } from 'react-native';

export default function CategoryCard({ name, image, onPress }) {
  const imageSource = typeof image === 'string' ? { uri: image } : image;
  
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <ImageBackground source={imageSource} style={styles.image} imageStyle={styles.imageRadius}>
        <View style={styles.overlay} />
        <Text style={styles.title}>{name}</Text>
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

import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SearchBar({ value, onChange }) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color="#999" />
      <TextInput
        style={styles.input}
        placeholder="Search products..."
        value={value}
        onChangeText={onChange}
        placeholderTextColor="#999"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    paddingHorizontal: 15,
    height: 50,
    borderRadius: 12,
    marginVertical: 15,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#000',
  },
});

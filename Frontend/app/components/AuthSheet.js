// components/AuthBottomSheet.js
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function AuthBottomSheet({ visible, onClose }) {
  const router = useRouter();

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Welcome</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              onClose();
              router.push('/login');
            }}
          >
            <Text>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              onClose();
              router.push('/signup');
            }}
          >
            <Text>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose}>
            <Text style={styles.close}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  button: {
    padding: 15,
    backgroundColor: '#eee',
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  close: { color: 'red', marginTop: 15, textAlign: 'center' },
});

import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useAuthSheet } from '../context/AuthSheetContext';

export default function AuthBottomSheet() {
  const snapPoints = useMemo(() => ['40%'], []);
  const router = useRouter();
  const { bottomSheetRef, closeAuthSheet } = useAuthSheet();

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
    >
      <BottomSheetView style={styles.content}>
        <Text style={styles.title}>Welcome</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            closeAuthSheet();
            router.push('/login');
          }}
        >
          <Text style={styles.text}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            closeAuthSheet();
            router.push('/signup');
          }}
        >
          <Text style={styles.text}>Sign Up</Text>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    padding: 15,
    backgroundColor: '#eee',
    borderRadius: 12,
    marginTop: 10,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
});

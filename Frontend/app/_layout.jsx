import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />     {/* Welcome */}
          <Stack.Screen name="(tabs)" />    {/* Tabs */}
          <Stack.Screen name="cart" />      {/* Cart خارج tabs */}
        </Stack>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

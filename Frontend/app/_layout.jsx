import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthSheetProvider } from './context/AuthSheetContext.js';
import AuthBottomSheet from './components/AuthSheet.js';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthSheetProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: true }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="signup" options={{ headerShown: false }} />
        </Stack>

        {/* Global BottomSheet */}
        <AuthBottomSheet />
      </AuthSheetProvider>
    </GestureHandlerRootView>
  );
}

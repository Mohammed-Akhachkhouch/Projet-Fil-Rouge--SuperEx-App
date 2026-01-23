import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';
import { View, ActivityIndicator, Platform, StatusBar } from 'react-native';

const queryClient = new QueryClient();

export default function RootLayout() {
  // Access each property separately from the store
  const hasHydrated = useAuthStore((s) => s._hasHydrated);
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);


  // Show loading while Zustand rehydrates from AsyncStorage
  if (!hasHydrated) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#34A853" />
        </View>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <SafeAreaView
            style={{
              flex: 1,
              paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
            }}
            edges={['left', 'right']}
          >
            <StatusBar
              barStyle="dark-content"
              backgroundColor="transparent"
              translucent={true}
            />
            <BottomSheetModalProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                {token && user?.role === 'customer' && <Stack.Screen name="(tabs)" />}
                {token && user?.role === 'seller' && <Stack.Screen name="(seller)" />}
              </Stack>
            </BottomSheetModalProvider>
          </SafeAreaView>
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}


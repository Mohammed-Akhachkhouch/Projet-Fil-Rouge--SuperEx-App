import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    
    <GestureHandlerRootView style={{ flex: 1 }}  >
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <Stack screenOptions={{ headerShown: false }  }>
          <Stack.Screen name="index" />    
          <Stack.Screen name="(tabs)" />   
          <Stack.Screen name="cart" />    
        </Stack>
      </BottomSheetModalProvider>
      </SafeAreaView>
      </SafeAreaProvider>
    </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

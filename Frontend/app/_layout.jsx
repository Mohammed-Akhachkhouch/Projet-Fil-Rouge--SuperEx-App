import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../store/authStore';
import { View, ActivityIndicator } from 'react-native';

const queryClient = new QueryClient();

export default function RootLayout() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const [restoring, setRestoring] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const userRaw = await AsyncStorage.getItem('userData');
        if (token && userRaw) {
          const user = JSON.parse(userRaw);
          setAuth(user, token);
        }
      } catch (e) {
        console.log('Failed to restore auth:', e);
      } finally {
        setRestoring(false);
      }
    })();
  }, [setAuth]);

  if (restoring) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#34A853" />
        </View>
      </GestureHandlerRootView>
    );
  }
  return (
    
    <GestureHandlerRootView style={{ flex: 1 }}  >
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <Stack screenOptions={{ headerShown: false }  }>
          <Stack.Screen name="index" />    
          <Stack.Screen name="(tabs)" />   
          <Stack.Screen name="(seller)" />
        </Stack>
      </BottomSheetModalProvider>
      </SafeAreaView>
      </SafeAreaProvider>
    </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

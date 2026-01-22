import { Stack } from 'expo-router';

export default function OrderLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="[id]" options={{ title: "Order Details", headerShown: true }} />
        </Stack>
    );
}

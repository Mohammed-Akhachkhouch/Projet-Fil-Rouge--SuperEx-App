import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import { useCartStore } from "../store/cartStore.js";
import { useCreateOrderMutation } from "../hooks/useOrderMutations.js";

export default function Checkout() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);

  const createOrderMut = useCreateOrderMutation();

  const handleCancel = () => {
    router.back();
  };

  const handleSend = async () => {
    try {
      const payload = {
        items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
      };

      const data = await createOrderMut.mutateAsync(payload);

      clearCart();
      router.replace(`/confirmation?orderId=${data.orderId}`);
    } catch (e) {
      console.log("ORDER ERROR:", e?.response?.data?.message || e.message);
    }
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Checkout</Text>

      <View style={styles.row}>
        <TouchableOpacity style={[styles.btn, styles.cancel]} onPress={handleCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.send]}
          onPress={handleSend}
          disabled={createOrderMut.isPending || items.length === 0}
        >
          <Text style={styles.sendText}>
            {createOrderMut.isPending ? "Sending..." : "Send"}
          </Text>
        </TouchableOpacity>
      </View>

      {items.length === 0 ? (
        <Text style={styles.hint}>Your cart is empty</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff", padding: 16 },
  title: { fontSize: 22, fontWeight: "900", color: "#111" },
  hint: { marginTop: 12, color: "#666", fontWeight: "600" },
  row: { flexDirection: "row", gap: 12, marginTop: 16 },
  btn: { flex: 1, height: 52, borderRadius: 14, justifyContent: "center", alignItems: "center" },
  cancel: { backgroundColor: "#F3F4F6" },
  send: { backgroundColor: "#34A853" },
  cancelText: { fontWeight: "800", color: "#111" },
  sendText: { fontWeight: "900", color: "#fff" },
});

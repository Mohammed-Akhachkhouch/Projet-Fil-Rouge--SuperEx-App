import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";

export default function SellerProfile() {
  return (
    <View style={styles.screen}>
      <Text style={styles.h1}>Store Profile</Text>
      <Text style={styles.sub}>Update your store information</Text>

      <View style={styles.block}>
        <Text style={styles.label}>Store Name</Text>
        <TextInput style={styles.input} placeholder="SuperMarket Express" />

        <Text style={styles.label}>Address</Text>
        <TextInput style={styles.input} placeholder="742 Evergreen Terrace" />

        <TouchableOpacity style={styles.saveBtn} activeOpacity={0.9}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff", padding: 20 },
  h1: { fontSize: 22, fontWeight: "900", color: "#111" },
  sub: { marginTop: 4, color: "#6B7280", fontWeight: "600" },

  block: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#EEF2F6",
    borderRadius: 16,
    padding: 14,
  },
  label: { marginTop: 10, fontWeight: "800", color: "#111" },
  input: {
    marginTop: 8,
    height: 52,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
  },
  saveBtn: {
    marginTop: 16,
    height: 54,
    borderRadius: 14,
    backgroundColor: "#13ec5b",
    alignItems: "center",
    justifyContent: "center",
  },
  saveText: { fontWeight: "900", color: "#0d1b12", fontSize: 16 },
});

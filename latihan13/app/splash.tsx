import { router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { auth } from "../config/firebase";

export default function Splash() {
  useEffect(() => {
    const timer = setTimeout(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          router.replace("/dashboard");
        } else {
          router.replace("/login");
        }
      });

      return unsubscribe;
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LP3I Cinema</Text>
      <Text style={styles.subtitle}>Firebase Authentication</Text>

      <ActivityIndicator size="large" color="#38bdf8" style={{ marginTop: 30 }} />
      <Text style={styles.loading}>Memuat aplikasi...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    color: "#ffffff",
    fontSize: 34,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#94a3b8",
    marginTop: 8,
  },
  loading: {
    color: "#94a3b8",
    marginTop: 12,
  },
});

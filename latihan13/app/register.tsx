import { router } from "expo-router";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { auth } from "../config/firebase";

export default function Register() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister() {
    if (nama.trim() === "" || email.trim() === "" || password.trim() === "") {
      Alert.alert("Peringatan", "Nama, email, dan password wajib diisi.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Peringatan", "Password minimal 6 karakter.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredential.user, {
        displayName: nama,
      });

      Alert.alert("Berhasil", "Akun berhasil dibuat.");
      router.replace("/dashboard");
    } catch (error: any) {
      console.log(error.message);

      if (error.code === "auth/email-already-in-use") {
        Alert.alert("Register Gagal", "Email sudah digunakan.");
      } else if (error.code === "auth/invalid-email") {
        Alert.alert("Register Gagal", "Format email tidak valid.");
      } else if (error.code === "auth/weak-password") {
        Alert.alert("Register Gagal", "Password terlalu lemah.");
      } else {
        Alert.alert("Register Gagal", "Terjadi kesalahan saat membuat akun.");
      }
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.title}>Register</Text>
      <Text style={styles.subtitle}>Buat akun baru untuk masuk aplikasi</Text>

      <TextInput
        style={styles.input}
        placeholder="Nama lengkap"
        placeholderTextColor="#64748b"
        value={nama}
        onChangeText={setNama}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#64748b"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password minimal 6 karakter"
        placeholderTextColor="#64748b"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace("/login")}>
        <Text style={styles.loginText}>
          sudah punya akun? <Text style={styles.loginLink}>login</Text>
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    color: "#ffffff",
    fontSize: 34,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#1e293b",
    color: "#ffffff",
    borderRadius: 14,
    padding: 15,
    marginBottom: 14,
  },
  button: {
    backgroundColor: "#0284c7",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 6,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  loginText: {
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 20,
  },
  loginLink: {
    color: "#38bdf8",
    fontWeight: "bold",
  },
});

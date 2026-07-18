import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleLogin = () => {
    if (username === "admin" && password === "1234") {
      router.replace("/home");
    } else {
      Alert.alert("Login Gagal", "Username atau Password salah");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LOGIN APLIKASI</Text>

      <TextInput
        placeholder="Username"
        style={styles.input}
        onChangeText={setUsername}
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.textButton}>LOGIN</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },

  input: {
    borderWidth: 1,
    borderColor: "#f8f3f3",
    backgroundColor: "#ffffff",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
  },

  button: {
    backgroundColor: "blue",
    padding: 15,
    borderRadius: 8,
  },

  textButton: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});

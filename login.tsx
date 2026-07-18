import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MENU UTAMA</Text>

      <TouchableOpacity
        style={styles.menu}
        onPress={() => router.push("/mahasiswa")}
      >
        <Text style={styles.textMenu}>Data Mahasiswa</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menu}>
        <Text style={styles.textMenu}>Data Mata Kuliah</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menu}>
        <Text style={styles.textMenu}>Tentang Aplikasi</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logout}
        onPress={() => router.replace("/login")}
      >
        <Text style={styles.textMenu}>Logout</Text>
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
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },

  menu: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  logout: {
    backgroundColor: "red",
    padding: 15,
    borderRadius: 10,
  },

  textMenu: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});

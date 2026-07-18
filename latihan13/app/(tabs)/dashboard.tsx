import { router } from "expo-router";
import { signOut } from "firebase/auth";
import {
    Alert,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { auth } from "../../config/firebase";

const films = [
  {
    id: "1",
    title: "Avengers: Future War",
    genre: "Action, Sci-Fi",
    durasi: "120 Menit",
    rating: "SU",
    jam: "13.00 | 16.00 | 19.00",
    harga: 45000,
    image: require("../../assets/images/films/films1.jpg"),
  },
  {
    id: "2",
    title: "The Last Kingdom",
    genre: "Adventure, Drama",
    durasi: "110 Menit",
    rating: "13+",
    jam: "12.30 | 15.30 | 18.30",
    harga: 40000,
    image: require("../../assets/images/films/films2.jpg"),
  },
  {
    id: "3",
    title: "Meteor Garden",
    genre: "Romance, Drama",
    durasi: "100 Menit",
    rating: "13+",
    jam: "14.00 | 17.00 | 20.00",
    harga: 35000,
    image: require("../../assets/images/films/films3.jpg"),
  },
  {
    id: "4",
    title: "Robotica AI",
    genre: "Technology, Action",
    durasi: "115 Menit",
    rating: "SU",
    jam: "11.00 | 14.30 | 19.30",
    harga: 50000,
    image: require("../../assets/images/films/films4.jpg"),
  },
];

export default function Dashboard() {
  const user = auth.currentUser;
  const namaUser = user?.displayName || user?.email || "User";

  async function handleLogout() {
    try {
      await signOut(auth);
      Alert.alert("Logout", "Anda berhasil keluar.");
      router.replace("/login");
    } catch (error: any) {
      Alert.alert("Error", "Gagal logout.");
      console.log(error.message);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={{ flex: 1 }}>
          <Text style={styles.appName}>LP3I Cinema</Text>
          <Text style={styles.welcome}>Halo, {namaUser}</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>Film Sedang Tayang</Text>
        <Text style={styles.bannerText}>
          Pilih film favorit dan pesan tiket sekarang
        </Text>
      </View>

      <FlatList
        data={films}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item.image} style={styles.poster} />

            <View style={styles.info}>
              <Text style={styles.title}>{item.title}</Text>

              <View style={styles.badgeRow}>
                <Text style={styles.badge}>{item.rating}</Text>
                <Text style={styles.genre}>{item.genre}</Text>
              </View>

              <Text style={styles.detail}>Durasi: {item.durasi}</Text>
              <Text style={styles.detail}>Jam: {item.jam}</Text>

              <Text style={styles.price}>
                Rp {item.harga.toLocaleString("id-ID")}
              </Text>

              <TouchableOpacity
                style={styles.orderButton}
                onPress={() =>
                  router.push({
                    pathname: "/pesan",
                    params: {
                      title: item.title,
                      harga: item.harga.toString(),
                      jam: item.jam,
                    },
                  })
                }
              >
                <Text style={styles.orderText}>Pesan Tiket</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    padding: 20,
  },
  topBar: {
    marginTop: 35,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  appName: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "bold",
  },
  welcome: {
    color: "#94a3b8",
    marginTop: 4,
    fontSize: 15,
  },
  logoutButton: {
    backgroundColor: "#dc2626",
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginLeft: 10,
  },
  logoutText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  banner: {
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#1e293b",
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
  },
  bannerTitle: {
    color: "#ffffff",
    fontSize: 23,
    fontWeight: "bold",
  },
  bannerText: {
    color: "#94a3b8",
    marginTop: 5,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#0f172a",
    borderRadius: 18,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  poster: {
    width: 105,
    height: 155,
    borderRadius: 14,
    backgroundColor: "#1e293b",
  },
  info: {
    flex: 1,
    marginLeft: 14,
  },
  title: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
    marginBottom: 8,
  },
  badge: {
    backgroundColor: "#0284c7",
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginRight: 8,
  },
  genre: {
    color: "#94a3b8",
    fontSize: 13,
    flexShrink: 1,
  },
  detail: {
    color: "#cbd5e1",
    fontSize: 13,
    marginTop: 3,
  },
  price: {
    color: "#38bdf8",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 9,
  },
  orderButton: {
    backgroundColor: "#0284c7",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  orderText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
});

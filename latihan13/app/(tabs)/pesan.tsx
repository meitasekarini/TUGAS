import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function Pesan() {
  const { title, harga, jam } = useLocalSearchParams();

  const [namaPemesan, setNamaPemesan] = useState("");
  const [jumlahTiket, setJumlahTiket] = useState("1");
  const [nomorKursi, setNomorKursi] = useState("");

  const hargaTiket = Number(harga || 0);
  const jumlah = Number(jumlahTiket || 0);
  const totalBayar = hargaTiket * jumlah;

  function handleCetakTiket() {
    if (
      namaPemesan.trim() === "" ||
      jumlahTiket.trim() === "" ||
      nomorKursi.trim() === ""
    ) {
      Alert.alert("Peringatan", "Semua data pemesanan wajib diisi.");
      return;
    }

    if (jumlah <= 0) {
      Alert.alert("Peringatan", "Jumlah tiket harus lebih dari 0.");
      return;
    }

    router.push({
      pathname: "/(tabs)/cetak" as any,
      params: {
        namaPemesan: namaPemesan,
        title: String(title),
        harga: hargaTiket.toString(),
        jam: String(jam),
        jumlahTiket: jumlahTiket,
        nomorKursi: nomorKursi,
        totalBayar: totalBayar.toString(),
      },
    });
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.header}>Pesan Tiket</Text>
      <Text style={styles.subHeader}>Lengkapi data pemesanan tiket Anda</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Film</Text>
        <Text style={styles.movieTitle}>{title || "Film belum dipilih"}</Text>

        <Text style={styles.label}>Jam Tayang</Text>
        <Text style={styles.value}>{jam || "-"}</Text>

        <Text style={styles.label}>Harga Tiket</Text>
        <Text style={styles.price}>
          Rp {hargaTiket.toLocaleString("id-ID")}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Nama Pemesan"
          placeholderTextColor="#64748b"
          value={namaPemesan}
          onChangeText={setNamaPemesan}
        />

        <TextInput
          style={styles.input}
          placeholder="Jumlah Tiket"
          placeholderTextColor="#64748b"
          keyboardType="numeric"
          value={jumlahTiket}
          onChangeText={setJumlahTiket}
        />

        <TextInput
          style={styles.input}
          placeholder="Nomor Kursi, contoh: A1, A2"
          placeholderTextColor="#64748b"
          value={nomorKursi}
          onChangeText={setNomorKursi}
        />

        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>Total Bayar</Text>
          <Text style={styles.totalText}>
            Rp {totalBayar.toLocaleString("id-ID")}
          </Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleCetakTiket}>
          <Text style={styles.buttonText}>Cetak Tiket</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>Kembali</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    padding: 20,
  },
  header: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 40,
  },
  subHeader: {
    color: "#94a3b8",
    marginTop: 5,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#0f172a",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  label: {
    color: "#94a3b8",
    fontSize: 13,
    marginTop: 8,
  },
  movieTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 4,
    marginBottom: 8,
  },
  value: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 4,
    marginBottom: 8,
  },
  price: {
    color: "#38bdf8",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 4,
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#1e293b",
    borderRadius: 12,
    padding: 14,
    color: "#ffffff",
    marginBottom: 12,
  },
  totalBox: {
    backgroundColor: "#082f49",
    borderRadius: 14,
    padding: 15,
    marginTop: 5,
    marginBottom: 15,
  },
  totalLabel: {
    color: "#bae6fd",
    fontSize: 13,
  },
  totalText: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 4,
  },
  button: {
    backgroundColor: "#0284c7",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  backButton: {
    marginTop: 14,
    alignItems: "center",
  },
  backText: {
    color: "#94a3b8",
    fontWeight: "600",
  },
});

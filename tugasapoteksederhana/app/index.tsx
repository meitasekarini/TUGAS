import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker"; // Import Image Picker
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";

type Obat = {
  id: string;
  kode_obat: string;
  nama_obat: string;
  jenis_obat: string;
  stok: number;
  harga: number;
  keterangan: string;
  gambar_url: string; // Menyimpan URI lokal atau base64 gambar dari internal storage
};

export default function Index() {
  const [dataObat, setDataObat] = useState<Obat[]>([]);

  const [kodeObat, setKodeObat] = useState("");
  const [namaObat, setNamaObat] = useState("");
  const [jenisObat, setJenisObat] = useState("");
  const [stok, setStok] = useState("");
  const [harga, setHarga] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [gambarUrl, setGambarUrl] = useState(""); // Sekarang digunakan untuk menyimpan URI gambar dari HP

  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getDataObat();
  }, []);

  async function getDataObat() {
    try {
      const snapshot = await getDocs(collection(db, "tbobat"));

      const data: Obat[] = snapshot.docs.map((document) => {
        const item = document.data();

        return {
          id: document.id,
          kode_obat: item.kode_obat || "",
          nama_obat: item.nama_obat || "",
          jenis_obat: item.jenis_obat || "",
          stok: Number(item.stok || 0),
          harga: Number(item.harga || 0),
          keterangan: item.keterangan || "",
          gambar_url: item.gambar_url || "",
        };
      });

      setDataObat(data);
    } catch (error) {
      console.log("Gagal mengambil data obat:", error);
      Alert.alert("Error", "Gagal mengambil data obat dari Firebase.");
    }
  }

  // Fungsi Baru untuk Mengambil Gambar dari Galeri Folder HP
  async function pilihGambarDariHP() {
    // Meminta izin akses ke penyimpanan/galeri media internal HP
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== "granted") {
      Alert.alert(
        "Izin Ditolak",
        "Aplikasi membutuhkan akses galeri foto untuk memilih gambar obat."
      );
      return;
    }

    // Membuka antarmuka berkas dokumen folder gambar internal HP
    let hasil = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, // Izinkan crop/potong gambar
      aspect: [4, 3], // Set rasio potongan gambar
      quality: 0.7, // Kompresi kualitas gambar (0 - 1) demi menghemat penyimpanan data
    });

    if (!hasil.canceled) {
      // Menyimpan berkas lokal URI gambar sementara ke state gambarUrl
      setGambarUrl(hasil.assets[0].uri);
    }
  }

  function resetForm() {
    setKodeObat("");
    setNamaObat("");
    setJenisObat("");
    setStok("");
    setHarga("");
    setKeterangan("");
    setGambarUrl("");
    setEditId(null);
  }

  async function simpanObat() {
    if (
      kodeObat.trim() === "" ||
      namaObat.trim() === "" ||
      jenisObat.trim() === "" ||
      stok.trim() === "" ||
      harga.trim() === "" ||
      gambarUrl.trim() === ""
    ) {
      Alert.alert(
        "Peringatan",
        "Kode obat, nama obat, jenis obat, stok, harga, dan gambar wajib diisi."
      );
      return;
    }

    if (Number(stok) < 0 || Number(harga) <= 0) {
      Alert.alert("Peringatan", "Stok dan harga harus valid.");
      return;
    }

    try {
      setLoading(true);

      const dataSimpan = {
        kode_obat: kodeObat,
        nama_obat: namaObat,
        jenis_obat: jenisObat,
        stok: Number(stok),
        harga: Number(harga),
        keterangan: keterangan,
        gambar_url: gambarUrl, // Menyimpan string URI path lokal perangkat HP
        created_at: new Date().toISOString(),
      };

      if (editId === null) {
        await addDoc(collection(db, "tbobat"), dataSimpan);
        Alert.alert("Berhasil", "Data obat berhasil disimpan.");
      } else {
        await updateDoc(doc(db, "tbobat", editId), dataSimpan);
        Alert.alert("Berhasil", "Data obat berhasil diperbarui.");
      }

      resetForm();
      getDataObat();
    } catch (error) {
      console.log("Gagal menyimpan data obat:", error);
      Alert.alert("Error", "Gagal menyimpan data obat.");
    } finally {
      setLoading(false);
    }
  }

  function pilihEdit(item: Obat) {
    setEditId(item.id);
    setKodeObat(item.kode_obat);
    setNamaObat(item.nama_obat);
    setJenisObat(item.jenis_obat);
    setStok(String(item.stok));
    setHarga(String(item.harga));
    setKeterangan(item.keterangan);
    setGambarUrl(item.gambar_url);
  }

  function hapusObat(id: string) {
    Alert.alert("Konfirmasi", "Yakin ingin menghapus data obat ini?", [
      {
        text: "Batal",
        style: "cancel",
      },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "tbobat", id));

            if (editId === id) {
              resetForm();
            }

            Alert.alert("Berhasil", "Data obat berhasil dihapus.");
            getDataObat();
          } catch (error) {
            console.log("Gagal menghapus data obat:", error);
            Alert.alert("Error", "Gagal menghapus data obat.");
          }
        },
      },
    ]);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Input Data Obat</Text>
        <Text style={styles.subHeader}>
          Firebase Firestore dengan Pencari Gambar Folder HP lokal
        </Text>

        <TouchableOpacity
          style={styles.laporanButton}
          onPress={() => router.push("/laporan")}
        >
          <Text style={styles.buttonText}>Lihat / Cetak Laporan Data Obat</Text>
        </TouchableOpacity>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>
            {editId === null ? "Tambah Data Obat" : "Edit Data Obat"}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Kode Obat, contoh: O001"
            placeholderTextColor="#94a3b8"
            value={kodeObat}
            onChangeText={setKodeObat}
          />

          <TextInput
            style={styles.input}
            placeholder="Nama Obat"
            placeholderTextColor="#94a3b8"
            value={namaObat}
            onChangeText={setNamaObat}
          />

          <TextInput
            style={styles.input}
            placeholder="Jenis Obat, contoh: Tablet / Sirup / Kapsul"
            placeholderTextColor="#94a3b8"
            value={jenisObat}
            onChangeText={setJenisObat}
          />

          <TextInput
            style={styles.input}
            placeholder="Stok"
            placeholderTextColor="#94a3b8"
            keyboardType="numeric"
            value={stok}
            onChangeText={setStok}
          />

          <TextInput
            style={styles.input}
            placeholder="Harga"
            placeholderTextColor="#94a3b8"
            keyboardType="numeric"
            value={harga}
            onChangeText={setHarga}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Keterangan"
            placeholderTextColor="#94a3b8"
            value={keterangan}
            onChangeText={setKeterangan}
            multiline
          />

          {/* Pengganti Input Text Link Gambar: Tombol Buka Folder HP */}
          <TouchableOpacity 
            style={styles.imagePickerButton} 
            onPress={pilihGambarDariHP}
          >
            <Text style={styles.imagePickerButtonText}>
              {gambarUrl ? "🔄 Ubah Gambar Obat" : "📂 Pilih Gambar dari Folder HP"}
            </Text>
          </TouchableOpacity>

          {/* Preview Tampilan Gambar Sebelum Disimpan */}
          {gambarUrl !== "" && (
            <Image
              source={{ uri: gambarUrl }}
              style={styles.previewImage}
              resizeMode="cover"
            />
          )}

          <TouchableOpacity
            style={styles.saveButton}
            onPress={simpanObat}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading
                ? "Menyimpan..."
                : editId === null
                ? "Simpan Data Obat"
                : "Update Data Obat"}
            </Text>
          </TouchableOpacity>

          {editId !== null && (
            <TouchableOpacity style={styles.cancelButton} onPress={resetForm}>
              <Text style={styles.cancelText}>Batal Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.listTitle}>Data Obat Tersimpan</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.th, styles.colNo]}>No</Text>
              <Text style={[styles.th, styles.colGambar]}>Gambar</Text>
              <Text style={[styles.th, styles.colKode]}>Kode</Text>
              <Text style={[styles.th, styles.colNama]}>Nama Obat</Text>
              <Text style={[styles.th, styles.colJenis]}>Jenis</Text>
              <Text style={[styles.th, styles.colStok]}>Stok</Text>
              <Text style={[styles.th, styles.colHarga]}>Harga</Text>
              <Text style={[styles.th, styles.colKet]}>Keterangan</Text>
              <Text style={[styles.th, styles.colAksi]}>Aksi</Text>
            </View>

            {dataObat.length === 0 ? (
              <View style={styles.emptyRow}>
                <Text style={styles.emptyText}>Belum ada data obat.</Text>
              </View>
            ) : (
              dataObat.map((item, index) => (
                <View key={item.id} style={styles.tableRow}>
                  <Text style={[styles.td, styles.colNo]}>{index + 1}</Text>

                  <View style={styles.colGambar}>
                    {item.gambar_url ? (
                      <Image
                        source={{ uri: item.gambar_url }}
                        style={styles.tableImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <Text style={styles.td}>-</Text>
                    )}
                  </View>

                  <Text style={[styles.td, styles.colKode]}>
                    {item.kode_obat}
                  </Text>

                  <Text style={[styles.td, styles.colNama]}>
                    {item.nama_obat}
                  </Text>

                  <Text style={[styles.td, styles.colJenis]}>
                    {item.jenis_obat}
                  </Text>

                  <Text style={[styles.td, styles.colStok]}>{item.stok}</Text>

                  <Text style={[styles.td, styles.colHarga]}>
                    Rp {item.harga.toLocaleString("id-ID")}
                  </Text>

                  <Text style={[styles.td, styles.colKet]}>
                    {item.keterangan || "-"}
                  </Text>

                  <View style={[styles.colAksi, styles.actionBox]}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => pilihEdit(item)}
                    >
                      <Text style={styles.actionText}>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => hapusObat(item.id)}
                    >
                      <Text style={styles.actionText}>Hapus</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 20,
  },
  header: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 35,
  },
  subHeader: {
    color: "#cbd5e1",
    marginTop: 5,
    marginBottom: 18,
  },
  laporanButton: {
    backgroundColor: "#0284c7",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 18,
  },
  formCard: {
    backgroundColor: "#1e293b",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 22,
  },
  formTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 14,
  },
  input: {
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 12,
    padding: 14,
    color: "#ffffff",
    marginBottom: 12,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  // Style Baru untuk Tombol Akses Folder HP
  imagePickerButton: {
    backgroundColor: "#334155",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#38bdf8",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginBottom: 12,
  },
  imagePickerButtonText: {
    color: "#38bdf8",
    fontWeight: "bold",
  },
  previewImage: {
    width: "100%",
    height: 180,
    borderRadius: 14,
    marginBottom: 12,
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#334155",
  },
  saveButton: {
    backgroundColor: "#16a34a",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 4,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  cancelButton: {
    marginTop: 12,
    alignItems: "center",
  },
  cancelText: {
    color: "#facc15",
    fontWeight: "bold",
  },
  listTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
  table: {
    minWidth: 1180,
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 35,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#0284c7",
    paddingVertical: 12,
    alignItems: "center",
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "#1e293b",
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
    paddingVertical: 12,
    alignItems: "center",
  },
  th: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
    paddingHorizontal: 6,
  },
  td: {
    color: "#e2e8f0",
    fontSize: 12,
    textAlign: "center",
    paddingHorizontal: 6,
  },
  colNo: { width: 45 },
  colGambar: { width: 90, alignItems: "center", justifyContent: "center" },
  colKode: { width: 100 },
  colNama: { width: 170 },
  colJenis: { width: 130 },
  colStok: { width: 70 },
  colHarga: { width: 130 },
  colKet: { width: 230 },
  colAksi: { width: 150 },
  tableImage: {
    width: 58,
    height: 58,
    borderRadius: 10,
    backgroundColor: "#0f172a",
  },
  actionBox: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  editButton: {
    backgroundColor: "#0284c7",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: "#dc2626",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  actionText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 11,
  },
  emptyRow: {
    backgroundColor: "#1e293b",
    padding: 18,
  },
  emptyText: {
    color: "#cbd5e1",
    textAlign: "center",
  },
});
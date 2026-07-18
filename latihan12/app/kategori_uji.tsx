import React, { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    updateDoc,
} from "firebase/firestore";

import { db } from "../config/firebase";

export default function KategoriUji() {
  const [kodeKategori, setKodeKategori] = useState("");
  const [namaKategori, setNamaKategori] = useState("");
  const [durasi, setDurasi] = useState("");

  const [data, setData] = useState<any[]>([]);
  const [editId, setEditId] = useState("");

  useEffect(() => {
    tampilData();
  }, []);

  const tampilData = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(db, "kategori_uji")
      );

      const hasil: any[] = [];

      querySnapshot.forEach((item) => {
        hasil.push({
          id: item.id,
          ...item.data(),
        });
      });

      setData(hasil);
    } catch (error) {
      console.log(error);
    }
  };

  const simpanData = async () => {
    if (
      kodeKategori === "" ||
      namaKategori === "" ||
      durasi === ""
    ) {
      Alert.alert("Peringatan", "Semua field wajib diisi");
      return;
    }

    try {
      await addDoc(collection(db, "kategori_uji"), {
        kode_kategori: kodeKategori,
        nama_kategori: namaKategori,
        durasi: Number(durasi),
      });

      Alert.alert("Sukses", "Data berhasil disimpan");

      resetForm();
      tampilData();
    } catch (error) {
      console.log(error);
    }
  };

  const ubahData = async () => {
    try {
      await updateDoc(
        doc(db, "kategori_uji", editId),
        {
          kode_kategori: kodeKategori,
          nama_kategori: namaKategori,
          durasi: Number(durasi),
        }
      );

      Alert.alert("Sukses", "Data berhasil diupdate");

      resetForm();
      tampilData();
    } catch (error) {
      console.log(error);
    }
  };

  const hapusData = (id: string) => {
    Alert.alert(
      "Konfirmasi",
      "Hapus data ini?",
      [
        {
          text: "Batal",
        },
        {
          text: "Hapus",
          onPress: async () => {
            await deleteDoc(
              doc(db, "kategori_uji", id)
            );

            tampilData();
          },
        },
      ]
    );
  };

  const editData = (item: any) => {
    setEditId(item.id);

    setKodeKategori(item.kode_kategori);
    setNamaKategori(item.nama_kategori);
    setDurasi(item.durasi.toString());
  };

  const resetForm = () => {
    setEditId("");
    setKodeKategori("");
    setNamaKategori("");
    setDurasi("");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.judul}>
        MASTER KATEGORI UJIAN
      </Text>

      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Kode Kategori"
          value={kodeKategori}
          onChangeText={setKodeKategori}
        />

        <TextInput
          style={styles.input}
          placeholder="Nama Kategori"
          value={namaKategori}
          onChangeText={setNamaKategori}
        />

        <TextInput
          style={styles.input}
          placeholder="Durasi (Menit)"
          keyboardType="numeric"
          value={durasi}
          onChangeText={setDurasi}
        />

        {editId === "" ? (
          <TouchableOpacity
            style={styles.btnSimpan}
            onPress={simpanData}
          >
            <Text style={styles.btnText}>
              SIMPAN
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.btnUpdate}
            onPress={ubahData}
          >
            <Text style={styles.btnText}>
              UPDATE
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.subJudul}>
        DATA KATEGORI UJIAN
      </Text>

      <View style={styles.tableHeader}>
        <Text style={styles.headerText}>Kode</Text>
        <Text style={styles.headerText}>Kategori</Text>
        <Text style={styles.headerText}>Durasi</Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.cell}>
              {item.kode_kategori}
            </Text>

            <Text style={styles.cell}>
              {item.nama_kategori}
            </Text>

            <Text style={styles.cell}>
              {item.durasi}
            </Text>

            <View style={styles.actionContainer}>
              <TouchableOpacity
                style={styles.btnEdit}
                onPress={() =>
                  editData(item)
                }
              >
                <Text style={styles.actionText}>
                  Edit
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnDelete}
                onPress={() =>
                  hapusData(item.id)
                }
              >
                <Text style={styles.actionText}>
                  Hapus
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  judul: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 15,
  },

  card: {
    backgroundColor: "#fff",
    margin: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 3,
  },

  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },

  btnSimpan: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 8,
  },

  btnUpdate: {
    backgroundColor: "#16a34a",
    padding: 14,
    borderRadius: 8,
  },

  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },

  subJudul: {
    fontSize: 18,
    fontWeight: "bold",
    margin: 10,
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1e293b",
    padding: 10,
  },

  headerText: {
    flex: 1,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },

  row: {
    backgroundColor: "#fff",
    marginHorizontal: 10,
    marginBottom: 5,
    padding: 10,
    borderRadius: 8,
  },

  cell: {
    textAlign: "center",
    marginBottom: 5,
  },

  actionContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 5,
  },

  btnEdit: {
    backgroundColor: "#f59e0b",
    padding: 8,
    borderRadius: 5,
    marginRight: 5,
  },

  btnDelete: {
    backgroundColor: "#dc2626",
    padding: 8,
    borderRadius: 5,
  },

  actionText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

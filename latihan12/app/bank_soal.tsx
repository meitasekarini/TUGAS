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

import { Picker } from "@react-native-picker/picker";

import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    updateDoc,
} from "firebase/firestore";

import { db } from "../config/firebase";

export default function BankSoal() {
  const [kategoriList, setKategoriList] = useState<any[]>([]);
  const [soalList, setSoalList] = useState<any[]>([]);

  const [editId, setEditId] = useState("");

  const [kodeKategori, setKodeKategori] = useState("");
  const [namaKategori, setNamaKategori] = useState("");

  const [pertanyaan, setPertanyaan] = useState("");
  const [pilihanA, setPilihanA] = useState("");
  const [pilihanB, setPilihanB] = useState("");
  const [pilihanC, setPilihanC] = useState("");
  const [pilihanD, setPilihanD] = useState("");
  const [jawabanBenar, setJawabanBenar] = useState("A");

  useEffect(() => {
    loadKategori();
    loadSoal();
  }, []);

  const loadKategori = async () => {
    const snapshot = await getDocs(
      collection(db, "kategori_uji")
    );

    const data: any[] = [];

    snapshot.forEach((item) => {
      data.push({
        id: item.id,
        ...item.data(),
      });
    });

    setKategoriList(data);
  };

  const loadSoal = async () => {
    const snapshot = await getDocs(
      collection(db, "bank_soal")
    );

    const data: any[] = [];

    snapshot.forEach((item) => {
      data.push({
        id: item.id,
        ...item.data(),
      });
    });

    setSoalList(data);
  };

  const simpanData = async () => {
    if (
      kodeKategori === "" ||
      pertanyaan === ""
    ) {
      Alert.alert(
        "Peringatan",
        "Lengkapi data terlebih dahulu"
      );
      return;
    }

    await addDoc(
      collection(db, "bank_soal"),
      {
        kode_kategori: kodeKategori,
        nama_kategori: namaKategori,
        pertanyaan,
        pilihan_a: pilihanA,
        pilihan_b: pilihanB,
        pilihan_c: pilihanC,
        pilihan_d: pilihanD,
        jawaban_benar: jawabanBenar,
      }
    );

    Alert.alert(
      "Sukses",
      "Soal berhasil disimpan"
    );

    resetForm();
    loadSoal();
  };

  const updateData = async () => {
    await updateDoc(
      doc(db, "bank_soal", editId),
      {
        kode_kategori: kodeKategori,
        nama_kategori: namaKategori,
        pertanyaan,
        pilihan_a: pilihanA,
        pilihan_b: pilihanB,
        pilihan_c: pilihanC,
        pilihan_d: pilihanD,
        jawaban_benar: jawabanBenar,
      }
    );

    Alert.alert(
      "Sukses",
      "Soal berhasil diupdate"
    );

    resetForm();
    loadSoal();
  };

  const hapusData = async (id: string) => {
    Alert.alert(
      "Konfirmasi",
      "Hapus soal?",
      [
        { text: "Tidak" },
        {
          text: "Ya",
          onPress: async () => {
            await deleteDoc(
              doc(db, "bank_soal", id)
            );

            loadSoal();
          },
        },
      ]
    );
  };

  const editData = (item: any) => {
    setEditId(item.id);

    setKodeKategori(item.kode_kategori);
    setNamaKategori(item.nama_kategori);

    setPertanyaan(item.pertanyaan);
    setPilihanA(item.pilihan_a);
    setPilihanB(item.pilihan_b);
    setPilihanC(item.pilihan_c);
    setPilihanD(item.pilihan_d);
    setJawabanBenar(item.jawaban_benar);
  };

  const resetForm = () => {
    setEditId("");
    setKodeKategori("");
    setNamaKategori("");

    setPertanyaan("");
    setPilihanA("");
    setPilihanB("");
    setPilihanC("");
    setPilihanD("");
    setJawabanBenar("A");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        MASTER BANK SOAL
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>
          Kategori Ujian
        </Text>

        <Picker
          selectedValue={kodeKategori}
          onValueChange={(value) => {
            const pilih =
              kategoriList.find(
                (x) =>
                  x.kode_kategori === value
              );

            setKodeKategori(value);

            if (pilih) {
              setNamaKategori(
                pilih.nama_kategori
              );
            }
          }}
        >
          <Picker.Item
            label="Pilih Kategori"
            value=""
          />

          {kategoriList.map((item) => (
            <Picker.Item
              key={item.id}
              label={`${item.kode_kategori} - ${item.nama_kategori}`}
              value={item.kode_kategori}
            />
          ))}
        </Picker>

        <TextInput
          style={styles.input}
          placeholder="Pertanyaan"
          value={pertanyaan}
          onChangeText={setPertanyaan}
        />

        <TextInput
          style={styles.input}
          placeholder="Pilihan A"
          value={pilihanA}
          onChangeText={setPilihanA}
        />

        <TextInput
          style={styles.input}
          placeholder="Pilihan B"
          value={pilihanB}
          onChangeText={setPilihanB}
        />

        <TextInput
          style={styles.input}
          placeholder="Pilihan C"
          value={pilihanC}
          onChangeText={setPilihanC}
        />

        <TextInput
          style={styles.input}
          placeholder="Pilihan D"
          value={pilihanD}
          onChangeText={setPilihanD}
        />

        <Text style={styles.label}>
          Jawaban Benar
        </Text>

        <Picker
          selectedValue={jawabanBenar}
          onValueChange={setJawabanBenar}
        >
          <Picker.Item
            label="A"
            value="A"
          />
          <Picker.Item
            label="B"
            value="B"
          />
          <Picker.Item
            label="C"
            value="C"
          />
          <Picker.Item
            label="D"
            value="D"
          />
        </Picker>

        {editId === "" ? (
          <TouchableOpacity
            style={styles.saveButton}
            onPress={simpanData}
          >
            <Text style={styles.buttonText}>
              SIMPAN
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.updateButton}
            onPress={updateData}
          >
            <Text style={styles.buttonText}>
              UPDATE
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.subtitle}>
        DATA BANK SOAL
      </Text>

      <FlatList
        data={soalList}
        scrollEnabled={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.dataCard}>
            <Text>
              <Text
                style={{ fontWeight: "bold" }}
              >
                Kategori:
              </Text>{" "}
              {item.nama_kategori}
            </Text>

            <Text>
              <Text
                style={{ fontWeight: "bold" }}
              >
                Soal:
              </Text>{" "}
              {item.pertanyaan}
            </Text>

            <Text>
              Jawaban Benar :
              {item.jawaban_benar}
            </Text>

            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                style={styles.editButton}
                onPress={() =>
                  editData(item)
                }
              >
                <Text
                  style={styles.buttonText}
                >
                  Edit
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() =>
                  hapusData(item.id)
                }
              >
                <Text
                  style={styles.buttonText}
                >
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
    backgroundColor: "#0a5096",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },

  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    margin: 10,
  },

  card: {
    backgroundColor: "#0b0ed6",
    margin: 10,
    padding: 15,
    borderRadius: 10,
  },

  label: {
    fontWeight: "bold",
    marginTop: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
  },

  saveButton: {
    backgroundColor: "#2563eb",
    marginTop: 15,
    padding: 12,
    borderRadius: 8,
  },

  updateButton: {
    backgroundColor: "#16a34a",
    marginTop: 15,
    padding: 12,
    borderRadius: 8,
  },

  editButton: {
    backgroundColor: "#f59e0b",
    padding: 10,
    borderRadius: 8,
    marginRight: 5,
  },

  deleteButton: {
    backgroundColor: "#dc2626",
    padding: 10,
    borderRadius: 8,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },

  dataCard: {
    backgroundColor: "#fff",
    margin: 10,
    padding: 10,
    borderRadius: 10,
  },
});

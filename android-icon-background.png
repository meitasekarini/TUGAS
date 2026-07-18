Mahasiswa;

import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Mahasiswa() {
  const [nim, setNim] = useState("");
  const [nama, setNama] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const simpanData = () => {
    if (nim === "" || nama === "") {
      alert("Data belum lengkap");
      return;
    }

    if (editIndex !== null) {
      const update = [...data];
      update[editIndex] = { nim, nama };
      setData(update);
      setEditIndex(null);
    } else {
      setData([...data, { nim, nama }]);
    }

    setNim("");
    setNama("");
  };

  const editData = (index: number) => {
    setNim(data[index].nim);
    setNama(data[index].nama);
    setEditIndex(index);
  };

  const hapusData = (index: number) => {
    const hapus = data.filter((_, i) => i !== index);
    setData(hapus);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>DATA MAHASISWA</Text>

      <TextInput
        placeholder="NIM"
        style={styles.input}
        value={nim}
        onChangeText={setNim}
      />

      <TextInput
        placeholder="Nama Mahasiswa"
        style={styles.input}
        value={nama}
        onChangeText={setNama}
      />

      <TouchableOpacity style={styles.button} onPress={simpanData}>
        <Text style={styles.textButton}>
          {editIndex !== null ? "UPDATE" : "SIMPAN"}
        </Text>
      </TouchableOpacity>

      {/* Header Tabel */}
      <View style={styles.tableHeader}>
        <Text style={styles.headerCell}>No</Text>
        <Text style={styles.headerCell}>NIM</Text>
        <Text style={styles.headerCell}>Nama</Text>
        <Text style={styles.headerCell}>Aksi</Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.tableRow}>
            <Text style={styles.cell}>{index + 1}</Text>
            <Text style={styles.cell}>{item.nim}</Text>
            <Text style={styles.cell}>{item.nama}</Text>

            <View style={styles.action}>
              <TouchableOpacity
                style={styles.edit}
                onPress={() => editData(index)}
              >
                <Text style={styles.textButton}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.delete}
                onPress={() => hapusData(index)}
              >
                <Text style={styles.textButton}>Hapus</Text>
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
    padding: 20,
  },

  title: {
    fontSize: 22,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },

  button: {
    backgroundColor: "blue",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },

  textButton: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#444",
    padding: 10,
  },

  headerCell: {
    flex: 1,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },

  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    alignItems: "center",
  },

  cell: {
    flex: 1,
    textAlign: "center",
  },

  action: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },

  edit: {
    backgroundColor: "orange",
    padding: 5,
    borderRadius: 5,
  },

  delete: {
    backgroundColor: "red",
    padding: 5,
    borderRadius: 5,
  },
});

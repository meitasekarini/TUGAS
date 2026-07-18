import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";

import { db } from "../config/firebase";

import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

export default function HasilUji() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    try {
      const snapshot = await getDocs(
        collection(db, "hasil_uji")
      );

      const hasil: any[] = [];

      snapshot.forEach((item) => {
        hasil.push({
          id: item.id,
          ...item.data(),
        });
      });

      setData(hasil);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  const hapusData = (id: string) => {
    Alert.alert(
      "Konfirmasi",
      "Hapus data peserta?",
      [
        {
          text: "Batal",
        },
        {
          text: "Hapus",
          onPress: async () => {
            await deleteDoc(
              doc(db, "hasil_uji", id)
            );

            loadData();
          },
        },
      ]
    );
  };

  const cetakPDF = async () => {
    const jumlahPeserta = data.length;

    const rataRata =
      data.length > 0
        ? (
            data.reduce(
              (a, b) =>
                a + Number(b.nilai),
              0
            ) / data.length
          ).toFixed(2)
        : "0";

    const jumlahLulus =
      data.filter(
        (x) =>
          Number(x.nilai) >= 75
      ).length;

    const jumlahTidakLulus =
      data.filter(
        (x) =>
          Number(x.nilai) < 75
      ).length;

    const rows = data
      .map(
        (item, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${item.nim}</td>
          <td>${item.nama}</td>
          <td>${item.kategori}</td>
          <td>${item.benar}</td>
          <td>${item.salah}</td>
          <td>${item.nilai}</td>
        </tr>
      `
      )
      .join("");

    const html = `
    <html>
    <head>
      <style>

      body{
        font-family: Arial;
        padding:20px;
      }

      .header{
        text-align:center;
      }

      .kampus{
        font-size:24px;
        font-weight:bold;
      }

      .judul{
        font-size:20px;
        margin-top:10px;
        font-weight:bold;
      }

      .subjudul{
        margin-top:5px;
      }

      table{
        width:100%;
        border-collapse:collapse;
        margin-top:20px;
      }

      th{
        background:#dbeafe;
      }

      td,th{
        border:1px solid black;
        padding:8px;
        text-align:center;
      }

      .summary{
        margin-top:20px;
        font-size:14px;
      }

      .ttd{
        margin-top:80px;
        width:100%;
      }

      .ttd td{
        border:none;
      }

      </style>
    </head>

    <body>

      <div class="header">

        <div class="kampus">
          STIKOM POLTEK CIREBON
        </div>

        <div>
          PROGRAM STUDI TEKNIK INFORMATIKA
        </div>

        <div>
          SISTEM UJI KOMPETENSI MAHASISWA
        </div>

        <hr>

        <div class="judul">
          LAPORAN REKAP HASIL UJIAN
        </div>

        <div class="subjudul">
          Tanggal Cetak :
          ${new Date().toLocaleDateString(
            "id-ID"
          )}
        </div>

      </div>

      <table>

        <tr>
          <th>No</th>
          <th>NIM</th>
          <th>Nama Peserta</th>
          <th>Kategori</th>
          <th>Benar</th>
          <th>Salah</th>
          <th>Nilai</th>
        </tr>

        ${rows}

      </table>

      <div class="summary">

        <p>
          <b>Jumlah Peserta :</b>
          ${jumlahPeserta}
        </p>

        <p>
          <b>Rata-rata Nilai :</b>
          ${rataRata}
        </p>

        <p>
          <b>Jumlah Lulus :</b>
          ${jumlahLulus}
        </p>

        <p>
          <b>Jumlah Tidak Lulus :</b>
          ${jumlahTidakLulus}
        </p>

      </div>

      <table class="ttd">

        <tr>

          <td>
            Mengetahui,
            <br>
            Ketua Program Studi
            <br><br><br><br><br>

            (____________________)
            <br>
            NIDN :
          </td>

          <td>
            Penguji
            <br><br><br><br><br>

            (____________________)
            <br>
            NIDN :
          </td>

        </tr>

      </table>

    </body>
    </html>
    `;

    const pdf =
      await Print.printToFileAsync({
        html,
      });

    await Sharing.shareAsync(
      pdf.uri
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        HASIL UJIAN PESERTA
      </Text>

      <TouchableOpacity
        style={styles.btnCetak}
        onPress={cetakPDF}
      >
        <Text style={styles.btnText}>
          CETAK LAPORAN PDF
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btnRefresh}
        onPress={loadData}
      >
        <Text style={styles.btnText}>
          REFRESH DATA
        </Text>
      </TouchableOpacity>

      <View style={styles.headerTable}>
        <Text style={styles.headerCell}>
          NIM
        </Text>

        <Text style={styles.headerCell}>
          Nama
        </Text>

        <Text style={styles.headerCell}>
          Nilai
        </Text>
      </View>

      <FlatList
        data={data}
        scrollEnabled={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.cell}>
              {item.nim}
            </Text>

            <Text style={styles.cell}>
              {item.nama}
            </Text>

            <Text style={styles.cell}>
              {item.nilai}
            </Text>

            <TouchableOpacity
              style={styles.btnHapus}
              onPress={() =>
                hapusData(item.id)
              }
            >
              <Text
                style={{
                  color: "#fff",
                }}
              >
                Hapus
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={styles.summaryBox}>
        <Text
          style={styles.summaryTitle}
        >
          Ringkasan
        </Text>

        <Text>
          Jumlah Peserta :
          {" "}
          {data.length}
        </Text>

        <Text>
          Lulus :
          {" "}
          {
            data.filter(
              (x) =>
                Number(
                  x.nilai
                ) >= 75
            ).length
          }
        </Text>

        <Text>
          Tidak Lulus :
          {" "}
          {
            data.filter(
              (x) =>
                Number(
                  x.nilai
                ) < 75
            ).length
          }
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 15,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },

  btnCetak: {
    backgroundColor: "#16a34a",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },

  btnRefresh: {
    backgroundColor: "#2563eb",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },

  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },

  headerTable: {
    flexDirection: "row",
    backgroundColor: "#1e293b",
    padding: 10,
  },

  headerCell: {
    flex: 1,
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },

  row: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 5,
    alignItems: "center",
  },

  cell: {
    flex: 1,
    textAlign: "center",
  },

  btnHapus: {
    backgroundColor: "#dc2626",
    padding: 8,
    borderRadius: 5,
  },

  summaryBox: {
    marginTop: 20,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
  },

  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

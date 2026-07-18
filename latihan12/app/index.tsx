import { router } from "expo-router";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function Dashboard() {
  const menus = [
    {
      title: "Kategori Ujian",
      icon: "📚",
      page: "/kategori_uji",
      color: "#2563eb",
    },
    {
      title: "Bank Soal",
      icon: "❓",
      page: "/bank_soal",
      color: "#16a34a",
    },
    {
      title: "Mulai Ujian",
      icon: "📝",
      page: "/ujian",
      color: "#f97316",
    },
    {
      title: "Hasil Ujian",
      icon: "📊",
      page: "/hasil_uji",
      color: "#9333ea",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Sistem Ujikom</Text>
        <Text style={styles.subtitle}>
          React Native + Firebase Firestore
        </Text>
      </View>

      {/* Informasi */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>
          Selamat Datang
        </Text>

        <Text style={styles.infoText}>
          Aplikasi Ujikom digunakan untuk mengelola kategori ujian,
          bank soal, pelaksanaan ujian, serta hasil ujian peserta.
        </Text>
      </View>

      {/* Menu */}
      <Text style={styles.sectionTitle}>
        Menu Utama
      </Text>

      <View style={styles.menuContainer}>
        {menus.map((menu, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.menuCard,
              { backgroundColor: menu.color },
            ]}
            onPress={() => router.push(menu.page as any)}
          >
            <Text style={styles.menuIcon}>
              {menu.icon}
            </Text>

            <Text style={styles.menuText}>
              {menu.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Ujikom React Native
        </Text>

        <Text style={styles.footerSubText}>
          Versi 1.0
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
  },

  header: {
    backgroundColor: "#0f172a",
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },

  title: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#cbd5e1",
    fontSize: 14,
    marginTop: 5,
  },

  infoCard: {
    backgroundColor: "#ffffff",
    margin: 15,
    borderRadius: 15,
    padding: 18,
    elevation: 3,
  },

  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#0f172a",
  },

  infoText: {
    color: "#475569",
    lineHeight: 22,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 15,
    marginBottom: 15,
    color: "#0f172a",
  },

  menuContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },

  menuCard: {
    width: "48%",
    height: 150,
    borderRadius: 20,
    marginBottom: 15,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },

  menuIcon: {
    fontSize: 45,
    marginBottom: 10,
  },

  menuText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },

  footer: {
    alignItems: "center",
    marginVertical: 25,
  },

  footerText: {
    fontWeight: "bold",
    color: "#334155",
  },

  footerSubText: {
    color: "#64748b",
    marginTop: 3,
  },
});

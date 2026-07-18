import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Dashboard" }}
      />

      <Stack.Screen
        name="kategori_uji"
        options={{ title: "Kategori Uji" }}
      />

      <Stack.Screen
        name="bank_soal"
        options={{ title: "Bank Soal" }}
      />

      <Stack.Screen
        name="ujian"
        options={{ title: "Ujian" }}
      />

      <Stack.Screen
        name="hasil_uji"
        options={{ title: "Hasil Uji" }}
      />
    </Stack>
  );
}

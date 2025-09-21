import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, ActivityIndicator, Alert } from "react-native";
import DocumentScanner from "react-native-document-scanner-plugin";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

import { SCAN_API_URL } from "../config/api";

type DocScannerNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "DocumentScanner"
>;

export default function DocumentScannerScreen() {
  const navigation = useNavigation<DocScannerNavigationProp>();
  const isFocused = useIsFocused();
  const [isProcessing, setIsProcessing] = useState(false);

  // Jalankan pemindai secara otomatis saat layar ini ditampilkan
  useEffect(() => {
    if (isFocused) {
      startScan();
    }
  }, [isFocused]);

  const startScan = async () => {
    // Panggil API dari pustaka untuk membuka pemindai
    const { scannedImages, status } = await DocumentScanner.scanDocument({
      // Opsi di sini, misalnya:
      // responseType: 'imageFilePath', // default
    });

    // Jika pengguna membatalkan, kembali ke layar sebelumnya
    if (status === "cancel") {
      navigation.goBack();
      return;
    }

    // Jika ada gambar yang dipindai, proses gambar pertama
    if (scannedImages && scannedImages.length > 0) {
      handlePictureTaken(scannedImages[0]);
    } else {
      navigation.goBack();
    }
  };

  const handlePictureTaken = async (imageUri: string) => {
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append("image", {
        uri: imageUri,
        name: "document.jpg",
        type: "image/jpeg",
      } as any);

      const response = await fetch(SCAN_API_URL, {
        method: "POST",
        body: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Gagal memindai.");

      // Gunakan .replace() agar pengguna tidak bisa kembali ke layar pemindai
      navigation.replace("ScanResult", { scannedText: result.scannedText });
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", "Gagal memproses gambar, silakan coba lagi.");
      navigation.goBack();
    } finally {
      setIsProcessing(false);
    }
  };

  // Tampilkan layar loading saat memproses
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.statusText}>
        {isProcessing ? "Memproses gambar..." : "Membuka pemindai..."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  statusText: {
    marginTop: 20,
    fontSize: 16,
    color: "white",
  },
});

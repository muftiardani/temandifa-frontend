import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import { RootStackParamList } from "../types/navigation";

import { SCAN_API_URL } from "../config/api";

type ScanScreenProps = NativeStackScreenProps<RootStackParamList, "Scan">;

const ScanScreen: React.FC<ScanScreenProps> = ({ navigation }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  // Fungsi ini mengarahkan ke layar pemindai dokumen kustom
  const handleKameraPress = () => {
    navigation.navigate("DocumentScanner");
  };

  // Fungsi ini menangani unggahan gambar dari galeri
  const handleUnggahPress = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Izin Diperlukan",
        "Anda perlu memberikan izin galeri untuk menggunakan fitur ini."
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets[0].uri) {
      uploadImageForScan(result.assets[0].uri);
    }
  };

  // Fungsi untuk mengunggah dan memproses gambar yang dipilih dari galeri
  const uploadImageForScan = async (uri: string) => {
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append("image", {
        uri: uri,
        name: "upload.jpg",
        type: "image/jpeg",
      } as any);

      const response = await fetch(SCAN_API_URL, {
        method: "POST",
        body: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Gagal terhubung ke server.");

      navigation.navigate("ScanResult", { scannedText: data.scannedText });
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "Gagal memindai gambar. Silakan coba lagi."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan Dokumen</Text>
      </View>

      {/* Konten Utama */}
      <View style={styles.content}>
        {isProcessing ? (
          <View style={styles.placeholderContainer}>
            <ActivityIndicator size="large" color="#3F7EF3" />
            <Text style={styles.placeholderText}>Sedang memproses...</Text>
          </View>
        ) : (
          <View style={styles.placeholderContainer}>
            <Ionicons name="document-text-outline" size={100} color="#E0E0E0" />
            <Text style={styles.placeholderText}>Pilih metode pemindaian</Text>
          </View>
        )}

        {/* Tombol-tombol Aksi */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cameraButton]}
            onPress={handleKameraPress}
            disabled={isProcessing}
          >
            <Ionicons name="camera" size={32} color="white" />
            <Text style={styles.buttonText}>Kamera</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.uploadButton]}
            onPress={handleUnggahPress}
            disabled={isProcessing}
          >
            <Ionicons name="cloud-upload" size={32} color="white" />
            <Text style={styles.buttonText}>Unggah</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  content: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#F7F7F7",
    borderRadius: 16,
  },
  placeholderText: {
    marginTop: 10,
    color: "#A0A0A0",
    fontSize: 16,
  },
  buttonContainer: {
    width: "100%",
    paddingTop: 20,
  },
  button: {
    width: "100%",
    height: 100,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 20,
    marginBottom: 16,
  },
  cameraButton: {
    backgroundColor: "#ED6A5A",
  },
  uploadButton: {
    backgroundColor: "#17BEBB",
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 8,
  },
});

export default ScanScreen;

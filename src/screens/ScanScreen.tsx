import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
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
  const [pickedImage, setPickedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const uploadImageForScan = async (uri: string) => {
    setIsScanning(true);
    setPickedImage(uri);

    const formData = new FormData();
    formData.append("image", {
      uri,
      name: "scan.jpg",
      type: "image/jpeg",
    } as any);

    try {
      const response = await fetch(SCAN_API_URL, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal terhubung ke server.");
      }

      navigation.navigate("ScanResult", { scannedText: data.scannedText });
    } catch (error: any) {
      console.error(error);
      Alert.alert(
        "Error",
        error.message || "Gagal memindai gambar. Silakan coba lagi."
      );
    } finally {
      setIsScanning(false);
      setPickedImage(null);
    }
  };

  const handleKameraPress = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Izin Diperlukan", "Anda perlu memberikan izin kamera.");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0].uri) {
      uploadImageForScan(result.assets[0].uri);
    }
  };

  const handleUnggahPress = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Izin Diperlukan", "Anda perlu memberikan izin galeri.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0].uri) {
      uploadImageForScan(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan</Text>
      </View>

      <View style={styles.content}>
        {isScanning ? (
          <View style={styles.placeholderContainer}>
            <ActivityIndicator size="large" color="#3F7EF3" />
            <Text style={styles.placeholderText}>
              Mengirim & memindai teks...
            </Text>
            {pickedImage && (
              <Image
                source={{ uri: pickedImage }}
                style={styles.imagePreviewSmall}
              />
            )}
          </View>
        ) : (
          <View style={styles.placeholderContainer}>
            <Ionicons name="image-outline" size={100} color="#E0E0E0" />
            <Text style={styles.placeholderText}>
              Pilih gambar untuk dipindai
            </Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cameraButton]}
            onPress={handleKameraPress}
            disabled={isScanning}
          >
            <Ionicons name="camera" size={32} color="white" />
            <Text style={styles.buttonText}>Kamera</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.uploadButton]}
            onPress={handleUnggahPress}
            disabled={isScanning}
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
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
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
  imagePreviewSmall: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 20,
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
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 8,
  },
});

export default ScanScreen;

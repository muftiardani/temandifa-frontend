import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, ActivityIndicator } from "react-native";
import DocumentScanner from "react-native-document-scanner-plugin";
import * as Speech from "expo-speech";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { apiService } from "../services/api";
import { useAppTheme } from "../hooks/useAppTheme";
import { useAppStore } from "../store/appStore";

type DocScannerNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "DocumentScanner"
>;

export default function DocumentScannerScreen() {
  const navigation = useNavigation<DocScannerNavigationProp>();
  const isFocused = useIsFocused();
  const [isProcessing, setIsProcessing] = useState(false);
  const { t, colors } = useAppTheme();
  const language = useAppStore((state) => state.language);

  useEffect(() => {
    Speech.stop();
    if (isFocused) {
      startScan();
    }
  }, [isFocused]);

  const startScan = async () => {
    try {
      const { scannedImages, status } = await DocumentScanner.scanDocument();
      if (status === "cancel") {
        navigation.goBack();
        return;
      }
      if (scannedImages && scannedImages.length > 0) {
        handlePictureTaken(scannedImages[0]);
      } else {
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error during document scan:", error);
      navigation.goBack();
    }
  };

  const handlePictureTaken = async (imageUri: string) => {
    setIsProcessing(true);
    Speech.speak(t.scanResult.imageTakenProcessing, {
      language: language === "id" ? "id-ID" : "en-US",
    });
    try {
      const result = await apiService.scanImage(imageUri);
      if (result) {
        navigation.replace("ScanResult", { scannedText: result.scannedText });
      }
    } catch (error) {
      Speech.speak(t.scanResult.imageProcessingFailed, {
        language: language === "id" ? "id-ID" : "en-US",
      });
      navigation.goBack();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.statusText}>
        {isProcessing
          ? t.scanResult.imageProcessing
          : t.scanResult.scannerOpening}
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
    color: "#FFFFFF",
  },
});

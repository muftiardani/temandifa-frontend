import React, { useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import DocumentScanner from "react-native-document-scanner-plugin";
import * as Speech from "expo-speech";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { RootStackParamList } from "../types/navigation";
import { apiService } from "../services/apiService";
import { useAppTheme } from "../hooks/useAppTheme";
import { useAppStore } from "../store/appStore";

type DocScannerNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "DocumentScanner"
>;

export default function DocumentScannerScreen() {
  const navigation = useNavigation<DocScannerNavigationProp>();
  const isFocused = useIsFocused();
  const { t } = useTranslation();
  const { colors } = useAppTheme();

  const isLoading = useAppStore((state) => state.isLoading);
  const setIsLoading = useAppStore((state) => state.setIsLoading);
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
    setIsLoading(true);
    Speech.speak(t("scanResult.imageTakenProcessing"), {
      language: language === "id" ? "id-ID" : "en-US",
    });
    try {
      const result = await apiService.scanImage(imageUri);
      if (result) {
        navigation.replace("ScanResult", { scannedText: result.scannedText });
      } else {
        navigation.goBack();
      }
    } catch (error: any) {
      const errorMessage =
        error.message === "networkError"
          ? t("general.networkError")
          : error.message === "serverError"
          ? t("general.serverError")
          : t("scanResult.imageProcessingFailed");
      Speech.speak(errorMessage, {
        language: language === "id" ? "id-ID" : "en-US",
      });
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.overlay }]}>
      <Text style={[styles.statusText, { color: colors.white }]}>
        {isLoading
          ? t("scanResult.imageProcessing")
          : t("scanResult.scannerOpening")}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  statusText: {
    fontSize: 16,
  },
});

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useTranslation } from "react-i18next";

import { RootStackParamList } from "../types/navigation";
import { apiService } from "../services/apiService";
import LoadingIndicator from "../components/common/LoadingIndicator";
import { useAppTheme } from "../hooks/useAppTheme";
import { AnimationDurations } from "../constants/animations";
import AnimatedPressable from "../components/common/AnimatedPressable";

type ScanScreenProps = NativeStackScreenProps<RootStackParamList, "Scan">;

const ScanScreen: React.FC<ScanScreenProps> = ({ navigation }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { t } = useTranslation();
  const { colors } = useAppTheme();

  const placeholderTranslateY = useSharedValue(0);

  useEffect(() => {
    placeholderTranslateY.value = withRepeat(
      withSequence(
        withTiming(-10, {
          duration: AnimationDurations.scanScreenPlaceholder,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(0, {
          duration: AnimationDurations.scanScreenPlaceholder,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      true
    );
  }, []);

  const animatedPlaceholderStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: placeholderTranslateY.value }],
  }));

  const handleKameraPress = () => navigation.navigate("DocumentScanner");

  const handleUnggahPress = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Toast.show({
        type: "info",
        text1: t("general.error"),
        text2: t("permissions.gallery"),
      });
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      uploadImageForScan(result.assets[0].uri);
    }
  };

  const uploadImageForScan = async (uri: string) => {
    setIsProcessing(true);
    try {
      const data = await apiService.scanImage(uri);
      if (data) {
        navigation.navigate("ScanResult", { scannedText: data.scannedText });
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: t("general.failure"),
        text2: error.message || t("general.genericError"),
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityLabel={`${t("general.back")}. Tombol`}
          accessibilityRole="button"
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.headerText }]}>
          {t("scanScreen.title")}
        </Text>
      </View>

      <View style={styles.content}>
        {isProcessing ? (
          <LoadingIndicator text={t("scanScreen.processing")} />
        ) : (
          <Animated.View
            style={[
              styles.placeholderContainer,
              { backgroundColor: colors.placeholder },
              animatedPlaceholderStyle,
            ]}
          >
            <Ionicons
              name="document-text-outline"
              size={100}
              color={colors.placeholderIcon}
            />
            <Text
              style={[
                styles.placeholderText,
                { color: colors.textPlaceholder },
              ]}
            >
              {t("scanScreen.placeholder")}
            </Text>
          </Animated.View>
        )}

        <View style={styles.buttonContainer}>
          <AnimatedPressable
            style={[styles.button, { backgroundColor: colors.accent }]}
            onPress={handleKameraPress}
            disabled={isProcessing}
            accessibilityLabel={`${t("scanScreen.camera")}. Tombol`}
            accessibilityHint="Membuka kamera untuk memindai dokumen"
            accessibilityRole="button"
          >
            <Ionicons name="camera" size={32} color={colors.white} />
            <Text style={styles.buttonText}>{t("scanScreen.camera")}</Text>
          </AnimatedPressable>

          <AnimatedPressable
            style={[styles.button, { backgroundColor: colors.secondary }]}
            onPress={handleUnggahPress}
            disabled={isProcessing}
            accessibilityLabel={`${t("scanScreen.upload")}. Tombol`}
            accessibilityHint="Mengunggah gambar dari galeri untuk dipindai"
            accessibilityRole="button"
          >
            <Ionicons name="cloud-upload" size={32} color={colors.white} />
            <Text style={styles.buttonText}>{t("scanScreen.upload")}</Text>
          </AnimatedPressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
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
    borderRadius: 16,
  },
  placeholderText: {
    marginTop: 10,
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
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 8,
  },
});

export default ScanScreen;

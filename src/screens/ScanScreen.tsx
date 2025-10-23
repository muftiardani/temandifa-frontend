import React, { useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
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
import { useAppStore } from "../store/appStore";
import ScreenHeader from "../components/common/ScreenHeader";

type ScanScreenProps = NativeStackScreenProps<RootStackParamList, "Scan">;

const ScanScreen: React.FC<ScanScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const isLoading = useAppStore((state) => state.isLoading);
  const setIsLoading = useAppStore((state) => state.setIsLoading);

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
  }, [placeholderTranslateY]);

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
    setIsLoading(true);
    try {
      const data = await apiService.scanImage(uri);
      if (data) {
        navigation.navigate("ScanResult", { scannedText: data.scannedText });
      }
    } catch (error: any) {
      const errorMessage =
        error.message === "networkError"
          ? t("general.networkError")
          : error.message === "serverError"
          ? t("general.serverError")
          : t("general.genericError");
      Toast.show({
        type: "error",
        text1: t("general.failure"),
        text2: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title={t("scanScreen.title")} />
      <View style={styles.contentContainer}>
        <View style={styles.content}>
          {isLoading ? (
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
              disabled={isLoading}
              accessibilityLabel={
                t("scanScreen.camera") + t("general.accessibility.buttonSuffix")
              }
              accessibilityHint={t("scanScreen.accessibility.cameraHint")}
              accessibilityRole="button"
            >
              <Ionicons name="camera" size={32} color={colors.white} />
              <Text style={[styles.buttonText, { color: colors.buttonText }]}>
                {t("scanScreen.camera")}
              </Text>
            </AnimatedPressable>

            <AnimatedPressable
              style={[styles.button, { backgroundColor: colors.secondary }]}
              onPress={handleUnggahPress}
              disabled={isLoading}
              accessibilityLabel={
                t("scanScreen.upload") + t("general.accessibility.buttonSuffix")
              }
              accessibilityHint={t("scanScreen.accessibility.uploadHint")}
              accessibilityRole="button"
            >
              <Ionicons name="cloud-upload" size={32} color={colors.white} />
              <Text style={[styles.buttonText, { color: colors.buttonText }]}>
                {t("scanScreen.upload")}
              </Text>
            </AnimatedPressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
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
    marginBottom: 20,
  },
  placeholderText: {
    marginTop: 10,
    fontSize: 16,
  },
  buttonContainer: {
    width: "100%",
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
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 8,
  },
});

export default ScanScreen;

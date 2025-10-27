import { useState, useCallback } from "react";
import { Audio } from "expo-av";
import Toast from "react-native-toast-message";
import * as Speech from "expo-speech";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { AppNavigationProp } from "../types/navigation";
import { apiService } from "../services/apiService";
import { useAppStore } from "../store/appStore";

export const useAudioRecorder = () => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const navigation = useNavigation<AppNavigationProp>();
  const { t } = useTranslation();
  const setIsLoading = useAppStore((state) => state.setIsLoading);

  const startRecording = useCallback(async () => {
    try {
      Speech.stop();
      if (permissionResponse?.status !== "granted") {
        const permission = await requestPermission();
        if (!permission.granted) {
          if (!permission.canAskAgain) {
            Toast.show({
              type: "info",
              text1: t("general.error"),
              text2: t("permissions.microphoneDenied"),
            });
          }
          return;
        }
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(newRecording);
      setIsRecording(true);
    } catch (err) {
      console.error("Gagal memulai rekaman", err);
      Toast.show({
        type: "error",
        text1: t("general.error"),
        text2: t("voiceScreen.recordingFailed"),
      });
    }
  }, [permissionResponse, requestPermission, t]);

  const stopRecordingAndTranscribe = useCallback(async () => {
    if (!recording) return;

    setIsRecording(false);
    setIsLoading(true);
    try {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
      const uri = recording.getURI();
      if (!uri) {
        throw new Error("URI rekaman tidak ditemukan.");
      }
      const result = await apiService.transcribeAudio(uri);
      if (result) {
        navigation.navigate("VoiceResult", {
          transcribedText: result.transcribedText,
        });
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error && error.message === "networkError"
          ? t("general.networkError")
          : error instanceof Error && error.message === "serverError"
          ? t("general.serverError")
          : t("general.genericError");
      Toast.show({
        type: "error",
        text1: t("general.failure"),
        text2: errorMessage,
      });
      console.error("Gagal menghentikan/transkripsi rekaman:", error);
    } finally {
      setIsLoading(false);
      setRecording(null);
    }
  }, [recording, navigation, t, setIsLoading]);

  return {
    isRecording,
    startRecording,
    stopRecordingAndTranscribe,
  };
};

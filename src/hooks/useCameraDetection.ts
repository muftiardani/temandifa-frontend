import { useEffect, useRef, useCallback } from "react";
import { AppState, AppStateStatus } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Speech from "expo-speech";
import { useIsFocused } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import { useCameraStore } from "../store/cameraStore";
import { apiService } from "../services/apiService";
import { useAppStore } from "../store/appStore";

export const useCameraDetection = () => {
  const {
    isProcessing,
    detections,
    setIsProcessing,
    setDetections,
    clearDetections,
  } = useCameraStore();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const lastSpokenRef = useRef<{ name: string | null; time: number }>({
    name: null,
    time: 0,
  });
  const isFocused = useIsFocused();
  const { t } = useTranslation();
  const language = useAppStore((state) => state.language);

  const speakTopObject = useCallback(
    (detectedObjects: any[]) => {
      if (detectedObjects.length > 0) {
        const topObject = detectedObjects.sort(
          (a, b) => b.confidence - a.confidence
        )[0];
        const objectName = topObject.class;
        const now = Date.now();

        if (
          lastSpokenRef.current.name !== objectName ||
          now - lastSpokenRef.current.time > 5000
        ) {
          Speech.stop();
          Speech.speak(t("cameraScreen.objectInFront", { objectName }), {
            language: language === "id" ? "id-ID" : "en-US",
          });
          lastSpokenRef.current = { name: objectName, time: now };
        }
      }
    },
    [t, language]
  );

  const takePictureAndDetect = useCallback(
    async (abortController: AbortController) => {
      if (cameraRef.current && !useCameraStore.getState().isProcessing) {
        setIsProcessing(true);
        try {
          const photo = await cameraRef.current.takePictureAsync({
            quality: 0.2,
            skipProcessing: true,
          });
          if (!photo?.uri) return;

          const result = await apiService.detectObject(
            photo.uri,
            abortController.signal
          );
          if (result) {
            setDetections(result);
            speakTopObject(result);
          }
        } catch (error: any) {
          if (error.name !== "AbortError") {
            console.error("Gagal mendeteksi objek:", error);
          }
        } finally {
          setIsProcessing(false);
        }
      }
    },
    [setIsProcessing, setDetections, speakTopObject]
  );

  useEffect(() => {
    const abortController = new AbortController();
    let intervalId: NodeJS.Timeout | null = null;

    const startInterval = () => {
      if (!intervalId)
        intervalId = setInterval(
          () => takePictureAndDetect(abortController),
          2500
        );
    };
    const stopInterval = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (isFocused && permission?.granted) {
        if (nextAppState === "active") startInterval();
        else stopInterval();
      }
    };

    const appStateSubscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    if (isFocused && permission?.granted) startInterval();

    return () => {
      stopInterval();
      abortController.abort();
      appStateSubscription.remove();
      clearDetections();
    };
  }, [isFocused, permission, takePictureAndDetect, clearDetections]);

  return {
    permission,
    requestPermission,
    cameraRef,
    isProcessing,
    detections,
    isFocused,
  };
};

import React, { useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  AppState,
  AppStateStatus,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Speech from "expo-speech";
import { useNavigation, useIsFocused } from "@react-navigation/native";

import { useCameraStore } from "../store/cameraStore";
import { apiService } from "../services/api";
import { Colors } from "../constants/Colors";

const CAM_PREVIEW_WIDTH = Dimensions.get("window").width;
const CAM_PREVIEW_HEIGHT = Dimensions.get("window").height;

export default function CameraScreen() {
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
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const speakTopObject = useCallback((detectedObjects: any[]) => {
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
        Speech.speak(`Di depan ada ${objectName}`, { language: "id-ID" });
        lastSpokenRef.current = { name: objectName, time: now };
      }
    }
  }, []);

  const takePictureAndDetect = useCallback(
    async (abortController: AbortController) => {
      // Gunakan .getState() untuk mendapatkan state terbaru di dalam callback
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
        } catch (error) {
          // Error sudah ditangani oleh service layer
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
      // Pastikan interval tidak duplikat
      if (!intervalId) {
        intervalId = setInterval(
          () => takePictureAndDetect(abortController),
          2500
        );
      }
    };

    const stopInterval = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (isFocused && permission?.granted) {
        if (nextAppState === "active") {
          startInterval();
        } else {
          stopInterval();
        }
      }
    };

    const appStateSubscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    if (isFocused && permission?.granted) {
      startInterval();
    }

    // Cleanup function
    return () => {
      stopInterval();
      abortController.abort(); // Batalkan fetch request yang mungkin sedang berjalan
      appStateSubscription.remove();
      clearDetections(); // Bersihkan state saat meninggalkan layar
    };
  }, [isFocused, permission, takePictureAndDetect, clearDetections]);

  const renderDetections = () =>
    detections.map((detection, i) => {
      const { bbox, confidence, class: className } = detection;
      return (
        <View
          key={i}
          style={[
            styles.bbox,
            {
              top: bbox[1] * CAM_PREVIEW_HEIGHT,
              left: bbox[0] * CAM_PREVIEW_WIDTH,
              width: bbox[2] * CAM_PREVIEW_WIDTH,
              height: bbox[3] * CAM_PREVIEW_HEIGHT,
            },
          ]}
        >
          <Text style={styles.bboxLabel}>{`${className} (${(
            confidence * 100
          ).toFixed(0)}%)`}</Text>
        </View>
      );
    });

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Kami butuh izin Anda untuk menggunakan kamera
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          style={styles.permissionButton}
          accessibilityLabel="Berikan Izin Kamera. Tombol"
        >
          <Text style={styles.buttonText}>Berikan Izin</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isFocused && (
        <CameraView style={styles.camera} facing="back" ref={cameraRef} />
      )}
      <View style={styles.detectionContainer}>{renderDetections()}</View>

      <View style={styles.statusIndicator}>
        <View
          style={[
            styles.statusDot,
            { backgroundColor: isProcessing ? Colors.warning : Colors.success },
          ]}
        />
        <Text style={styles.statusText}>
          {isProcessing ? "Memproses..." : "Siap"}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.doneButton}
        onPress={() => navigation.goBack()}
        accessibilityLabel="Selesai. Tombol"
        accessibilityHint="Kembali ke layar utama"
      >
        <Text style={styles.doneButtonText}>Selesai</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    justifyContent: "center",
    alignItems: "center",
  },
  camera: { width: CAM_PREVIEW_WIDTH, height: CAM_PREVIEW_HEIGHT },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: Colors.black,
  },
  permissionText: { color: Colors.white, textAlign: "center", padding: 20 },
  permissionButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: { color: Colors.white },
  detectionContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  bbox: {
    position: "absolute",
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 5,
  },
  bboxLabel: {
    backgroundColor: Colors.primary,
    color: Colors.white,
    fontSize: 12,
    padding: 2,
    position: "absolute",
    top: -20,
    left: 0,
  },
  doneButton: {
    position: "absolute",
    bottom: 60,
    alignSelf: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingVertical: 16,
    paddingHorizontal: 100,
    borderRadius: 50,
  },
  doneButtonText: { color: Colors.black, fontSize: 18, fontWeight: "600" },
  statusIndicator: {
    position: "absolute",
    top: 60,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  statusText: { color: Colors.white, fontSize: 12 },
});

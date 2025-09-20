import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Speech from "expo-speech";
import { useNavigation, useIsFocused } from "@react-navigation/native";

import { DETECT_API_URL } from "../config/api";

const CAM_PREVIEW_WIDTH = Dimensions.get("window").width;
const CAM_PREVIEW_HEIGHT = Dimensions.get("window").height;

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [detections, setDetections] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const lastSpokenRef = useRef<{ name: string | null; time: number }>({
    name: null,
    time: 0,
  });
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (isFocused && permission?.granted) {
      // Ambil gambar setiap 2.5 detik
      intervalId = setInterval(takePictureAndDetect, 2500);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isFocused, permission]);

  const takePictureAndDetect = async () => {
    if (cameraRef.current && !isProcessing) {
      setIsProcessing(true);
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.4,
        });
        if (!photo) {
          setIsProcessing(false);
          return;
        }

        const formData = new FormData();
        formData.append("image", {
          uri: photo.uri,
          name: "detect.jpg",
          type: "image/jpeg",
        } as any);

        const response = await fetch(DETECT_API_URL, {
          method: "POST",
          body: formData,
          headers: { "Content-Type": "multipart/form-data" },
        });

        const result = await response.json();
        if (response.ok) {
          setDetections(result);
          speakTopObject(result);
        } else {
          console.error("Error dari backend:", result.error);
        }
      } catch (error) {
        console.error("Gagal mengambil atau mengirim gambar:", error);
        setDetections([]);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const speakTopObject = (detectedObjects: any[]) => {
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
  };

  const renderDetections = () => {
    return detections.map((detection, i) => {
      const { bbox, confidence, class: className } = detection;
      const boxStyle = {
        top: bbox[1] * CAM_PREVIEW_HEIGHT,
        left: bbox[0] * CAM_PREVIEW_WIDTH,
        width: bbox[2] * CAM_PREVIEW_WIDTH,
        height: bbox[3] * CAM_PREVIEW_HEIGHT,
      };

      return (
        <View key={i} style={[styles.bbox, boxStyle]}>
          <Text style={styles.bboxLabel}>{`${className} (${(
            confidence * 100
          ).toFixed(0)}%)`}</Text>
        </View>
      );
    });
  };

  if (!permission) {
    return <View style={styles.container} />;
  }
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "white", textAlign: "center", padding: 20 }}>
          Kami butuh izin Anda untuk menggunakan kamera
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          style={styles.permissionButton}
        >
          <Text style={{ color: "white" }}>Berikan Izin</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isFocused && (
        <CameraView style={styles.camera} facing={"back"} ref={cameraRef} />
      )}
      <View style={styles.detectionContainer}>{renderDetections()}</View>
      {isProcessing && (
        <ActivityIndicator
          style={styles.processingIndicator}
          size="large"
          color="#FFF"
        />
      )}
      <TouchableOpacity
        style={styles.doneButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.doneButtonText}>Selesai</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    width: CAM_PREVIEW_WIDTH,
    height: CAM_PREVIEW_HEIGHT,
  },
  permissionButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
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
    borderColor: "#42a5f5",
    borderRadius: 5,
  },
  bboxLabel: {
    backgroundColor: "#42a5f5",
    color: "white",
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
  doneButtonText: {
    color: "black",
    fontSize: 18,
    fontWeight: "600",
  },
  processingIndicator: {
    position: "absolute",
    top: 60,
    right: 20,
  },
});

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { CameraView } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import { useCameraDetection } from "../hooks/useCameraDetection";
import { useAppTheme } from "../hooks/useAppTheme";

const CAM_PREVIEW_WIDTH = Dimensions.get("window").width;
const CAM_PREVIEW_HEIGHT = Dimensions.get("window").height;

export default function CameraScreen() {
  const navigation = useNavigation();
  const { t, colors } = useAppTheme();
  const {
    permission,
    requestPermission,
    cameraRef,
    isProcessing,
    detections,
    isFocused,
  } = useCameraDetection();

  const renderDetections = () =>
    detections.map((detection, i) => (
      <View
        key={i}
        style={[
          styles.bbox,
          {
            borderColor: colors.primary,
            top: detection.bbox[1] * CAM_PREVIEW_HEIGHT,
            left: detection.bbox[0] * CAM_PREVIEW_WIDTH,
            width: detection.bbox[2] * CAM_PREVIEW_WIDTH,
            height: detection.bbox[3] * CAM_PREVIEW_HEIGHT,
          },
        ]}
      >
        <Text style={[styles.bboxLabel, { backgroundColor: colors.primary }]}>
          {`${detection.class} (${(detection.confidence * 100).toFixed(0)}%)`}
        </Text>
      </View>
    ));

  if (!permission)
    return (
      <View
        style={[styles.container, { backgroundColor: colors.background }]}
      />
    );

  if (!permission.granted) {
    return (
      <View
        style={[
          styles.permissionContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <Text style={[styles.permissionText, { color: colors.text }]}>
          {t.permissions.camera}
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          style={[styles.permissionButton, { backgroundColor: colors.primary }]}
          accessibilityLabel={`${t.permissions.grantPermission}. Tombol`}
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>{t.permissions.grantPermission}</Text>
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
            { backgroundColor: isProcessing ? colors.warning : colors.success },
          ]}
        />
        <Text style={styles.statusText}>
          {isProcessing ? t.cameraScreen.processing : t.cameraScreen.ready}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.doneButton}
        onPress={() => navigation.goBack()}
        accessibilityLabel={`${t.cameraScreen.done}. Tombol`}
        accessibilityHint="Kembali ke layar utama"
        accessibilityRole="button"
      >
        <Text style={styles.doneButtonText}>{t.cameraScreen.done}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  camera: { width: CAM_PREVIEW_WIDTH, height: CAM_PREVIEW_HEIGHT },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  permissionText: { textAlign: "center", padding: 20 },
  permissionButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: { color: "#fff" },
  detectionContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  bbox: { position: "absolute", borderWidth: 2, borderRadius: 5 },
  bboxLabel: {
    color: "#fff",
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
  doneButtonText: { color: "#000", fontSize: 18, fontWeight: "600" },
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
  statusText: { color: "#fff", fontSize: 12 },
});

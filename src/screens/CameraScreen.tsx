import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { CameraView } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useCameraDetection } from "../hooks/useCameraDetection";
import { useAppTheme } from "../hooks/useAppTheme";

export default function CameraScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { colors } = useAppTheme();
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
            top: `${detection.bbox[1] * 100}%`,
            left: `${detection.bbox[0] * 100}%`,
            width: `${detection.bbox[2] * 100}%`,
            height: `${detection.bbox[3] * 100}%`,
          },
        ]}
      >
        <Text
          style={[
            styles.bboxLabel,
            { backgroundColor: colors.primary, color: colors.white },
          ]}
        >
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
    if (!permission.canAskAgain) {
      return (
        <View
          style={[
            styles.permissionContainer,
            { backgroundColor: colors.background },
          ]}
        >
          <Text style={[styles.permissionText, { color: colors.text }]}>
            {t("permissions.cameraDenied")}
          </Text>
        </View>
      );
    }

    return (
      <View
        style={[
          styles.permissionContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <Text style={[styles.permissionText, { color: colors.text }]}>
          {t("permissions.camera")}
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          style={[styles.permissionButton, { backgroundColor: colors.primary }]}
          accessibilityLabel={
            t("permissions.grantPermission") +
            t("general.accessibility.buttonSuffix")
          }
          accessibilityRole="button"
        >
          <Text style={[styles.buttonText, { color: colors.buttonText }]}>
            {t("permissions.grantPermission")}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.black }]}>
      {isFocused && (
        <CameraView style={styles.camera} facing="back" ref={cameraRef} />
      )}
      <View style={styles.detectionContainer}>{renderDetections()}</View>

      <View
        style={[
          styles.statusIndicator,
          { backgroundColor: colors.cameraStatusBackground },
        ]}
      >
        <View
          style={[
            styles.statusDot,
            { backgroundColor: isProcessing ? colors.warning : colors.success },
          ]}
        />
        <Text
          style={[styles.statusText, { color: colors.white }]}
          accessibilityLiveRegion="polite"
        >
          {isProcessing
            ? t("cameraScreen.processing")
            : t("cameraScreen.ready")}{" "}
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.doneButton,
          { backgroundColor: colors.cameraButtonBackground },
        ]}
        onPress={() => navigation.goBack()}
        accessibilityLabel={
          t("cameraScreen.done") + t("general.accessibility.buttonSuffix")
        }
        accessibilityHint={t("cameraScreen.accessibility.doneHint")}
        accessibilityRole="button"
      >
        <Text
          style={[styles.doneButtonText, { color: colors.cameraButtonText }]}
        >
          {t("cameraScreen.done")}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  camera: { ...StyleSheet.absoluteFillObject },
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
  buttonText: {},
  detectionContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  bbox: { position: "absolute", borderWidth: 2, borderRadius: 5 },
  bboxLabel: {
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
    paddingVertical: 16,
    paddingHorizontal: 100,
    borderRadius: 50,
  },
  doneButtonText: {
    fontSize: 18,
    fontWeight: "600",
  },
  statusIndicator: {
    position: "absolute",
    top: 60,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  statusText: { fontSize: 12 },
});

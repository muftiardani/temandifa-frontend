import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { CameraView, useCameraPermissions, CameraType } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../constants/Colors";
import { Strings } from "../constants/Strings";

const VideoCallScreen = () => {
  const [facing, setFacing] = useState<CameraType>("front");
  const [permission, requestPermission] = useCameraPermissions();
  const navigation = useNavigation();

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={{ textAlign: "center", marginBottom: 16 }}>
          {Strings.permissions.camera}
        </Text>
        <TouchableOpacity
          style={styles.buttonBase}
          onPress={requestPermission}
          accessibilityLabel={`${Strings.permissions.grantPermission}. Tombol`}
        >
          <Text style={{ color: Colors.white }}>
            {Strings.permissions.grantPermission}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.flipButton}
            onPress={toggleCameraFacing}
            accessibilityLabel={`${Strings.videoCall.flipCamera}. Tombol`}
            accessibilityHint="Mengganti antara kamera depan dan belakang"
          >
            <Ionicons name="camera-reverse" size={28} color={Colors.black} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.endCallButton}
            onPress={() => navigation.goBack()}
            accessibilityLabel={`${Strings.videoCall.endCall}. Tombol`}
          >
            <Ionicons name="call" size={42} color={Colors.white} />
          </TouchableOpacity>
          <View style={styles.placeholder} />
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center" },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  camera: { flex: 1 },
  buttonContainer: {
    position: "absolute",
    bottom: 60,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  flipButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  endCallButton: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.danger,
    justifyContent: "center",
    alignItems: "center",
    transform: [{ rotate: "135deg" }],
  },
  placeholder: { width: 60, height: 60 },
  buttonBase: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
});

export default VideoCallScreen;

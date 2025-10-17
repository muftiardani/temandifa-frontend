import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { RtcSurfaceView } from "react-native-agora";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { useAppTheme } from "../hooks/useAppTheme";
import { useAgoraCall } from "../hooks/useAgoraCall";

const AgoraVideoCallScreen = () => {
  const { colors } = useAppTheme();
  const { t } = useTranslation();

  const {
    isJoined,
    remoteUid,
    isMuted,
    isCameraOff,
    handleLeave,
    toggleMute,
    toggleCamera,
    switchCamera,
  } = useAgoraCall();

  const controlsOpacity = useSharedValue(0);
  const animatedControlsStyle = useAnimatedStyle(() => ({
    opacity: controlsOpacity.value,
  }));

  useEffect(() => {
    if (isJoined) {
      controlsOpacity.value = withTiming(1, {
        duration: 500,
        easing: Easing.out(Easing.ease),
      });
    }
  }, [isJoined, controlsOpacity]);

  const renderMainView = () => {
    if (!isJoined) {
      return (
        <View style={styles.placeholder}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.placeholderText, { color: colors.white }]}>
            {t("agoraVideoCall.connecting")}
          </Text>
        </View>
      );
    }

    if (remoteUid !== 0) {
      return (
        <RtcSurfaceView canvas={{ uid: remoteUid }} style={styles.videoView} />
      );
    }

    return (
      <View style={styles.placeholder}>
        <Text style={[styles.placeholderText, { color: colors.white }]}>
          {t("agoraVideoCall.waiting")}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.main, { backgroundColor: colors.black }]}>
      {renderMainView()}

      {isJoined && !isCameraOff && (
        <RtcSurfaceView
          canvas={{ uid: 0 }}
          style={[styles.localView, { borderColor: colors.primary }]}
        />
      )}

      <Animated.View style={[styles.controls, animatedControlsStyle]}>
        <TouchableOpacity
          style={[
            styles.iconButton,
            { backgroundColor: colors.controlBackground },
          ]}
          onPress={toggleCamera}
          accessibilityLabel={
            isCameraOff ? t("call.turnCameraOn") : t("call.turnCameraOff")
          }
          accessibilityHint={
            isCameraOff
              ? t("call.accessibility.cameraStateOn")
              : t("call.accessibility.cameraStateOff")
          }
          accessibilityRole="button"
        >
          <Ionicons
            name={isCameraOff ? "videocam-off" : "videocam"}
            size={28}
            color={colors.white}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.iconButton,
            { backgroundColor: colors.controlBackground },
          ]}
          onPress={toggleMute}
          accessibilityLabel={isMuted ? t("call.unmute") : t("call.mute")}
          accessibilityHint={
            isMuted
              ? t("call.accessibility.micStateOn")
              : t("call.accessibility.micStateOff")
          }
          accessibilityRole="button"
        >
          <Ionicons
            name={isMuted ? "mic-off" : "mic"}
            size={28}
            color={colors.white}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.iconButton,
            { backgroundColor: colors.controlBackground },
          ]}
          onPress={switchCamera}
          accessibilityLabel={t("call.switchCamera")}
          accessibilityHint={t("call.accessibility.switchCameraHint")}
          accessibilityRole="button"
        >
          <Ionicons name="camera-reverse" size={28} color={colors.white} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: colors.danger }]}
          onPress={handleLeave}
          accessibilityLabel={t("call.endCall")}
          accessibilityHint={t("call.accessibility.endCallHint")}
          accessibilityRole="button"
        >
          <Ionicons
            name="call"
            size={32}
            color={colors.white}
            style={{ transform: [{ rotate: "135deg" }] }}
          />
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  main: { flex: 1, justifyContent: "center", alignItems: "center" },
  videoView: { width: "100%", height: "100%" },
  localView: {
    position: "absolute",
    width: 120,
    height: 180,
    right: 20,
    bottom: 120,
    borderRadius: 8,
    borderWidth: 2,
    overflow: "hidden",
  },
  placeholder: { flex: 1, justifyContent: "center", alignItems: "center" },
  placeholderText: { fontSize: 18, marginTop: 12 },
  controls: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  iconButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AgoraVideoCallScreen;

import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from "react-native";
import { RtcSurfaceView } from "react-native-agora";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

import { useAppTheme } from "../hooks/useAppTheme";
import { useAgoraCall } from "../hooks/useAgoraCall";

const AgoraVideoCallScreen = () => {
  const { colors } = useAppTheme();
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

  const controlsTranslateY = useSharedValue(100);
  const controlsOpacity = useSharedValue(0);

  const animatedControlsStyle = useAnimatedStyle(() => ({
    opacity: controlsOpacity.value,
    transform: [{ translateY: controlsTranslateY.value }],
  }));

  useEffect(() => {
    if (isJoined) {
      controlsTranslateY.value = withTiming(0, {
        duration: 500,
        easing: Easing.out(Easing.ease),
      });
      controlsOpacity.value = withTiming(1, { duration: 500 });
    }
  }, [isJoined]);

  return (
    <SafeAreaView style={[styles.main, { backgroundColor: colors.black }]}>
      {isJoined ? (
        <React.Fragment>
          {remoteUid !== 0 ? (
            <RtcSurfaceView
              canvas={{ uid: remoteUid }}
              style={styles.videoView}
            />
          ) : (
            <View style={styles.placeholder}>
              <Text style={[styles.placeholderText, { color: colors.white }]}>
                Menunggu pengguna lain...
              </Text>
            </View>
          )}
          {!isCameraOff && (
            <RtcSurfaceView
              canvas={{ uid: 0 }}
              style={[styles.localView, { borderColor: colors.primary }]}
            />
          )}
        </React.Fragment>
      ) : (
        <View style={styles.placeholder}>
          <Text style={[styles.placeholderText, { color: colors.white }]}>
            Menyambungkan...
          </Text>
        </View>
      )}

      <Animated.View style={[styles.controls, animatedControlsStyle]}>
        <TouchableOpacity style={styles.iconButton} onPress={toggleCamera}>
          <Ionicons
            name={isCameraOff ? "videocam-off" : "videocam"}
            size={28}
            color={colors.white}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={toggleMute}>
          <Ionicons
            name={isMuted ? "mic-off" : "mic"}
            size={28}
            color={colors.white}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={switchCamera}>
          <Ionicons name="camera-reverse" size={28} color={colors.white} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: colors.danger }]}
          onPress={handleLeave}
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
  main: { flex: 1 },
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
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 18,
  },
  controls: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  iconButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AgoraVideoCallScreen;

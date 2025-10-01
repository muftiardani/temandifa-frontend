import React, { useRef, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
  Platform,
  PermissionsAndroid,
  Alert,
} from "react-native";
import {
  ClientRoleType,
  createAgoraRtcEngine,
  IRtcEngine,
  ChannelProfileType,
  RtcSurfaceView,
} from "react-native-agora";
import { useNavigation } from "@react-navigation/native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Config } from "../config";
import { useAppTheme } from "../hooks/useAppTheme";

const AgoraVideoCallScreen = () => {
  const navigation = useNavigation();
  const { colors } = useAppTheme();
  const agoraEngineRef = useRef<IRtcEngine | null>(null);

  const [isJoined, setIsJoined] = useState(false);
  const [remoteUid, setRemoteUid] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  const controlsTranslateY = useSharedValue(100);
  const controlsOpacity = useSharedValue(0);

  const animatedControlsStyle = useAnimatedStyle(() => ({
    opacity: controlsOpacity.value,
    transform: [{ translateY: controlsTranslateY.value }],
  }));

  const getPermission = async () => {
    if (Platform.OS === "android") {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ]);
    }
  };

  useEffect(() => {
    const setupAgoraEngine = async () => {
      try {
        await getPermission();
        agoraEngineRef.current = createAgoraRtcEngine();
        const agoraEngine = agoraEngineRef.current;
        agoraEngine.registerEventHandler({
          onJoinChannelSuccess: () => {
            setIsJoined(true);
          },
          onUserJoined: (_connection, Uid) => {
            setRemoteUid(Uid);
          },
          onUserOffline: () => {
            setRemoteUid(0);
          },
        });
        agoraEngine.initialize({
          appId: Config.agora.appId,
          channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
        });
        agoraEngine.enableVideo();
        join();
      } catch (e) {
        console.log(e);
      }
    };

    setupAgoraEngine();

    return () => {
      leave();
    };
  }, []);

  useEffect(() => {
    if (isJoined) {
      controlsTranslateY.value = withTiming(0, {
        duration: 500,
        easing: Easing.out(Easing.ease),
      });
      controlsOpacity.value = withTiming(1, { duration: 500 });
    }
  }, [isJoined]);

  const join = async () => {
    if (isJoined || !agoraEngineRef.current) return;
    try {
      await agoraEngineRef.current.startPreview();
      await agoraEngineRef.current.joinChannel(
        Config.agora.token,
        Config.agora.channelName,
        0,
        { clientRoleType: ClientRoleType.ClientRoleBroadcaster }
      );
    } catch (e) {
      console.log(e);
    }
  };

  const leave = () => {
    try {
      agoraEngineRef.current?.leaveChannel();
      agoraEngineRef.current?.release();
      setRemoteUid(0);
      setIsJoined(false);
    } catch (e) {
      console.log(e);
    }
  };

  const handleLeave = () => {
    leave();
    navigation.goBack();
  };

  const toggleMute = async () => {
    try {
      await agoraEngineRef.current?.muteLocalAudioStream(!isMuted);
      setIsMuted(!isMuted);
    } catch (e) {
      console.log(e);
    }
  };

  const toggleCamera = async () => {
    try {
      await agoraEngineRef.current?.enableLocalVideo(!isCameraOff);
      setIsCameraOff(!isCameraOff);
    } catch (e) {
      console.log(e);
    }
  };

  const switchCamera = async () => {
    try {
      await agoraEngineRef.current?.switchCamera();
    } catch (e) {
      console.log(e);
    }
  };

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

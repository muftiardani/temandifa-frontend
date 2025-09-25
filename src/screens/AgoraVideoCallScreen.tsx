import React, { useRef, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from "react-native";
import {
  ClientRoleType,
  createAgoraRtcEngine,
  IRtcEngine,
  ChannelProfileType,
  RtcSurfaceView,
} from "react-native-agora";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../constants/Colors";
import { Config } from "../config";

const AgoraVideoCallScreen = () => {
  const navigation = useNavigation();
  const agoraEngineRef = useRef<IRtcEngine | null>(null);

  const [isJoined, setIsJoined] = useState(false);
  const [remoteUid, setRemoteUid] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  const appId = Config.agora.appId;
  const channelName = Config.agora.channelName;
  const token = "";
  const uid = Math.floor(Math.random() * 100000) + 1;

  useEffect(() => {
    setupVideoSDKEngine();
    return () => {
      leave();
    };
  }, []);

  const setupVideoSDKEngine = async () => {
    try {
      agoraEngineRef.current = createAgoraRtcEngine();
      const agoraEngine = agoraEngineRef.current;

      agoraEngine.registerEventHandler({
        onJoinChannelSuccess: () => {
          console.log("Successfully joined channel");
          setIsJoined(true);
        },
        onUserJoined: (_connection, Uid) => {
          console.log("Remote user joined", Uid);
          setRemoteUid(Uid);
        },
        onUserOffline: (_connection, Uid) => {
          console.log("Remote user left", Uid);
          setRemoteUid(0);
        },
      });

      agoraEngine.initialize({
        appId: appId,
        channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
      });

      agoraEngine.enableVideo();
      join();
    } catch (e) {
      console.log(e);
    }
  };

  const join = async () => {
    if (isJoined) return;
    try {
      const agoraEngine = agoraEngineRef.current;
      await agoraEngine?.setClientRole(ClientRoleType.ClientRoleBroadcaster);
      await agoraEngine?.startPreview();
      await agoraEngine?.joinChannel(token, channelName, uid, {});
    } catch (e) {
      console.log("Join channel error:", e);
    }
  };

  const leave = async () => {
    try {
      await agoraEngineRef.current?.leaveChannel();
      agoraEngineRef.current?.release();
      setRemoteUid(0);
      setIsJoined(false);
      console.log("Left the channel");
    } catch (e) {
      console.log(e);
    }
  };

  const handleLeave = () => {
    leave().finally(() => navigation.goBack());
  };

  const toggleMute = async () => {
    await agoraEngineRef.current?.muteLocalAudioStream(!isMuted);
    setIsMuted(!isMuted);
  };

  const toggleCamera = async () => {
    await agoraEngineRef.current?.enableLocalVideo(!isCameraOff);
    setIsCameraOff(!isCameraOff);
  };

  const switchCamera = async () => {
    await agoraEngineRef.current?.switchCamera();
  };

  return (
    <SafeAreaView style={styles.main}>
      {isJoined ? (
        <React.Fragment>
          {remoteUid !== 0 ? (
            <RtcSurfaceView
              canvas={{ uid: remoteUid }}
              style={styles.videoView}
            />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>
                Menunggu pengguna lain...
              </Text>
            </View>
          )}
          <RtcSurfaceView canvas={{ uid: 0 }} style={styles.localView} />
        </React.Fragment>
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Menyambungkan...</Text>
        </View>
      )}

      <View style={styles.controls}>
        <TouchableOpacity style={styles.iconButton} onPress={toggleCamera}>
          <Ionicons
            name={isCameraOff ? "videocam-off" : "videocam"}
            size={28}
            color={Colors.white}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={toggleMute}>
          <Ionicons
            name={isMuted ? "mic-off" : "mic"}
            size={28}
            color={Colors.white}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={switchCamera}>
          <Ionicons name="camera-reverse" size={28} color={Colors.white} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: Colors.danger }]}
          onPress={handleLeave}
        >
          <Ionicons
            name="call"
            size={32}
            color={Colors.white}
            style={{ transform: [{ rotate: "135deg" }] }}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  main: { flex: 1, backgroundColor: "#000" },
  videoView: { width: "100%", height: "100%" },
  localView: {
    position: "absolute",
    width: 120,
    height: 180,
    right: 20,
    bottom: 120,
    borderRadius: 8,
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: Colors.white,
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

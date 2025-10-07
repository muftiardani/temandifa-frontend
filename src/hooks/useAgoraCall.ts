import { useRef, useState, useEffect, useCallback } from "react";
import { Platform, PermissionsAndroid, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  ClientRoleType,
  createAgoraRtcEngine,
  IRtcEngine,
  ChannelProfileType,
} from "react-native-agora";
import { useCallStore } from "../store/callStore";
import { socketService } from "../services/socketService";
import { Config } from "../config";

export const useAgoraCall = () => {
  const navigation = useNavigation();
  const agoraEngineRef = useRef<IRtcEngine | null>(null);

  const { channelName, token, uid, callId, clearCall } = useCallStore();

  const [isJoined, setIsJoined] = useState(false);
  const [remoteUid, setRemoteUid] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  const getPermission = async () => {
    if (Platform.OS === "android") {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ]);
    }
  };

  const leave = useCallback(() => {
    try {
      if (agoraEngineRef.current) {
        agoraEngineRef.current.leaveChannel();
        agoraEngineRef.current.release();
        agoraEngineRef.current = null;
      }
      setRemoteUid(0);
      setIsJoined(false);
      console.log("Berhasil meninggalkan channel Agora.");
    } catch (e) {
      console.error("Error saat meninggalkan channel:", e);
    }
  }, []);

  useEffect(() => {
    if (!channelName || !token || !uid) {
      console.warn(
        "Kredensial Agora tidak lengkap, panggilan tidak dapat dimulai."
      );
      return;
    }

    const setupAndJoin = async () => {
      try {
        await getPermission();
        agoraEngineRef.current = createAgoraRtcEngine();
        const engine = agoraEngineRef.current;

        engine.registerEventHandler({
          onJoinChannelSuccess: () => {
            console.log("Berhasil bergabung ke channel.");
            setIsJoined(true);
          },
          onUserJoined: (_connection, Uid) => {
            console.log("Pengguna lain bergabung:", Uid);
            setRemoteUid(Uid);
          },
          onUserOffline: () => {
            console.log("Pengguna lain meninggalkan channel.");
            setRemoteUid(0);
          },
          onError: (err) => {
            console.error("Agora RTC Error:", err);
          },
        });

        engine.initialize({
          appId: Config.agora.appId!,
          channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
        });

        engine.enableVideo();
        await engine.startPreview();
        await engine.joinChannel(token, channelName, uid, {
          clientRoleType: ClientRoleType.ClientRoleBroadcaster,
        });
      } catch (e) {
        console.error("Gagal melakukan setup & join channel Agora:", e);
        Alert.alert(
          "Gagal Terhubung",
          "Tidak dapat terhubung ke server panggilan video."
        );
        handleLeave();
      }
    };

    setupAndJoin();

    return () => {
      leave();
    };
  }, [channelName, token, uid, leave]);

  const handleLeave = () => {
    leave();
    if (callId) {
      socketService.emit("end-call", { callId });
    }
    clearCall();
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const toggleMute = async () => {
    try {
      await agoraEngineRef.current?.muteLocalAudioStream(!isMuted);
      setIsMuted(!isMuted);
    } catch (e) {
      console.error("Gagal mengubah status mute:", e);
    }
  };

  const toggleCamera = async () => {
    try {
      const newCameraState = !isCameraOff;
      await agoraEngineRef.current?.muteLocalVideoStream(newCameraState);
      setIsCameraOff(newCameraState);
    } catch (e) {
      console.error("Gagal mengubah status kamera:", e);
    }
  };

  const switchCamera = async () => {
    try {
      await agoraEngineRef.current?.switchCamera();
    } catch (e) {
      console.error("Gagal mengganti kamera:", e);
    }
  };

  return {
    isJoined,
    remoteUid,
    isMuted,
    isCameraOff,
    handleLeave,
    toggleMute,
    toggleCamera,
    switchCamera,
  };
};

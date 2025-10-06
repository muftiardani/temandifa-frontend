import { useRef, useState, useEffect, useCallback } from "react";
import { Platform, PermissionsAndroid } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  ClientRoleType,
  createAgoraRtcEngine,
  IRtcEngine,
  ChannelProfileType,
} from "react-native-agora";
import { useCallStore } from "../store/callStore";

export const useAgoraCall = () => {
  const navigation = useNavigation();
  const agoraEngineRef = useRef<IRtcEngine | null>(null);

  const { channelName, token, uid, clearCall } = useCallStore();

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
    } catch (e) {
      console.log("Leave Error:", e);
    }
  }, []);

  useEffect(() => {
    if (!channelName || !token || !uid) {
      return;
    }

    const setupAndJoin = async () => {
      try {
        await getPermission();
        agoraEngineRef.current = createAgoraRtcEngine();
        const engine = agoraEngineRef.current;

        engine.registerEventHandler({
          onJoinChannelSuccess: () => setIsJoined(true),
          onUserJoined: (_connection, Uid) => setRemoteUid(Uid),
          onUserOffline: () => setRemoteUid(0),
        });

        engine.initialize({
          appId: process.env.EXPO_PUBLIC_AGORA_APP_ID!,
          channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
        });

        engine.enableVideo();
        await engine.startPreview();
        await engine.joinChannel(token, channelName, uid, {
          clientRoleType: ClientRoleType.ClientRoleBroadcaster,
        });
      } catch (e) {
        console.log("Setup & Join Error:", e);
      }
    };

    setupAndJoin();

    return () => {
      leave();
    };
  }, [channelName, token, uid, leave]);

  const handleLeave = () => {
    leave();
    clearCall();
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const toggleMute = async () => {
    await agoraEngineRef.current?.muteLocalAudioStream(!isMuted);
    setIsMuted(!isMuted);
  };

  const toggleCamera = async () => {
    const newCameraState = !isCameraOff;
    await agoraEngineRef.current?.muteLocalVideoStream(newCameraState);
    setIsCameraOff(newCameraState);
  };

  const switchCamera = async () => {
    await agoraEngineRef.current?.switchCamera();
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

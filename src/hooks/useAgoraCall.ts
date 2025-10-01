import { useRef, useState, useEffect } from "react";
import { Platform, PermissionsAndroid } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  ClientRoleType,
  createAgoraRtcEngine,
  IRtcEngine,
  ChannelProfileType,
} from "react-native-agora";
import { Config } from "../config";

export const useAgoraCall = () => {
  const navigation = useNavigation();
  const agoraEngineRef = useRef<IRtcEngine | null>(null);

  const [isJoined, setIsJoined] = useState(false);
  const [remoteUid, setRemoteUid] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  useEffect(() => {
    const getPermission = async () => {
      if (Platform.OS === "android") {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.CAMERA,
        ]);
      }
    };

    const setupAgoraEngine = async () => {
      try {
        await getPermission();
        agoraEngineRef.current = createAgoraRtcEngine();
        const agoraEngine = agoraEngineRef.current;
        agoraEngine.registerEventHandler({
          onJoinChannelSuccess: () => setIsJoined(true),
          onUserJoined: (_connection, Uid) => setRemoteUid(Uid),
          onUserOffline: () => setRemoteUid(0),
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

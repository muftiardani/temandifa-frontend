import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import * as Speech from "expo-speech";
import * as Haptics from "expo-haptics";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { RootStackParamList } from "../types/navigation";
import { apiService } from "../services/api";
import { useAppTheme } from "../hooks/useAppTheme";
import LoadingIndicator from "../components/common/LoadingIndicator";

type VoiceScreenProps = NativeStackScreenProps<RootStackParamList, "Voice">;

const VoiceScreen: React.FC<VoiceScreenProps> = ({ navigation }) => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const { t, colors } = useAppTheme();

  const scale = useSharedValue(1);

  useEffect(() => {
    if (isRecording) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.1, {
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else {
      scale.value = withTiming(1, { duration: 200 });
    }
  }, [isRecording, scale]);

  const animatedMicStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const startRecording = useCallback(async () => {
    try {
      Speech.stop();
      if (permissionResponse?.status !== "granted") {
        const permission = await requestPermission();
        if (permission.status !== "granted") {
          Toast.show({
            type: "info",
            text1: t.general.error,
            text2: t.permissions.microphone,
          });
          return;
        }
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error("Gagal memulai rekaman", err);
      Toast.show({
        type: "error",
        text1: t.general.error,
        text2: t.voiceScreen.recordingFailed,
      });
    }
  }, [permissionResponse, requestPermission, t]);

  const stopRecordingAndTranscribe = useCallback(async () => {
    if (!recording) return;
    setIsRecording(false);
    setIsProcessing(true);
    try {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
      const uri = recording.getURI();
      if (!uri) throw new Error("URI rekaman tidak ditemukan.");
      const result = await apiService.transcribeAudio(uri);
      if (result) {
        navigation.navigate("VoiceResult", {
          transcribedText: result.transcribedText,
        });
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: t.general.failure,
        text2: error.message || t.general.genericError,
      });
    } finally {
      setIsProcessing(false);
      setRecording(null);
    }
  }, [recording, navigation, t]);

  const handleMicPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (isRecording) {
      stopRecordingAndTranscribe();
    } else {
      startRecording();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityLabel={`${t.general.back}. Tombol`}
          accessibilityRole="button"
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.headerText }]}>
          {t.voiceScreen.title}
        </Text>
      </View>
      <View style={styles.content}>
        <Text style={[styles.infoText, { color: colors.grey }]}>
          {isProcessing
            ? t.voiceScreen.infoProcessing
            : isRecording
            ? t.voiceScreen.infoListening
            : t.voiceScreen.infoDefault}
        </Text>
        {isProcessing ? (
          <LoadingIndicator />
        ) : (
          <Animated.View style={[animatedMicStyle]}>
            <TouchableOpacity
              style={[
                styles.micButton,
                {
                  backgroundColor: isRecording ? colors.accent : colors.primary,
                },
              ]}
              onPress={handleMicPress}
              disabled={isProcessing}
              accessibilityLabel={
                isRecording
                  ? "Berhenti merekam. Tombol"
                  : "Mulai merekam. Tombol"
              }
              accessibilityHint="Ketuk dua kali untuk mengaktifkan"
              accessibilityRole="button"
            >
              <Ionicons name="mic" size={80} color={colors.white} />
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  backButton: { marginRight: 16, padding: 8 },
  headerTitle: { fontSize: 20, fontWeight: "600" },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  infoText: { fontSize: 18, marginBottom: 40, textAlign: "center" },
  micButton: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
});

export default VoiceScreen;

import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { RootStackParamList } from "../types/navigation";
import { useAppTheme } from "../hooks/useAppTheme";
import { useAudioRecorder } from "../hooks/useAudioRecorder";
import LoadingIndicator from "../components/common/LoadingIndicator";

type VoiceScreenProps = NativeStackScreenProps<RootStackParamList, "Voice">;

const VoiceScreen: React.FC<VoiceScreenProps> = ({ navigation }) => {
  const { t, colors } = useAppTheme();
  const {
    isRecording,
    isProcessing,
    startRecording,
    stopRecordingAndTranscribe,
  } = useAudioRecorder();

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
        <Text
          style={[styles.infoText, { color: colors.grey }]}
          accessibilityLiveRegion="polite"
        >
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

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
import { useTranslation } from "react-i18next";
import { RootStackParamList } from "../types/navigation";
import { useAppTheme } from "../hooks/useAppTheme";
import { useAudioRecorder } from "../hooks/useAudioRecorder";
import LoadingIndicator from "../components/common/LoadingIndicator";
import { useAppStore } from "../store/appStore";
import ScreenHeader from "../components/common/ScreenHeader";

type VoiceScreenProps = NativeStackScreenProps<RootStackParamList, "Voice">;

const VoiceScreen: React.FC<VoiceScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const setIsLoading = useAppStore((state) => state.setIsLoading);

  const {
    isRecording,
    isProcessing,
    startRecording,
    stopRecordingAndTranscribe,
  } = useAudioRecorder();

  const scale = useSharedValue(1);
  const rippleScale = useSharedValue(1);
  const rippleOpacity = useSharedValue(1);

  useEffect(() => {
    setIsLoading(isProcessing);
  }, [isProcessing, setIsLoading]);

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

      rippleScale.value = withRepeat(
        withTiming(4, { duration: 2000, easing: Easing.out(Easing.quad) }),
        -1
      );
      rippleOpacity.value = withRepeat(
        withTiming(0, { duration: 2000, easing: Easing.out(Easing.quad) }),
        -1
      );
    } else {
      scale.value = withTiming(1, { duration: 200 });
      rippleScale.value = withTiming(1);
      rippleOpacity.value = withTiming(1);
    }
  }, [isRecording, scale, rippleScale, rippleOpacity]);

  const animatedMicStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedRippleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: rippleScale.value }],
    opacity: rippleOpacity.value,
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
      <ScreenHeader title={t("voiceScreen.title")} />
      <View style={styles.contentContainer}>
        <View style={styles.content}>
          <Text
            style={[styles.infoText, { color: colors.grey }]}
            accessibilityLiveRegion="polite"
          >
            {isProcessing
              ? t("voiceScreen.infoProcessing")
              : isRecording
              ? t("voiceScreen.infoListening")
              : t("voiceScreen.infoDefault")}
          </Text>
          {isProcessing ? (
            <LoadingIndicator />
          ) : (
            <View style={styles.micContainer}>
              {isRecording && (
                <Animated.View
                  style={[
                    styles.ripple,
                    { backgroundColor: colors.primary },
                    animatedRippleStyle,
                  ]}
                />
              )}
              <Animated.View style={[animatedMicStyle]}>
                <TouchableOpacity
                  style={[
                    styles.micButton,
                    {
                      backgroundColor: isRecording
                        ? colors.accent
                        : colors.primary,
                    },
                  ]}
                  onPress={handleMicPress}
                  disabled={isProcessing}
                  accessibilityLabel={
                    isRecording
                      ? t("voiceScreen.accessibility.micStopLabel") +
                        t("general.accessibility.buttonSuffix")
                      : t("voiceScreen.accessibility.micStartLabel") +
                        t("general.accessibility.buttonSuffix")
                  }
                  accessibilityHint={t("voiceScreen.accessibility.micHint")}
                  accessibilityRole="button"
                >
                  <Ionicons name="mic" size={80} color={colors.white} />
                </TouchableOpacity>
              </Animated.View>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  infoText: { fontSize: 18, marginBottom: 40, textAlign: "center" },
  micContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  micButton: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    zIndex: 1,
  },
  ripple: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
  },
});

export default VoiceScreen;

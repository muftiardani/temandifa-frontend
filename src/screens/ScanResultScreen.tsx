import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import * as Haptics from "expo-haptics";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { RootStackParamList } from "../types/navigation";
import { useAppTheme } from "../hooks/useAppTheme";
import ScreenHeader from "../components/common/ScreenHeader";

type ScanResultScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "ScanResult"
>;

const ScanResultScreen: React.FC<ScanResultScreenProps> = ({
  route,
  navigation,
}) => {
  const { scannedText } = route.params;
  const [displayedText, setDisplayedText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isMounted = useRef(true);
  const { t, i18n } = useTranslation();
  const { colors } = useAppTheme();
  const language = i18n.language;

  useEffect(() => {
    const words = (scannedText || t("scanResult.noTextDetected")).split(" ");
    let currentWords: string[] = [];
    let wordIndex = 0;

    const intervalId = setInterval(() => {
      if (wordIndex < words.length) {
        currentWords.push(words[wordIndex]);
        if (isMounted.current) {
          setDisplayedText(currentWords.join(" "));
        }
        wordIndex++;
      } else {
        clearInterval(intervalId);
      }
    }, 50);

    return () => {
      clearInterval(intervalId);
      isMounted.current = false;
    };
  }, [scannedText, t]);

  useEffect(() => {
    isMounted.current = true;
    const unsubscribe = navigation.addListener("beforeRemove", () => {
      Speech.stop();
    });
    return () => {
      isMounted.current = false;
      unsubscribe();
      Speech.stop();
    };
  }, [navigation]);

  const handleSpeakButton = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const speakingStatus = await Speech.isSpeakingAsync();
    if (speakingStatus) {
      Speech.stop();
      if (isMounted.current) setIsSpeaking(false);
    } else {
      Speech.speak(scannedText || t("scanResult.noTextDetected"), {
        language: language === "id" ? "id-ID" : "en-US",
        onStart: () => {
          if (isMounted.current) setIsSpeaking(true);
        },
        onDone: () => {
          if (isMounted.current) setIsSpeaking(false);
        },
        onStopped: () => {
          if (isMounted.current) setIsSpeaking(false);
        },
        onError: (error) => {
          console.error("Expo Speech Error:", error);
          if (isMounted.current) setIsSpeaking(false);
        },
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title={t("scanResult.title")} />
      <View style={styles.contentContainer}>
        <ScrollView style={styles.contentScrollView}>
          <Text style={[styles.resultText, { color: colors.text }]}>
            {displayedText}
          </Text>
        </ScrollView>

        <View style={[styles.bottomBar, { borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: isSpeaking ? colors.danger : colors.primary },
            ]}
            onPress={handleSpeakButton}
            accessibilityLabel={
              isSpeaking
                ? t("scanResult.accessibility.stopLabel") +
                  t("general.accessibility.buttonSuffix")
                : t("scanResult.accessibility.listenLabel") +
                  t("general.accessibility.buttonSuffix")
            }
            accessibilityHint={t("scanResult.accessibility.listenHint")}
            accessibilityRole="button"
          >
            <Ionicons
              name={isSpeaking ? "stop-circle" : "volume-high"}
              size={32}
              color={colors.white}
            />
            <Text
              style={[styles.actionButtonText, { color: colors.buttonText }]}
            >
              {isSpeaking ? t("scanResult.stop") : t("scanResult.listen")}{" "}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  contentScrollView: { flex: 1, padding: 20 },
  resultText: { fontSize: 16, lineHeight: 24 },
  bottomBar: { padding: 20, borderTopWidth: 1 },
  actionButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    borderRadius: 50,
    height: 70,
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default ScanResultScreen;

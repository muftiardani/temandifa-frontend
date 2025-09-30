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

import { RootStackParamList } from "../types/navigation";
import { commonStyles } from "../constants/Styles";
import { Colors } from "../constants/Colors";
import { useLocalization } from "../hooks/useLocalization";
import { useAppStore } from "../store/appStore";

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
  const t = useLocalization();
  const language = useAppStore((state) => state.language);

  useEffect(() => {
    const words = (scannedText || t.scanResult.noTextDetected).split(" ");
    let currentWords: string[] = [];
    let wordIndex = 0;

    const intervalId = setInterval(() => {
      if (wordIndex < words.length) {
        currentWords.push(words[wordIndex]);
        setDisplayedText(currentWords.join(" "));
        wordIndex++;
      } else {
        clearInterval(intervalId);
      }
    }, 50);

    return () => clearInterval(intervalId);
  }, [scannedText, t]);

  useEffect(() => {
    isMounted.current = true;
    const unsubscribe = navigation.addListener("beforeRemove", () => {
      Speech.stop();
    });
    return () => {
      isMounted.current = false;
      unsubscribe();
    };
  }, [navigation]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (isMounted.current) {
        const speakingStatus = await Speech.isSpeakingAsync();
        if (speakingStatus !== isSpeaking) {
          setIsSpeaking(speakingStatus);
        }
      }
    }, 500);
    return () => clearInterval(interval);
  }, [isSpeaking]);

  const handleSpeakButton = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const speakingStatus = await Speech.isSpeakingAsync();
    if (speakingStatus) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      Speech.speak(scannedText, {
        language: language === "id" ? "id-ID" : "en-US",
        onDone: () => {
          if (isMounted.current) setIsSpeaking(false);
        },
        onStopped: () => {
          if (isMounted.current) setIsSpeaking(false);
        },
        onError: () => {
          if (isMounted.current) setIsSpeaking(false);
        },
      });
    }
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={styles.container}>
        <View style={commonStyles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={commonStyles.backButton}
            accessibilityLabel={`${t.general.back}. Tombol`}
            accessibilityRole="button"
          >
            <Ionicons name="chevron-back" size={24} color={Colors.black} />
          </TouchableOpacity>
          <Text style={commonStyles.headerTitle}>{t.scanResult.title}</Text>
        </View>

        <ScrollView style={styles.contentScrollView}>
          <Text style={styles.resultText}>{displayedText}</Text>
        </ScrollView>

        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[styles.actionButton, isSpeaking && styles.stopButton]}
            onPress={handleSpeakButton}
            accessibilityLabel={
              isSpeaking
                ? `${t.scanResult.stop}. Tombol`
                : `${t.scanResult.listen} hasil scan. Tombol`
            }
            accessibilityHint="Ketuk dua kali untuk memutar atau menghentikan suara"
            accessibilityRole="button"
          >
            <Ionicons
              name={isSpeaking ? "stop-circle" : "volume-high"}
              size={32}
              color={Colors.white}
            />
            <Text style={styles.actionButtonText}>
              {isSpeaking ? t.scanResult.stop : t.scanResult.listen}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentScrollView: { flex: 1, padding: 20 },
  resultText: { fontSize: 16, lineHeight: 24, color: Colors.textDefault },
  bottomBar: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGrey,
  },
  actionButton: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    borderRadius: 50,
    height: 70,
  },
  stopButton: { backgroundColor: Colors.danger },
  actionButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default ScanResultScreen;

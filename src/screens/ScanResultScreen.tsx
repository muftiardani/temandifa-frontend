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
import { Strings } from "../constants/Strings";

type ScanResultScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "ScanResult"
>;

const ScanResultScreen: React.FC<ScanResultScreenProps> = ({
  route,
  navigation,
}) => {
  const { scannedText } = route.params;
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isMounted = useRef(true);

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
        language: "id-ID",
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
            accessibilityLabel={`${Strings.general.back}. Tombol`}
            accessibilityRole="button"
          >
            <Ionicons name="chevron-back" size={24} color={Colors.black} />
          </TouchableOpacity>
          <Text style={commonStyles.headerTitle}>
            {Strings.scanResult.title}
          </Text>
        </View>

        <ScrollView style={styles.contentScrollView}>
          <Text style={styles.resultText}>
            {scannedText || Strings.scanResult.noTextDetected}
          </Text>
        </ScrollView>

        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[styles.actionButton, isSpeaking && styles.stopButton]}
            onPress={handleSpeakButton}
            accessibilityLabel={
              isSpeaking
                ? `${Strings.scanResult.stop}. Tombol`
                : `${Strings.scanResult.listen} hasil scan. Tombol`
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
              {isSpeaking ? Strings.scanResult.stop : Strings.scanResult.listen}
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

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
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Hasil Scan</Text>
        </View>

        {/* Konten Hasil Teks */}
        <ScrollView style={styles.contentScrollView}>
          <Text style={styles.resultText}>{scannedText}</Text>
        </ScrollView>

        {/* Tombol Aksi */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[styles.actionButton, isSpeaking && styles.stopButton]}
            onPress={handleSpeakButton}
          >
            <Ionicons
              name={isSpeaking ? "stop-circle" : "volume-high"}
              size={32}
              color="white"
            />
            <Text style={styles.actionButtonText}>
              {isSpeaking ? "Berhenti" : "Dengarkan"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  contentScrollView: {
    flex: 1,
    padding: 20,
  },
  resultText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  bottomBar: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#F2F2F2",
  },
  actionButton: {
    backgroundColor: "#3F7EF3",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    borderRadius: 50,
    height: 70,
  },
  stopButton: {
    backgroundColor: "#CC444B",
  },
  actionButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default ScanResultScreen;

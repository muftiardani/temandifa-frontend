import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

import { TRANSCRIBE_API_URL } from "../config/api";

type VoiceScreenProps = NativeStackScreenProps<RootStackParamList, "Voice">;

const VoiceScreen: React.FC<VoiceScreenProps> = ({ navigation }) => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  async function startRecording() {
    try {
      if (permissionResponse?.status !== "granted") {
        await requestPermission();
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
      Alert.alert(
        "Error",
        "Gagal memulai rekaman. Pastikan izin mikrofon telah diberikan."
      );
    }
  }

  async function stopRecordingAndTranscribe() {
    if (!recording) return;

    setIsRecording(false);
    setIsProcessing(true);

    try {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
      const uri = recording.getURI();

      if (!uri) {
        throw new Error("URI rekaman tidak ditemukan.");
      }

      console.log("Rekaman disimpan di:", uri);

      const formData = new FormData();
      formData.append("audio", {
        uri: uri,
        name: "recording.m4a",
        type: "audio/m4a",
      } as any);

      const response = await fetch(TRANSCRIBE_API_URL, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Gagal menghubungi server transkripsi."
        );
      }

      navigation.navigate("VoiceResult", {
        transcribedText: result.transcribedText,
      });
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", error.message || "Gagal memproses suara.");
    } finally {
      setIsProcessing(false);
      setRecording(null);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Voice</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.infoText}>
          {isProcessing
            ? "Sedang memproses suara..."
            : isRecording
            ? "Sedang mendengarkan..."
            : "Tekan tombol untuk berbicara"}
        </Text>

        {isProcessing ? (
          <ActivityIndicator size="large" color="#3F7EF3" />
        ) : (
          <TouchableOpacity
            style={[styles.micButton, isRecording && styles.micButtonRecording]}
            onPress={isRecording ? stopRecordingAndTranscribe : startRecording}
            disabled={isProcessing}
          >
            <Ionicons name="mic" size={80} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
  },
  backButton: { marginRight: 16, padding: 8 },
  headerTitle: { fontSize: 20, fontWeight: "600", color: "#000" },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  infoText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 40,
    textAlign: "center",
  },
  micButton: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#3F7EF3",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
  micButtonRecording: { backgroundColor: "#ED6A5A" },
});

export default VoiceScreen;

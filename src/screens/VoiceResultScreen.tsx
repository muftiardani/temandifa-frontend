import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

type VoiceResultScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "VoiceResult"
>;

const VoiceResultScreen: React.FC<VoiceResultScreenProps> = ({
  route,
  navigation,
}) => {
  const { transcribedText } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Hasil Suara</Text>
        </View>
        <ScrollView style={styles.contentScrollView}>
          <Text style={styles.resultText}>
            {transcribedText || "Tidak ada teks yang terdeteksi."}
          </Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1 },
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
  contentScrollView: { flex: 1, padding: 20 },
  resultText: { fontSize: 18, lineHeight: 26, color: "#333" },
});

export default VoiceResultScreen;

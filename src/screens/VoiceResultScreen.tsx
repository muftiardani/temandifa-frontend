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
import { useAppTheme } from "../hooks/useAppTheme";

type VoiceResultScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "VoiceResult"
>;

const VoiceResultScreen: React.FC<VoiceResultScreenProps> = ({
  route,
  navigation,
}) => {
  const { transcribedText } = route.params;
  const { t, colors } = useAppTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.container}>
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
            {t.voiceResult.title}
          </Text>
        </View>
        <ScrollView style={styles.contentScrollView}>
          <Text style={[styles.resultText, { color: colors.text }]}>
            {transcribedText || t.scanResult.noTextDetected}
          </Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  contentScrollView: { flex: 1, padding: 20 },
  resultText: { fontSize: 18, lineHeight: 26 },
});

export default VoiceResultScreen;

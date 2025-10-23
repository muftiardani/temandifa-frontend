import React from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { RootStackParamList } from "../types/navigation";
import { useAppTheme } from "../hooks/useAppTheme";
import ScreenHeader from "../components/common/ScreenHeader";

type VoiceResultScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "VoiceResult"
>;

const VoiceResultScreen: React.FC<VoiceResultScreenProps> = ({
  route,
  navigation,
}) => {
  const { transcribedText } = route.params;
  const { t } = useTranslation();
  const { colors } = useAppTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title={t("voiceResult.title")} />
      <View style={styles.contentContainer}>
        <ScrollView style={styles.contentScrollView}>
          <Text style={[styles.resultText, { color: colors.text }]}>
            {transcribedText || t("scanResult.noTextDetected")}
          </Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  contentScrollView: { flex: 1, padding: 20 },
  resultText: { fontSize: 18, lineHeight: 26 },
});

export default VoiceResultScreen;

import React from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { RootStackParamList } from "../types/navigation";
import { useAppTheme } from "../hooks/useAppTheme";
import ScreenHeader from "../components/common/ScreenHeader";

type HelpAndGuideScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "HelpAndGuide"
>;

const HelpAndGuideScreen: React.FC<HelpAndGuideScreenProps> = ({
  navigation,
}) => {
  const { t } = useTranslation();
  const { colors } = useAppTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title={t("settings.helpAndGuide")} />
      <View style={styles.contentContainer}>
        <ScrollView style={styles.content}>
          <Text style={[styles.title, { color: colors.primary }]}>
            {t("helpAndGuide.title")}
          </Text>
          <Text style={[styles.paragraph, { color: colors.grey }]}>
            {t("helpAndGuide.intro")}
          </Text>

          <Text style={[styles.subtitle, { color: colors.text }]}>
            {t("helpAndGuide.cameraTitle")}
          </Text>
          <Text style={[styles.paragraph, { color: colors.grey }]}>
            {t("helpAndGuide.cameraDesc")}
          </Text>

          <Text style={[styles.subtitle, { color: colors.text }]}>
            {t("helpAndGuide.scanTitle")}
          </Text>
          <Text style={[styles.paragraph, { color: colors.grey }]}>
            {t("helpAndGuide.scanDesc")}
          </Text>

          <Text style={[styles.subtitle, { color: colors.text }]}>
            {t("helpAndGuide.voiceTitle")}
          </Text>
          <Text style={[styles.paragraph, { color: colors.grey }]}>
            {t("helpAndGuide.voiceDesc")}
          </Text>

          <Text style={[styles.subtitle, { color: colors.text }]}>
            {t("helpAndGuide.callTitle")}
          </Text>
          <Text style={[styles.paragraph, { color: colors.grey }]}>
            {t("helpAndGuide.callDesc")}
          </Text>

          <Text style={[styles.subtitle, { color: colors.text }]}>
            {t("helpAndGuide.settingsTitle")}
          </Text>
          <Text
            style={[styles.paragraph, { color: colors.grey, marginBottom: 40 }]}
          >
            {t("helpAndGuide.settingsDesc")}
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
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default HelpAndGuideScreen;

import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Constants from "expo-constants";
import { useTranslation } from "react-i18next";

import { RootStackParamList } from "../types/navigation";
import { useAppTheme } from "../hooks/useAppTheme";
import ScreenHeader from "../components/common/ScreenHeader";

type AboutScreenProps = NativeStackScreenProps<RootStackParamList, "About">;

const AboutScreen: React.FC<AboutScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { colors } = useAppTheme();

  const appVersion = Constants.expoConfig?.version;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title={t("settings.about")} />
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={[styles.appName, { color: colors.primary }]}>
            {t("settings.appName")}
          </Text>
          <Text style={[styles.version, { color: colors.grey }]}>
            {t("general.versionPrefix")} {appVersion}
          </Text>
          <Text style={[styles.description, { color: colors.text }]}>
            {t("helpAndGuide.intro")}{" "}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
  },
  version: {
    fontSize: 16,
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
});

export default AboutScreen;

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { RootStackParamList } from "../types/navigation";
import { useAppTheme } from "../hooks/useAppTheme";

type PrivacyAndSecurityScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "PrivacyAndSecurity"
>;

const PrivacyAndSecurityScreen: React.FC<PrivacyAndSecurityScreenProps> = ({
  navigation,
}) => {
  const { t } = useTranslation();
  const { colors } = useAppTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.container}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            accessibilityLabel={`${t("general.back")}. Tombol`}
            accessibilityRole="button"
          >
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.headerText }]}>
            {t("settings.privacyAndSecurity")}
          </Text>
        </View>

        <ScrollView style={styles.content}>
          <Text style={[styles.title, { color: colors.primary }]}>
            {t("privacyAndSecurity.title")}
          </Text>
          <Text style={[styles.paragraph, { color: colors.grey }]}>
            {t("privacyAndSecurity.intro")}
          </Text>

          <Text style={[styles.subtitle, { color: colors.text }]}>
            {t("privacyAndSecurity.dataCollectionTitle")}
          </Text>
          <Text style={[styles.paragraph, { color: colors.grey }]}>
            {t("privacyAndSecurity.dataCollectionDesc")}
          </Text>

          <Text style={[styles.subtitle, { color: colors.text }]}>
            {t("privacyAndSecurity.dataUsageTitle")}
          </Text>
          <Text style={[styles.paragraph, { color: colors.grey }]}>
            {t("privacyAndSecurity.dataUsageDesc")}
          </Text>

          <Text style={[styles.subtitle, { color: colors.text }]}>
            {t("privacyAndSecurity.dataSharingTitle")}
          </Text>
          <Text style={[styles.paragraph, { color: colors.grey }]}>
            {t("privacyAndSecurity.dataSharingDesc")}
          </Text>

          <Text style={[styles.subtitle, { color: colors.text }]}>
            {t("privacyAndSecurity.dataSecurityTitle")}
          </Text>
          <Text style={[styles.paragraph, { color: colors.grey }]}>
            {t("privacyAndSecurity.dataSecurityDesc")}
          </Text>

          <Text style={[styles.subtitle, { color: colors.text }]}>
            {t("privacyAndSecurity.userRightsTitle")}
          </Text>
          <Text style={[styles.paragraph, { color: colors.grey }]}>
            {t("privacyAndSecurity.userRightsDesc")}
          </Text>

          <Text style={[styles.subtitle, { color: colors.text }]}>
            {t("privacyAndSecurity.policyChangesTitle")}
          </Text>
          <Text style={[styles.paragraph, { color: colors.grey }]}>
            {t("privacyAndSecurity.policyChangesDesc")}
          </Text>

          <Text style={[styles.subtitle, { color: colors.text }]}>
            {t("privacyAndSecurity.contactTitle")}
          </Text>
          <Text
            style={[styles.paragraph, { color: colors.grey, marginBottom: 40 }]}
          >
            {t("privacyAndSecurity.contactDesc")}
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
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
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

export default PrivacyAndSecurityScreen;

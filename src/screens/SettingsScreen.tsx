import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { RootStackParamList } from "../types/navigation";
import { useAppStore } from "../store/appStore";
import { useAppTheme } from "../hooks/useAppTheme";

type SettingsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Settings"
>;

const SettingsItem = React.memo(
  ({
    label,
    onPress,
    textColor,
    borderColor,
    accessibilityHint,
  }: {
    label: string;
    onPress?: () => void;
    textColor: string;
    borderColor: string;
    accessibilityHint?: string;
  }) => (
    <TouchableOpacity
      style={[styles.itemContainer, { borderBottomColor: borderColor }]}
      onPress={onPress}
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityHint={accessibilityHint}
    >
      <Text style={[styles.itemLabel, { color: textColor }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={24} color="#C7C7CC" />
    </TouchableOpacity>
  )
);

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { toggleTheme } = useAppStore();
  const { t } = useTranslation();
  const { colors, theme } = useAppTheme();
  const isDarkMode = theme === "dark";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1 }}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            accessibilityLabel={t("general.back")}
            accessibilityRole="button"
          >
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.headerText }]}>
            {t("settings.title")}
          </Text>
        </View>
        <View style={styles.listContainer}>
          <View
            style={[styles.itemContainer, { borderBottomColor: colors.border }]}
          >
            <Text style={[styles.itemLabel, { color: colors.text }]}>
              {t("settings.darkMode")}
            </Text>
            <Switch
              trackColor={{
                false: colors.switchInactive,
                true: colors.primary,
              }}
              thumbColor={isDarkMode ? colors.white : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleTheme}
              value={isDarkMode}
              accessibilityLabel={t("settings.darkMode")}
              accessibilityRole="switch"
            />
          </View>
          <SettingsItem
            label={t("settings.language")}
            onPress={() => navigation.navigate("Language")}
            textColor={colors.text}
            borderColor={colors.border}
            accessibilityHint={`Navigasi ke halaman ${t("settings.language")}`}
          />
          <SettingsItem
            label="Kontak Darurat"
            onPress={() => navigation.navigate("EmergencyContacts")}
            textColor={colors.text}
            borderColor={colors.border}
            accessibilityHint="Navigasi ke halaman Kontak Darurat"
          />
          <SettingsItem
            label={t("settings.helpAndGuide")}
            onPress={() => navigation.navigate("HelpAndGuide")}
            textColor={colors.text}
            borderColor={colors.border}
            accessibilityHint={`Navigasi ke halaman ${t(
              "settings.helpAndGuide"
            )}`}
          />
          <SettingsItem
            label={t("settings.privacyAndSecurity")}
            onPress={() => navigation.navigate("PrivacyAndSecurity")}
            textColor={colors.text}
            borderColor={colors.border}
            accessibilityHint={`Navigasi ke halaman ${t(
              "settings.privacyAndSecurity"
            )}`}
          />
          <SettingsItem
            label={t("settings.about")}
            onPress={() => navigation.navigate("About")}
            textColor={colors.text}
            borderColor={colors.border}
            accessibilityHint={`Navigasi ke halaman ${t("settings.about")}`}
          />
        </View>
        <Text style={[styles.footerText, { color: colors.footerText }]}>
          {t("settings.appName")}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  listContainer: { flex: 1, paddingHorizontal: 16, marginTop: 10 },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  itemLabel: { fontSize: 17 },
  footerText: {
    textAlign: "center",
    fontSize: 16,
    paddingBottom: 60,
  },
});

export default SettingsScreen;

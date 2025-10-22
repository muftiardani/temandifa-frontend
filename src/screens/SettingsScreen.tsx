import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { RootStackParamList } from "../types/navigation";
import { useAppStore } from "../store/appStore";
import { useAppTheme } from "../hooks/useAppTheme";
import { useAuthStore } from "../store/authStore";

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
    icon,
  }: {
    label: string;
    onPress?: () => void;
    textColor: string;
    borderColor: string;
    accessibilityHint?: string;
    icon: keyof typeof Ionicons.glyphMap;
  }) => {
    const { colors } = useAppTheme();
    const { t } = useTranslation();
    return (
      <TouchableOpacity
        style={[styles.itemContainer, { borderBottomColor: borderColor }]}
        onPress={onPress}
        accessibilityLabel={
          label + (onPress ? t("general.accessibility.buttonSuffix") : "")
        }
        accessibilityRole="button"
        accessibilityHint={accessibilityHint}
      >
        <View style={styles.itemContent}>
          <Ionicons
            name={icon}
            size={24}
            color={colors.primary}
            style={styles.icon}
          />
          <Text style={[styles.itemLabel, { color: textColor }]}>{label}</Text>
        </View>
        {onPress && (
          <Ionicons name="chevron-forward" size={24} color={colors.chevron} />
        )}
      </TouchableOpacity>
    );
  }
);

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { toggleTheme } = useAppStore();
  const { t } = useTranslation();
  const { colors, theme } = useAppTheme();
  const { isGuest } = useAuthStore();
  const isDarkMode = theme === "dark";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1 }}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            accessibilityLabel={
              t("general.back") + t("general.accessibility.buttonSuffix")
            }
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
            <View style={styles.itemContent}>
              <Ionicons
                name="moon-outline"
                size={24}
                color={colors.primary}
                style={styles.icon}
              />
              <Text style={[styles.itemLabel, { color: colors.text }]}>
                {t("settings.darkMode")}
              </Text>
            </View>
            <Switch
              trackColor={{
                false: colors.switchInactive,
                true: colors.primary,
              }}
              thumbColor={isDarkMode ? colors.white : colors.switchThumb}
              ios_backgroundColor={colors.darkGrey}
              onValueChange={toggleTheme}
              value={isDarkMode}
              accessibilityLabel={t("settings.darkMode")}
              accessibilityRole="switch"
            />
          </View>

          <SettingsItem
            icon="language-outline"
            label={t("settings.language")}
            onPress={() => navigation.navigate("Language")}
            textColor={colors.text}
            borderColor={colors.border}
            accessibilityHint={t("settings.accessibility.navigateToHint", {
              pageName: t("settings.language"),
            })}
          />
          {!isGuest && (
            <>
              <SettingsItem
                icon="shield-checkmark-outline"
                label={t("settings.emergencyContacts")}
                onPress={() => navigation.navigate("EmergencyContacts")}
                textColor={colors.text}
                borderColor={colors.border}
                accessibilityHint={t("settings.accessibility.navigateToHint", {
                  pageName: t("settings.emergencyContacts"),
                })}
              />
              <SettingsItem
                icon="list-outline"
                label={t("settings.sessionManagement")}
                onPress={() => navigation.navigate("SessionManagement")}
                textColor={colors.text}
                borderColor={colors.border}
                accessibilityHint={t("settings.accessibility.navigateToHint", {
                  pageName: t("settings.sessionManagement"),
                })}
              />
            </>
          )}
          <SettingsItem
            icon="help-circle-outline"
            label={t("settings.helpAndGuide")}
            onPress={() => navigation.navigate("HelpAndGuide")}
            textColor={colors.text}
            borderColor={colors.border}
            accessibilityHint={t("settings.accessibility.navigateToHint", {
              pageName: t("settings.helpAndGuide"),
            })}
          />
          <SettingsItem
            icon="lock-closed-outline"
            label={t("settings.privacyAndSecurity")}
            onPress={() => navigation.navigate("PrivacyAndSecurity")}
            textColor={colors.text}
            borderColor={colors.border}
            accessibilityHint={t("settings.accessibility.navigateToHint", {
              pageName: t("settings.privacyAndSecurity"),
            })}
          />
          <SettingsItem
            icon="information-circle-outline"
            label={t("settings.about")}
            onPress={() => navigation.navigate("About")}
            textColor={colors.text}
            borderColor={colors.border}
            accessibilityHint={t("settings.accessibility.navigateToHint", {
              pageName: t("settings.about"),
            })}
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
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 16,
  },
  itemLabel: { fontSize: 17 },
  footerText: {
    textAlign: "center",
    fontSize: 16,
    paddingBottom: 60,
  },
});

export default SettingsScreen;

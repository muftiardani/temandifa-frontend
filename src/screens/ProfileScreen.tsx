import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { useAppTheme } from "../hooks/useAppTheme";
import { useAuthStore } from "../store/authStore";
import { RootStackParamList } from "../types/navigation";
import AnimatedPressable from "../components/common/AnimatedPressable";
import { jwtDecode } from "jwt-decode";

type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, "Profile">;

const SettingsItem = ({
  label,
  onPress,
  icon,
  textColor,
  borderColor,
  accessibilityHint,
}: {
  label: string;
  onPress: () => void;
  icon: keyof typeof Ionicons.glyphMap;
  textColor: string;
  borderColor: string;
  accessibilityHint?: string;
}) => {
  const { colors } = useAppTheme();
  return (
    <TouchableOpacity
      style={[styles.itemContainer, { borderBottomColor: borderColor }]}
      onPress={onPress}
      accessibilityLabel={label}
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
      <Ionicons name="chevron-forward" size={24} color={colors.chevron} />
    </TouchableOpacity>
  );
};

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const { logout, accessToken, isGuest } = useAuthStore();

  const userEmail = (() => {
    if (isGuest) return t("profile.guest");
    if (!accessToken) return t("profile.user");
    try {
      const decoded: { email: string } = jwtDecode(accessToken);
      return decoded.email;
    } catch (e) {
      return t("profile.user");
    }
  })();

  const handleLogout = () => {
    Alert.alert(
      t("dialogs.logoutConfirmationTitle"),
      t("dialogs.logoutConfirmationMessage"),
      [
        { text: t("dialogs.cancel"), style: "cancel" },
        {
          text: t("auth.logout"),
          style: "destructive",
          onPress: () => logout(),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.container}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            accessibilityLabel={t("general.back")}
            accessibilityHint={t("general.accessibility.backHint")}
            accessibilityRole="button"
          >
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.headerText }]}>
            {t("profile.title")}
          </Text>
        </View>

        <View style={styles.profileInfoContainer}>
          <Ionicons name="person-circle" size={100} color={colors.primary} />
          <Text style={[styles.emailText, { color: colors.text }]}>
            {userEmail}
          </Text>
        </View>

        <View style={styles.menuContainer}>
          <SettingsItem
            label={t("settings.helpAndGuide")}
            onPress={() => navigation.navigate("HelpAndGuide")}
            icon="help-circle-outline"
            textColor={colors.text}
            borderColor={colors.border}
            accessibilityHint={t("settings.accessibility.navigateToHint", {
              pageName: t("settings.helpAndGuide"),
            })}
          />
        </View>

        {!isGuest && (
          <View style={styles.logoutSection}>
            <AnimatedPressable
              style={[
                styles.logoutButton,
                { borderColor: colors.dangerBorder },
              ]}
              onPress={handleLogout}
              accessibilityLabel={t("auth.logout")}
              accessibilityRole="button"
            >
              <Text style={[styles.logoutButtonText, { color: colors.danger }]}>
                {t("auth.logout")}
              </Text>
            </AnimatedPressable>
          </View>
        )}
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
  profileInfoContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emailText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "500",
  },
  menuContainer: {
    paddingHorizontal: 16,
  },
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
  logoutSection: {
    paddingHorizontal: 16,
    marginTop: 40,
  },
  logoutButton: {
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
  },
  logoutButtonText: {
    fontSize: 17,
    fontWeight: "600",
  },
});

export default ProfileScreen;

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
import { RootStackParamList } from "../types/navigation";
import { commonStyles } from "../constants/Styles";
import { Colors } from "../constants/Colors";
import { useAppStore } from "../store/appStore";
import { useLocalization } from "../hooks/useLocalization";

type SettingsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Settings"
>;

const SettingsItem = React.memo(
  ({ label, onPress }: { label: string; onPress?: () => void }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={onPress}
      accessibilityLabel={`${label}. Tombol`}
      accessibilityRole="button"
    >
      <Text style={styles.itemLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={24} color="#C7C7CC" />
    </TouchableOpacity>
  )
);

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { theme, toggleTheme } = useAppStore();
  const t = useLocalization();
  const isDarkMode = theme === "dark";

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={styles.container}>
        <View style={commonStyles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={commonStyles.backButton}
            accessibilityLabel={`${t.general.back}. Tombol`}
            accessibilityRole="button"
          >
            <Ionicons name="chevron-back" size={24} color={Colors.black} />
          </TouchableOpacity>
          <Text style={commonStyles.headerTitle}>{t.settings.title}</Text>
        </View>

        <View style={styles.listContainer}>
          <View style={styles.itemContainer}>
            <Text style={styles.itemLabel}>{t.settings.darkMode}</Text>
            <Switch
              trackColor={{
                false: Colors.switchInactive,
                true: Colors.success,
              }}
              thumbColor={Colors.lightGrey}
              onValueChange={toggleTheme}
              value={isDarkMode}
              accessibilityLabel={`${t.settings.darkMode}, saat ini ${
                isDarkMode ? "aktif" : "tidak aktif"
              }. Saklar`}
              accessibilityRole="switch"
            />
          </View>
          <SettingsItem
            label={t.settings.language}
            onPress={() => navigation.navigate("Language")}
          />
          <SettingsItem
            label={t.settings.helpAndGuide}
            onPress={() => navigation.navigate("HelpAndGuide")}
          />
          <SettingsItem
            label={t.settings.privacyAndSecurity}
            onPress={() => navigation.navigate("PrivacyAndSecurity")}
          />
          <SettingsItem
            label={t.settings.about}
            onPress={() => navigation.navigate("About")}
          />
        </View>
        <Text style={styles.footerText}>{t.settings.appName}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContainer: { flex: 1, paddingHorizontal: 16, marginTop: 10 },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  itemLabel: { fontSize: 17 },
  footerText: {
    textAlign: "center",
    color: "#8A8A8E",
    fontSize: 16,
    paddingBottom: 60,
  },
});

export default SettingsScreen;

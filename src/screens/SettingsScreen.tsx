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
import { Strings } from "../constants/Strings";

type SettingsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Settings"
>;

const SettingsItem = ({
  label,
  onPress,
}: {
  label: string;
  onPress?: () => void;
}) => (
  <TouchableOpacity
    style={styles.itemContainer}
    onPress={onPress}
    accessibilityLabel={`${label}. Tombol`}
  >
    <Text style={styles.itemLabel}>{label}</Text>
    <Ionicons name="chevron-forward" size={24} color="#C7C7CC" />
  </TouchableOpacity>
);

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { theme, toggleTheme } = useAppStore();
  const isDarkMode = theme === "dark";

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={styles.container}>
        <View style={commonStyles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={commonStyles.backButton}
            accessibilityLabel={`${Strings.general.back}. Tombol`}
          >
            <Ionicons name="chevron-back" size={24} color={Colors.black} />
          </TouchableOpacity>
          <Text style={commonStyles.headerTitle}>{Strings.settings.title}</Text>
        </View>

        <View style={styles.listContainer}>
          <View style={styles.itemContainer}>
            <Text style={styles.itemLabel}>{Strings.settings.darkMode}</Text>
            <Switch
              trackColor={{
                false: Colors.switchInactive,
                true: Colors.success,
              }}
              thumbColor={Colors.lightGrey}
              onValueChange={toggleTheme}
              value={isDarkMode}
              accessibilityLabel={`${Strings.settings.darkMode}, saat ini ${
                isDarkMode ? "aktif" : "tidak aktif"
              }. Saklar`}
            />
          </View>
          <SettingsItem
            label={Strings.settings.language}
            onPress={() => navigation.navigate("Language")}
          />
          <SettingsItem
            label={Strings.settings.helpAndGuide}
            onPress={() => console.log(Strings.settings.helpAndGuide)}
          />
          <SettingsItem
            label={Strings.settings.privacyAndSecurity}
            onPress={() => console.log(Strings.settings.privacyAndSecurity)}
          />
          <SettingsItem
            label={Strings.settings.about}
            onPress={() => navigation.navigate("About")}
          />
        </View>
        <Text style={styles.footerText}>{Strings.settings.appName}</Text>
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

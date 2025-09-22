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
            accessibilityLabel="Kembali. Tombol"
          >
            <Ionicons name="chevron-back" size={24} color={Colors.black} />
          </TouchableOpacity>
          <Text style={commonStyles.headerTitle}>Pengaturan</Text>
        </View>

        <View style={styles.listContainer}>
          <View style={styles.itemContainer}>
            <Text style={styles.itemLabel}>Mode Gelap</Text>
            <Switch
              trackColor={{
                false: Colors.switchInactive,
                true: Colors.success,
              }}
              thumbColor={Colors.lightGrey}
              onValueChange={toggleTheme}
              value={isDarkMode}
              accessibilityLabel={`Mode Gelap, saat ini ${
                isDarkMode ? "aktif" : "tidak aktif"
              }. Saklar`}
            />
          </View>
          <SettingsItem
            label="Kontak Darurat"
            onPress={() => console.log("Kontak Darurat")}
          />
          <SettingsItem label="Bahasa" onPress={() => console.log("Bahasa")} />
          <SettingsItem
            label="Panduan & Bantuan"
            onPress={() => console.log("Panduan & Bantuan")}
          />
          <SettingsItem
            label="Privasi & Keamanan"
            onPress={() => console.log("Privasi & Keamanan")}
          />
          <SettingsItem
            label="Tentang Aplikasi"
            onPress={() => console.log("Tentang Aplikasi")}
          />
        </View>

        <Text style={styles.footerText}>TemanDifa</Text>
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
    paddingBottom: 40,
  },
});

export default SettingsScreen;

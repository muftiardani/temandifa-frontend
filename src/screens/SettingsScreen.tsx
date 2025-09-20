import React, { useState } from "react";
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

type SettingsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Settings"
>;

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const [isThemeEnabled, setIsThemeEnabled] = useState(false);
  const toggleThemeSwitch = () =>
    setIsThemeEnabled((previousState) => !previousState);

  const SettingsItem = ({
    label,
    onPress,
  }: {
    label: string;
    onPress?: () => void;
  }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
      <Text style={styles.itemLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={24} color="#C7C7CC" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pengaturan</Text>
        </View>

        {/* List Pengaturan */}
        <View style={styles.listContainer}>
          {/* Tema */}
          <View style={styles.itemContainer}>
            <Text style={styles.itemLabel}>Tema</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#34C759" }}
              thumbColor={"#f4f3f4"}
              onValueChange={toggleThemeSwitch}
              value={isThemeEnabled}
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
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
  },
  itemLabel: {
    fontSize: 17,
  },
  footerText: {
    textAlign: "center",
    color: "#8A8A8E",
    fontSize: 16,
    paddingBottom: 40,
  },
});

export default SettingsScreen;

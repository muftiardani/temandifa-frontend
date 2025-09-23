import React from "react";
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import HomeButton from "../components/common/HomeButton";
import { ScreenNavigationProp } from "../types/navigation";
import { Colors } from "../constants/Colors";
import { Strings } from "../constants/Strings";

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<ScreenNavigationProp>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{Strings.greetings.morning}</Text>
          <Text style={styles.headerSubtitle}>{Strings.home.subtitle}</Text>
        </View>
        <View style={styles.buttonGrid}>
          <HomeButton
            title={Strings.home.cameraButton}
            icon="camera"
            backgroundColor={Colors.primary}
            layout="horizontal"
            style={{ width: "100%", height: 135 }}
            onPress={() => navigation.navigate("Camera")}
          />
          <View style={styles.row}>
            <HomeButton
              title={Strings.home.scanButton}
              icon="scan"
              backgroundColor={Colors.accent}
              style={{ flex: 1, height: 140 }}
              onPress={() => navigation.navigate("Scan")}
            />
            <HomeButton
              title={Strings.home.voiceButton}
              icon="mic"
              backgroundColor={Colors.secondary}
              style={{ flex: 1, height: 140 }}
              onPress={() => navigation.navigate("Voice")}
            />
          </View>
        </View>
      </View>
      <View style={styles.bottomBar}>
        <View style={styles.helpSettingsContainer}>
          <TouchableOpacity
            accessibilityLabel={`${Strings.home.helpButton}. Tombol`}
            accessibilityHint={`Ketuk dua kali untuk membuka panduan`}
          >
            <Ionicons
              name="help-circle-outline"
              size={40}
              color={Colors.white}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Settings")}
            accessibilityLabel={`${Strings.home.settingsButton}. Tombol`}
            accessibilityHint={`Ketuk dua kali untuk membuka ${Strings.settings.title}`}
          >
            <Ionicons name="settings-outline" size={32} color={Colors.white} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.emergencyButton}
          onPress={() => navigation.navigate("VideoCall")}
          accessibilityLabel={`${Strings.home.emergencyButton}. Tombol`}
          accessibilityHint={`Ketuk dua kali untuk memulai panggilan video darurat`}
        >
          <Ionicons name="call" size={34} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.white },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 40 },
  header: { marginBottom: 30 },
  headerTitle: {
    fontSize: 36,
    fontWeight: "700",
    marginBottom: 8,
    color: Colors.black,
  },
  headerSubtitle: { fontSize: 18, color: Colors.grey },
  buttonGrid: { gap: 20 },
  row: { flexDirection: "row", gap: 20 },
  bottomBar: {
    position: "absolute",
    bottom: 60,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  helpSettingsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.darkGrey,
    borderRadius: 50,
    height: 75,
    paddingHorizontal: 30,
    gap: 25,
  },
  emergencyButton: {
    backgroundColor: Colors.danger,
    width: 75,
    height: 75,
    borderRadius: 37.5,
    alignItems: "center",
    justifyContent: "center",
  },
});
export default HomeScreen;

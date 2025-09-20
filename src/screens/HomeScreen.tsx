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

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<ScreenNavigationProp>();

  const handleCameraPress = () => {
    navigation.navigate("Camera");
  };

  const handleScanPress = () => {
    navigation.navigate("Scan");
  };

  const handleVoicePress = () => {
    navigation.navigate("Voice");
  };

  const handleSettingsPress = () => {
    navigation.navigate("Settings");
  };

  const handleEmergencyPress = () => {
    navigation.navigate("VideoCall");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Selamat Pagi</Text>
          <Text style={styles.headerSubtitle}>
            Bagaimana saya dapat membantu anda hari ini?
          </Text>
        </View>

        <View style={styles.buttonGrid}>
          {/* Kamera */}
          <HomeButton
            title="Kamera"
            icon="camera"
            backgroundColor="#3F7EF3"
            layout="horizontal"
            style={{ width: "100%", height: 135 }}
            onPress={handleCameraPress}
          />

          {/* Scan & Voice */}
          <View style={styles.row}>
            <HomeButton
              title="Scan"
              icon="scan"
              backgroundColor="#ED6A5A"
              style={{ flex: 1, height: 140 }}
              onPress={handleScanPress}
            />
            <HomeButton
              title="Voice"
              icon="mic"
              backgroundColor="#17BEBB"
              style={{ flex: 1, height: 140 }}
              onPress={handleVoicePress}
            />
          </View>
        </View>
      </View>

      <View style={styles.bottomBar}>
        {/* Help & Settings */}
        <View style={styles.helpSettingsContainer}>
          <TouchableOpacity>
            <Ionicons name="help-circle-outline" size={40} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSettingsPress}>
            <Ionicons name="settings-outline" size={32} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Emergency Call */}
        <TouchableOpacity
          style={styles.emergencyButton}
          onPress={handleEmergencyPress}
        >
          <Ionicons name="call" size={34} color="#fff" />
        </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: "700",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 18,
    color: "#666",
  },
  buttonGrid: {
    gap: 20,
  },
  row: {
    flexDirection: "row",
    gap: 20,
  },
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
    backgroundColor: "#383D3B",
    borderRadius: 50,
    height: 75,
    paddingHorizontal: 30,
    gap: 25,
  },
  emergencyButton: {
    backgroundColor: "#CC444B",
    width: 75,
    height: 75,
    borderRadius: 37.5,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default HomeScreen;

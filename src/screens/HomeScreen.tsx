import React, { useEffect } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

import HomeButton from "../components/common/HomeButton";
import { ScreenNavigationProp } from "../types/navigation";
import { Colors } from "../constants/Colors";
import { useLocalization } from "../hooks/useLocalization";

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<ScreenNavigationProp>();
  const t = useLocalization();

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  useEffect(() => {
    const animationConfig = { duration: 600, easing: Easing.out(Easing.ease) };
    opacity.value = withTiming(1, animationConfig);
    translateY.value = withTiming(0, animationConfig);
  }, []);

  const handleCameraPress = () => navigation.navigate("Camera");
  const handleScanPress = () => navigation.navigate("Scan");
  const handleVoicePress = () => navigation.navigate("Voice");
  const handleSettingsPress = () => navigation.navigate("Settings");
  const handleEmergencyPress = () => navigation.navigate("VideoCall");

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.container, animatedContainerStyle]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t.greetings.morning}</Text>
          <Text style={styles.headerSubtitle}>{t.home.subtitle}</Text>
        </View>

        <View style={styles.buttonGrid}>
          <HomeButton
            title={t.home.cameraButton}
            icon="camera"
            backgroundColor={Colors.primary}
            layout="horizontal"
            style={{ width: "100%", height: 135 }}
            onPress={handleCameraPress}
          />
          <View style={styles.row}>
            <HomeButton
              title={t.home.scanButton}
              icon="scan"
              backgroundColor={Colors.accent}
              style={{ flex: 1, height: 140 }}
              onPress={handleScanPress}
            />
            <HomeButton
              title={t.home.voiceButton}
              icon="mic"
              backgroundColor={Colors.secondary}
              style={{ flex: 1, height: 140 }}
              onPress={handleVoicePress}
            />
          </View>
        </View>

        <View style={styles.bottomBar}>
          <View style={styles.helpSettingsContainer}>
            <TouchableOpacity
              accessibilityLabel={`${t.home.helpButton}. Tombol`}
              accessibilityHint={`Ketuk dua kali untuk membuka panduan`}
              accessibilityRole="button"
            >
              <Ionicons
                name="help-circle-outline"
                size={40}
                color={Colors.white}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSettingsPress}
              accessibilityLabel={`${t.home.settingsButton}. Tombol`}
              accessibilityHint={`Ketuk dua kali untuk membuka ${t.settings.title}`}
              accessibilityRole="button"
            >
              <Ionicons
                name="settings-outline"
                size={32}
                color={Colors.white}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.emergencyButton}
            onPress={handleEmergencyPress}
            accessibilityLabel={`${t.home.emergencyButton}. Tombol`}
            accessibilityHint={`Ketuk dua kali untuk memulai panggilan video darurat`}
            accessibilityRole="button"
          >
            <Ionicons name="call" size={34} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </Animated.View>
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

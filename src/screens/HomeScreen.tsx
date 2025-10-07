import React, { useEffect } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import HomeButton from "../components/common/HomeButton";
import { RootStackParamList } from "../types/navigation";
import { useAppTheme } from "../hooks/useAppTheme";
import { useAuthStore } from "../store/authStore";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { t, colors } = useAppTheme();
  const { isAuthenticated } = useAuthStore();

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return t.greetings.morning;
    if (currentHour < 15) return t.greetings.afternoon;
    if (currentHour < 19) return t.greetings.evening;
    return t.greetings.night;
  };

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const animatedContainerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  useEffect(() => {
    const animationConfig = { duration: 600, easing: Easing.out(Easing.ease) };
    opacity.value = withTiming(1, animationConfig);
    translateY.value = withTiming(0, animationConfig);
  }, [opacity, translateY]);

  const handleCameraPress = () => navigation.navigate("Camera");
  const handleScanPress = () => navigation.navigate("Scan");
  const handleVoicePress = () => navigation.navigate("Voice");
  const handleSettingsPress = () => navigation.navigate("Settings");

  const handleVideoCallPress = () => {
    if (isAuthenticated) {
      navigation.navigate("Dial");
    } else {
      Alert.alert(
        "Fitur Khusus Pengguna",
        "Anda harus mendaftar atau login untuk menggunakan fitur Panggilan.",
        [
          { text: "Nanti Saja", style: "cancel" },
          {
            text: "Login Sekarang",
            onPress: () => useAuthStore.getState().logout(),
          },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Animated.View style={[styles.container, animatedContainerStyle]}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.headerText }]}>
            {getGreeting()}
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.grey }]}>
            {t.home.subtitle}
          </Text>
        </View>

        <View style={styles.buttonGrid}>
          <HomeButton
            title={t.home.cameraButton}
            icon="camera"
            backgroundColor={colors.primary}
            layout="horizontal"
            style={{ width: "100%", height: 135 }}
            onPress={handleCameraPress}
          />
          <View style={styles.row}>
            <HomeButton
              title={t.home.scanButton}
              icon="scan"
              backgroundColor={colors.accent}
              style={{ flex: 1, height: 140 }}
              onPress={handleScanPress}
            />
            <HomeButton
              title={t.home.voiceButton}
              icon="mic"
              backgroundColor={colors.secondary}
              style={{ flex: 1, height: 140 }}
              onPress={handleVoicePress}
            />
          </View>
        </View>

        <View style={styles.bottomBar}>
          <View style={styles.helpSettingsContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate("HelpAndGuide")}
              accessibilityLabel={t.home.helpButton}
              accessibilityHint="Membuka panduan aplikasi"
              accessibilityRole="button"
            >
              <Ionicons
                name="help-circle-outline"
                size={40}
                color={colors.white}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSettingsPress}
              accessibilityLabel={t.home.settingsButton}
              accessibilityHint={`Membuka ${t.settings.title}`}
              accessibilityRole="button"
            >
              <Ionicons
                name="settings-outline"
                size={32}
                color={colors.white}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[
              styles.emergencyButton,
              !isAuthenticated && { backgroundColor: colors.darkGrey },
            ]}
            onPress={handleVideoCallPress}
            accessibilityLabel="Panggilan Video"
            accessibilityHint={
              isAuthenticated
                ? "Membuka layar untuk memulai panggilan video"
                : "Login diperlukan untuk fitur ini"
            }
            accessibilityRole="button"
          >
            <Ionicons name="call" size={34} color={colors.white} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 40 },
  header: { marginBottom: 30 },
  headerTitle: { fontSize: 36, fontWeight: "700", marginBottom: 8 },
  headerSubtitle: { fontSize: 18 },
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

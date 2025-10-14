import React, { useEffect, ReactNode } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StyleProp,
  ViewStyle,
} from "react-native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  withDelay,
} from "react-native-reanimated";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import HomeButton from "../components/common/HomeButton";
import { RootStackParamList } from "../types/navigation";
import { useAppTheme } from "../hooks/useAppTheme";
import { useAuthStore } from "../store/authStore";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

interface AnimatedViewProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  delay?: number;
}

const AnimatedView: React.FC<AnimatedViewProps> = ({
  children,
  style,
  delay = 0,
}) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  useEffect(() => {
    const animationConfig = { duration: 600, easing: Easing.out(Easing.ease) };
    opacity.value = withDelay(delay, withTiming(1, animationConfig));
    translateY.value = withDelay(delay, withTiming(0, animationConfig));
  }, [opacity, translateY, delay]);

  return (
    <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
  );
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const { isAuthenticated } = useAuthStore();

  const bottomBarOpacity = useSharedValue(0);
  const leftContainerTranslateX = useSharedValue(-50);
  const rightButtonTranslateX = useSharedValue(50);

  const animatedLeftContainerStyle = useAnimatedStyle(() => ({
    opacity: bottomBarOpacity.value,
    transform: [{ translateX: leftContainerTranslateX.value }],
  }));

  const animatedRightButtonStyle = useAnimatedStyle(() => ({
    opacity: bottomBarOpacity.value,
    transform: [{ translateX: rightButtonTranslateX.value }],
  }));

  useEffect(() => {
    const animationConfig = { duration: 700, easing: Easing.out(Easing.ease) };
    bottomBarOpacity.value = withDelay(300, withTiming(1, animationConfig));
    leftContainerTranslateX.value = withDelay(
      300,
      withTiming(0, animationConfig)
    );
    rightButtonTranslateX.value = withDelay(
      350,
      withTiming(0, animationConfig)
    );
  }, [bottomBarOpacity, leftContainerTranslateX, rightButtonTranslateX]);

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return t("greetings.morning");
    if (currentHour < 15) return t("greetings.afternoon");
    if (currentHour < 19) return t("greetings.evening");
    return t("greetings.night");
  };

  const handleCameraPress = () => navigation.navigate("Camera");
  const handleScanPress = () => navigation.navigate("Scan");
  const handleVoicePress = () => navigation.navigate("Voice");
  const handleSettingsPress = () => navigation.navigate("Settings");

  const handleVideoCallPress = () => {
    if (isAuthenticated) {
      navigation.navigate("Dial");
    } else {
      Alert.alert(t("auth.premiumFeature"), t("auth.premiumFeatureMessage"), [
        { text: t("auth.later"), style: "cancel" },
        {
          text: t("auth.loginNow"),
          onPress: () => useAuthStore.getState().logout(),
        },
      ]);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.container}>
        <AnimatedView delay={0}>
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: colors.headerText }]}>
              {getGreeting()}
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.grey }]}>
              {t("home.subtitle")}
            </Text>
          </View>
        </AnimatedView>

        <View style={styles.buttonGrid}>
          <AnimatedView delay={100}>
            <HomeButton
              title={t("home.cameraButton")}
              icon="camera"
              backgroundColor={colors.primary}
              layout="horizontal"
              style={{ width: "100%", height: 140 }}
              onPress={handleCameraPress}
              accessibilityLabel={t("home.cameraButton")}
            />
          </AnimatedView>
          <AnimatedView delay={200}>
            <View style={styles.row}>
              <HomeButton
                title={t("home.scanButton")}
                icon="scan"
                backgroundColor={colors.accent}
                style={{ flex: 1, height: 140 }}
                onPress={handleScanPress}
                accessibilityLabel={t("home.scanButton")}
              />
              <HomeButton
                title={t("home.voiceButton")}
                icon="mic"
                backgroundColor={colors.secondary}
                style={{ flex: 1, height: 140 }}
                onPress={handleVoicePress}
                accessibilityLabel={t("home.voiceButton")}
              />
            </View>
          </AnimatedView>
        </View>

        <View style={styles.bottomBar}>
          <Animated.View style={animatedLeftContainerStyle}>
            <View
              style={[
                styles.helpSettingsContainer,
                { backgroundColor: colors.darkGrey },
              ]}
            >
              <TouchableOpacity
                onPress={() => navigation.navigate("HelpAndGuide")}
                accessibilityLabel={t("home.helpButton")}
                accessibilityHint="Membuka panduan aplikasi"
                accessibilityRole="button"
              >
                <Ionicons
                  name="help-circle-outline"
                  size={44}
                  color={colors.white}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSettingsPress}
                accessibilityLabel={t("home.settingsButton")}
                accessibilityHint={`Membuka ${t("settings.title")}`}
                accessibilityRole="button"
              >
                <Ionicons
                  name="settings-outline"
                  size={34}
                  color={colors.white}
                />
              </TouchableOpacity>
            </View>
          </Animated.View>
          <Animated.View style={animatedRightButtonStyle}>
            <TouchableOpacity
              style={[
                styles.emergencyButton,
                { backgroundColor: colors.danger },
                !isAuthenticated && { backgroundColor: colors.darkGrey },
              ]}
              onPress={handleVideoCallPress}
              accessibilityLabel={t("home.emergencyButton")}
              accessibilityHint={
                isAuthenticated
                  ? "Membuka layar untuk memulai panggilan video"
                  : "Login diperlukan untuk fitur ini"
              }
              accessibilityRole="button"
            >
              <Ionicons name="call" size={34} color={colors.white} />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: { marginBottom: 25 },
  headerTitle: { fontSize: 36, fontWeight: "700", marginBottom: 4, paddingHorizontal: 20 },
  headerSubtitle: { fontSize: 18, paddingHorizontal: 20 },
  buttonGrid: { gap: 10, paddingHorizontal: 15 },
  row: { flexDirection: "row", gap: 10 },
  bottomBar: {
    position: "absolute",
    bottom: 60,
    left: 15,
    right: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  helpSettingsContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 50,
    height: 75,
    paddingHorizontal: 20,
    gap: 20,
  },
  emergencyButton: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default HomeScreen;

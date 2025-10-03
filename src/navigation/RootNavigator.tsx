import React, { useState, useCallback, useEffect } from "react";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SplashScreen from "expo-splash-screen";

import AnimatedSplashScreen from "../screens/AnimatedSplashScreen";
import OnboardingScreen from "../screens/OnboardingScreen";
import HomeScreen from "../screens/HomeScreen";
import CameraScreen from "../screens/CameraScreen";
import ScanScreen from "../screens/ScanScreen";
import VoiceScreen from "../screens/VoiceScreen";
import SettingsScreen from "../screens/SettingsScreen";
import AgoraVideoCallScreen from "../screens/AgoraVideoCallScreen";
import ScanResultScreen from "../screens/ScanResultScreen";
import VoiceResultScreen from "../screens/VoiceResultScreen";
import DocumentScannerScreen from "../screens/DocumentScannerScreen";
import LanguageScreen from "../screens/LanguageScreen";
import HelpAndGuideScreen from "../screens/HelpAndGuideScreen";
import PrivacyAndSecurityScreen from "../screens/PrivacyAndSecurityScreen";
import AboutScreen from "../screens/AboutScreen";

import { RootStackParamList } from "../types/navigation";
import { useAppStore } from "../store/appStore";
import { lightColors, darkColors } from "../constants/Colors";

const Stack = createNativeStackNavigator<RootStackParamList>();

const MyLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: lightColors.background,
    card: lightColors.card,
    text: lightColors.text,
    border: lightColors.border,
  },
};

const MyDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: darkColors.background,
    card: darkColors.card,
    text: darkColors.text,
    border: darkColors.border,
  },
};

const AppNavigator = () => (
  <Stack.Navigator
    initialRouteName="Onboarding"
    screenOptions={{ headerShown: false, animation: "slide_from_right" }}
  >
    <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ animation: "fade" }}/>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Camera" component={CameraScreen} />
    <Stack.Screen name="Scan" component={ScanScreen} />
    <Stack.Screen name="Voice" component={VoiceScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="DocumentScanner" component={DocumentScannerScreen} />
    <Stack.Screen name="Language" component={LanguageScreen} />
    <Stack.Screen name="HelpAndGuide" component={HelpAndGuideScreen} />
    <Stack.Screen
      name="PrivacyAndSecurity"
      component={PrivacyAndSecurityScreen}
    />
    <Stack.Screen name="About" component={AboutScreen} />
    <Stack.Screen
      name="VideoCall"
      component={AgoraVideoCallScreen}
      options={{ animation: "fade_from_bottom" }}
    />
    <Stack.Screen
      name="ScanResult"
      component={ScanResultScreen}
      options={{ animation: "fade_from_bottom" }}
    />
    <Stack.Screen
      name="VoiceResult"
      component={VoiceResultScreen}
      options={{ animation: "fade_from_bottom" }}
    />
  </Stack.Navigator>
);

const RootNavigator = () => {
  const [isAppReady, setAppReady] = useState(false);
  const [isSplashAnimationComplete, setSplashAnimationComplete] =
    useState(false);
  const theme = useAppStore((state) => state.theme);

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
      } finally {
        setAppReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (isAppReady) await SplashScreen.hideAsync();
  }, [isAppReady]);

  if (!isAppReady) return null;

  return (
    <NavigationContainer
      onReady={onLayoutRootView}
      theme={theme === "dark" ? MyDarkTheme : MyLightTheme}
    >
      {isSplashAnimationComplete ? (
        <AppNavigator />
      ) : (
        <AnimatedSplashScreen
          onAnimationComplete={() => setSplashAnimationComplete(true)}
        />
      )}
    </NavigationContainer>
  );
};

export default RootNavigator;

import React, { useState, useCallback, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SplashScreen from "expo-splash-screen";

import AnimatedSplashScreen from "../screens/AnimatedSplashScreen";
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
import AboutScreen from "../screens/AboutScreen";
import HelpAndGuideScreen from "../screens/HelpAndGuideScreen";
import PrivacyAndSecurityScreen from "../screens/PrivacyAndSecurityScreen";

import { RootStackParamList } from "../types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => (
  <Stack.Navigator
    initialRouteName="Home"
    screenOptions={{
      headerShown: false,
      animation: "slide_from_right",
    }}
  >
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Camera" component={CameraScreen} />
    <Stack.Screen name="Scan" component={ScanScreen} />
    <Stack.Screen name="Voice" component={VoiceScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="DocumentScanner" component={DocumentScannerScreen} />
    <Stack.Screen name="Language" component={LanguageScreen} />
    <Stack.Screen name="About" component={AboutScreen} />
    <Stack.Screen name="HelpAndGuide" component={HelpAndGuideScreen} />
    <Stack.Screen
      name="PrivacyAndSecurity"
      component={PrivacyAndSecurityScreen}
    />
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

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        // Lakukan tugas persiapan aplikasi di sini jika ada (misal: memuat font)
      } catch (e) {
        console.warn(e);
      } finally {
        setAppReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (isAppReady) {
      await SplashScreen.hideAsync();
    }
  }, [isAppReady]);

  if (!isAppReady) {
    return null;
  }

  return (
    <NavigationContainer onReady={onLayoutRootView}>
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

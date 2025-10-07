import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  NavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SplashScreen from "expo-splash-screen";
import * as Notifications from "expo-notifications";

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
import DialScreen from "../screens/DialScreen";
import IncomingCallScreen from "../screens/IncomingCallScreen";
import OutgoingCallScreen from "../screens/OutgoingCallScreen";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";

import { useAuthStore } from "../store/authStore";
import { useAppStore } from "../store/appStore";
import { useCallStore } from "../store/callStore";

import { RootStackParamList, AuthStackParamList } from "../types/navigation";
import { lightColors, darkColors } from "../constants/Colors";

const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

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

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const AuthNavigator = () => (
  <AuthStack.Navigator
    screenOptions={{ headerShown: false, animation: "slide_from_right" }}
  >
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
    <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </AuthStack.Navigator>
);

const AppNavigator = () => (
  <Stack.Navigator
    initialRouteName="Onboarding"
    screenOptions={{ headerShown: false, animation: "slide_from_right" }}
  >
    <Stack.Screen
      name="Onboarding"
      component={OnboardingScreen}
      options={{ animation: "fade" }}
    />
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
      name="ScanResult"
      component={ScanResultScreen}
      options={{ animation: "fade_from_bottom" }}
    />
    <Stack.Screen
      name="VoiceResult"
      component={VoiceResultScreen}
      options={{ animation: "fade_from_bottom" }}
    />
    <Stack.Screen name="Dial" component={DialScreen} />
    <Stack.Screen name="OutgoingCall" component={OutgoingCallScreen} />
    <Stack.Screen
      name="IncomingCall"
      component={IncomingCallScreen}
      options={{ animation: "fade_from_bottom" }}
    />
    <Stack.Screen
      name="VideoCall"
      component={AgoraVideoCallScreen}
      options={{ animation: "fade_from_bottom" }}
    />
  </Stack.Navigator>
);

const RootNavigator = () => {
  const [isSplashAnimationComplete, setSplashAnimationComplete] =
    useState(false);
  const theme = useAppStore((state) => state.theme);
  const { setIncomingCall } = useCallStore();
  const navigationRef =
    useRef<NavigationContainerRef<RootStackParamList>>(null);

  const { isAuthenticated, isGuest, isLoading, loadToken } = useAuthStore();

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
      await loadToken();
    }
    prepare();

    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        const data = notification.request.content.data;
        if (data?.callId && data?.channelName) {
          setIncomingCall({
            callId: data.callId as string,
            channelName: data.channelName as string,
            callerName: (data.callerName as string) || "Panggilan Masuk",
          });
          navigationRef.current?.navigate("IncomingCall");
        }
      }
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {});

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, [loadToken, setIncomingCall]);

  const onLayoutRootView = useCallback(async () => {
    if (!isLoading) {
      await SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    return <AnimatedSplashScreen onAnimationComplete={() => {}} />;
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={onLayoutRootView}
      theme={theme === "dark" ? MyDarkTheme : MyLightTheme}
    >
      {isSplashAnimationComplete ? (
        isAuthenticated || isGuest ? (
          <AppNavigator />
        ) : (
          <AuthNavigator />
        )
      ) : (
        <AnimatedSplashScreen
          onAnimationComplete={() => setSplashAnimationComplete(true)}
        />
      )}
    </NavigationContainer>
  );
};

export default RootNavigator;

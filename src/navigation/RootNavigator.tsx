import React, { useState, useCallback, useEffect, useRef } from "react";
import { View } from "react-native";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  NavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SplashScreen from "expo-splash-screen";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

import LoadingIndicator from "../components/common/LoadingIndicator";
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
import {
  RootStackParamList,
  AuthStackParamList,
  RootNavigatorParamList,
} from "../types/navigation";
import { lightColors, darkColors } from "../constants/Colors";

const RootStack = createNativeStackNavigator<RootNavigatorParamList>();
const AppStack = createNativeStackNavigator<RootStackParamList>();
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
  <AppStack.Navigator
    initialRouteName="Home"
    screenOptions={{ headerShown: false, animation: "slide_from_right" }}
  >
    <AppStack.Screen name="Home" component={HomeScreen} />
    <AppStack.Screen name="Camera" component={CameraScreen} />
    <AppStack.Screen name="Scan" component={ScanScreen} />
    <AppStack.Screen name="Voice" component={VoiceScreen} />
    <AppStack.Screen name="Settings" component={SettingsScreen} />
    <AppStack.Screen name="DocumentScanner" component={DocumentScannerScreen} />
    <AppStack.Screen name="Language" component={LanguageScreen} />
    <AppStack.Screen name="HelpAndGuide" component={HelpAndGuideScreen} />
    <AppStack.Screen
      name="PrivacyAndSecurity"
      component={PrivacyAndSecurityScreen}
    />
    <AppStack.Screen name="About" component={AboutScreen} />
    <AppStack.Screen
      name="ScanResult"
      component={ScanResultScreen}
      options={{ animation: "fade_from_bottom" }}
    />
    <AppStack.Screen
      name="VoiceResult"
      component={VoiceResultScreen}
      options={{ animation: "fade_from_bottom" }}
    />
    <AppStack.Screen name="Dial" component={DialScreen} />
    <AppStack.Screen name="OutgoingCall" component={OutgoingCallScreen} />
    <AppStack.Screen
      name="IncomingCall"
      component={IncomingCallScreen}
      options={{ animation: "fade_from_bottom" }}
    />
    <AppStack.Screen
      name="VideoCall"
      component={AgoraVideoCallScreen}
      options={{ animation: "fade_from_bottom" }}
    />
  </AppStack.Navigator>
);

const RootNavigator = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const theme = useAppStore((state) => state.theme);
  const navigationRef = useRef<NavigationContainerRef<any>>(null);
  const {
    isAuthenticated,
    isGuest,
    isLoading: isAuthLoading,
    loadToken,
  } = useAuthStore();
  const { setIncomingCall } = useCallStore();

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
      try {
        const hasCompletedOnboarding = await AsyncStorage.getItem(
          "@hasCompletedOnboarding"
        );
        setIsFirstLaunch(hasCompletedOnboarding !== "true");
        await loadToken();
      } catch (e) {
        console.warn("Gagal menyiapkan aplikasi:", e);
        setIsFirstLaunch(false);
      }
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
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        if (data?.callId && data?.channelName) {
          setIncomingCall({
            callId: data.callId as string,
            channelName: data.channelName as string,
            callerName: (data.callerName as string) || "Panggilan Masuk",
          });
          navigationRef.current?.navigate("IncomingCall");
        }
      });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, [loadToken, setIncomingCall]);

  const onLayoutRootView = useCallback(async () => {
    if (!isAuthLoading && isFirstLaunch !== null) {
      await SplashScreen.hideAsync();
    }
  }, [isAuthLoading, isFirstLaunch]);

  if (isAuthLoading || isFirstLaunch === null) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: lightColors.background,
        }}
      >
        <LoadingIndicator />
      </View>
    );
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={onLayoutRootView}
      theme={theme === "dark" ? MyDarkTheme : MyLightTheme}
    >
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isFirstLaunch ? (
          <RootStack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : isAuthenticated || isGuest ? (
          <RootStack.Screen name="App" component={AppNavigator} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;

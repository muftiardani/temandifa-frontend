import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";
import * as Sentry from "@sentry/react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import HomeScreen from "./src/screens/HomeScreen";
import CameraScreen from "./src/screens/CameraScreen";
import ScanScreen from "./src/screens/ScanScreen";
import VoiceScreen from "./src/screens/VoiceScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import AgoraVideoCallScreen from "./src/screens/AgoraVideoCallScreen";
import ScanResultScreen from "./src/screens/ScanResultScreen";
import VoiceResultScreen from "./src/screens/VoiceResultScreen";
import DocumentScannerScreen from "./src/screens/DocumentScannerScreen";
import LanguageScreen from "./src/screens/LanguageScreen";
import AboutScreen from "./src/screens/AboutScreen";

import { RootStackParamList } from "./src/types/navigation";

Sentry.init({
  dsn: "https://3d3119812733a74dbb89780f4c0d2716@o4510066684264448.ingest.de.sentry.io/4510067148849232",
  debug: __DEV__,
  integrations: [Sentry.reactNavigationIntegration()],
  tracesSampleRate: 1.0,
});

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Camera"
            component={CameraScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Scan"
            component={ScanScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Voice"
            component={VoiceScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="VideoCall"
            component={AgoraVideoCallScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ScanResult"
            component={ScanResultScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="VoiceResult"
            component={VoiceResultScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DocumentScanner"
            component={DocumentScannerScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Language"
            component={LanguageScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="About"
            component={AboutScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </GestureHandlerRootView>
  );
};

export default Sentry.wrap(App);

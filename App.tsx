import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/HomeScreen";
import CameraScreen from "./src/screens/CameraScreen";
import ScanScreen from "./src/screens/ScanScreen";
import VoiceScreen from "./src/screens/VoiceScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import VideoCallScreen from "./src/screens/VideoCallScreen";
import ScanResultScreen from "./src/screens/ScanResultScreen";
import VoiceResultScreen from "./src/screens/VoiceResultScreen";
import DocumentScannerScreen from "./src/screens/DocumentScannerScreen";

import { RootStackParamList } from "./src/types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
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
          component={VideoCallScreen}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

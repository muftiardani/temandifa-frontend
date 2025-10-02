import { NavigationProp } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Home: undefined;
  Camera: undefined;
  Scan: undefined;
  Voice: undefined;
  Settings: undefined;
  VideoCall: undefined;
  ScanResult: { scannedText: string };
  VoiceResult: { transcribedText: string };
  DocumentScanner: undefined;
  Language: undefined;
  HelpAndGuide: undefined;
  PrivacyAndSecurity: undefined;
  About: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type ScreenNavigationProp = NavigationProp<RootStackParamList>;

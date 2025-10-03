import { NavigationProp } from "@react-navigation/native";

export type RootStackParamList = {
  Onboarding: undefined;
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

export type ScreenNavigationProp = NavigationProp<RootStackParamList>;

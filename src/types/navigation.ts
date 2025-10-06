import { NativeStackNavigationProp } from "@react-navigation/native-stack";

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
  Dial: undefined;
  IncomingCall: undefined;
  OutgoingCall: undefined;
};

export type ScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

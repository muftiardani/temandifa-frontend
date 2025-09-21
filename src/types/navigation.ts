import { NavigationProp } from "@react-navigation/native";

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
};

export type ScreenNavigationProp = NavigationProp<RootStackParamList>;

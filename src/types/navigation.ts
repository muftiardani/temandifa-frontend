import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { NavigatorScreenParams } from "@react-navigation/native";

export type RootNavigatorParamList = {
  Onboarding: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<RootStackParamList>;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

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

export type AppNavigationProp = NativeStackNavigationProp<
  RootStackParamList & AuthStackParamList & RootNavigatorParamList
>;

import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import * as LocalAuthentication from "expo-local-authentication";
import { authService } from "../services/authService";
import { useAuthStore } from "../store/authStore";
import { useAppStore } from "../store/appStore";
import { AuthStackParamList } from "../types/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

WebBrowser.maybeCompleteAuthSession();

type LoginNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Login"
>;

export const useLoginForm = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<LoginNavigationProp>();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const isLoading = useAppStore((state) => state.isLoading);
  const setIsLoading = useAppStore((state) => state.setIsLoading);
  const { setTokens, loginAsGuest, refreshAccessToken } = useAuthStore();
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  });

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (compatible && enrolled) {
        setIsBiometricSupported(true);
      }
    })();
  }, []);

  const handleGoogleLogin = async (googleAccessToken: string) => {
    setIsLoading(true);
    try {
      const { accessToken, refreshToken } = await authService.loginWithGoogle(
        googleAccessToken
      );
      await setTokens(accessToken, refreshToken, true);
    } catch (error: any) {
      const errorMessage =
        error.message === "networkError"
          ? t("general.networkError")
          : error.message || t("general.genericError");
      Toast.show({
        type: "error",
        text1: t("auth.loginFailed"),
        text2: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      if (authentication?.accessToken) {
        handleGoogleLogin(authentication.accessToken);
      }
    } else if (response?.type === "error") {
      Toast.show({
        type: "error",
        text1: t("auth.googleLoginFailed"),
        text2: t("auth.googleLoginError"),
      });
    }
  }, [response, t]);

  const handleBiometricLogin = async () => {
    try {
      const biometricAuth = await LocalAuthentication.authenticateAsync({
        promptMessage: t("auth.loginWithBiometrics"),
        cancelLabel: t("dialogs.cancel"),
        disableDeviceFallback: true,
      });

      if (biometricAuth.success) {
        setIsLoading(true);
        const newAccessToken = await refreshAccessToken();
        if (!newAccessToken) {
          Alert.alert(t("auth.loginFailed"), t("auth.sessionExpired"));
        }
        setIsLoading(false);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: t("general.error"),
        text2: t("auth.biometricAuthFailed"),
      });
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!login.trim() || !password.trim()) {
      Toast.show({
        type: "error",
        text1: t("general.failure"),
        text2: t("auth.allFieldsRequired"),
      });
      return;
    }
    setIsLoading(true);
    try {
      const { accessToken, refreshToken } = await authService.login(
        login,
        password
      );
      await setTokens(accessToken, refreshToken, rememberMe);
    } catch (error: any) {
      const errorMessage =
        error.message === "networkError"
          ? t("general.networkError")
          : error.message || t("general.genericError");
      Toast.show({
        type: "error",
        text1: t("auth.loginFailed"),
        text2: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToRegister = () => navigation.navigate("Register");
  const navigateToForgotPassword = () => navigation.navigate("ForgotPassword");

  return {
    t,
    login,
    setLogin,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    isLoading,
    isBiometricSupported,
    googleAuthRequest: request,
    promptGoogleAuth: promptAsync,
    handleLogin,
    handleBiometricLogin,
    loginAsGuest,
    navigateToRegister,
    navigateToForgotPassword,
  };
};

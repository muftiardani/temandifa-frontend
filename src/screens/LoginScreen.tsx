import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";
import { useAppTheme } from "../hooks/useAppTheme";
import { authService } from "../services/authService";
import { useAuthStore } from "../store/authStore";
import { AuthStackParamList } from "../types/navigation";
import { Ionicons } from "@expo/vector-icons";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import * as LocalAuthentication from "expo-local-authentication";

WebBrowser.maybeCompleteAuthSession();

const LOGO = require("../../assets/icon.png");

type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, "Login">;

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { colors } = useAppTheme();
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
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: t("general.error"),
        text2: t("auth.biometricAuthFailed"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (googleAccessToken: string) => {
    setIsLoading(true);
    try {
      const { accessToken, refreshToken } = await authService.loginWithGoogle(
        googleAccessToken
      );
      await setTokens(accessToken, refreshToken);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: t("auth.loginFailed"),
        text2: error.message || t("general.serverError"),
      });
    } finally {
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
      await setTokens(accessToken, refreshToken);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: t("auth.loginFailed"),
        text2: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.skipButton} onPress={loginAsGuest}>
          <Text style={[styles.skipText, { color: colors.primary }]}>
            {t("onboarding.skip")}
          </Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Image source={LOGO} style={styles.logo} />
          <Text style={[styles.title, { color: colors.text }]}>
            {t("auth.welcomeBack")}
          </Text>
          <Text style={[styles.subtitle, { color: colors.grey }]}>
            {t("auth.loginToContinue")}
          </Text>
        </View>

        <View
          style={[
            styles.inputContainer,
            { borderColor: colors.border, backgroundColor: colors.card },
          ]}
        >
          <Ionicons
            name="person-outline"
            size={22}
            color={colors.grey}
            style={styles.inputIcon}
          />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder={t("auth.usernameOrEmail")}
            placeholderTextColor={colors.grey}
            value={login}
            onChangeText={setLogin}
            autoCapitalize="none"
          />
          {isBiometricSupported && (
            <TouchableOpacity
              onPress={handleBiometricLogin}
              style={styles.biometricButton}
            >
              <Ionicons name="finger-print" size={28} color={colors.grey} />
            </TouchableOpacity>
          )}
        </View>

        <View
          style={[
            styles.inputContainer,
            { borderColor: colors.border, backgroundColor: colors.card },
          ]}
        >
          <Ionicons
            name="lock-closed-outline"
            size={22}
            color={colors.grey}
            style={styles.inputIcon}
          />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder={t("auth.password")}
            placeholderTextColor={colors.grey}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text
            style={[
              styles.linkText,
              { color: colors.primary, textAlign: "right", marginBottom: 20 },
            ]}
          >
            {t("auth.forgotPassword")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isLoading ? colors.grey : colors.primary },
          ]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.buttonText}>{t("auth.login")}</Text>
          )}
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.grey }]}>
            {t("auth.or")}
          </Text>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
        </View>

        <TouchableOpacity
          style={[styles.socialButton, { borderColor: colors.border }]}
          onPress={() => promptAsync()}
          disabled={!request || isLoading}
        >
          <Ionicons name="logo-google" size={24} color={colors.text} />
          <Text style={[styles.socialButtonText, { color: colors.text }]}>
            {t("auth.continueWithGoogle")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Register")}
          style={styles.footer}
        >
          <Text style={[styles.footerText, { color: colors.grey }]}>
            {t("auth.noAccount")}
            <Text style={{ color: colors.primary, fontWeight: "bold" }}>
              {t("auth.register")}
            </Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    padding: 15,
    fontSize: 16,
  },
  inputIcon: {
    marginRight: 10,
  },
  biometricButton: {
    padding: 10,
  },
  button: {
    width: "100%",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  linkText: {
    fontSize: 14,
    fontWeight: "500",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 30,
  },
  divider: { flex: 1, height: 1 },
  dividerText: { marginHorizontal: 10, fontSize: 12 },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
  },
  socialButtonText: { marginLeft: 10, fontSize: 16, fontWeight: "600" },
  footer: {
    marginTop: 30,
  },
  footerText: {
    textAlign: "center",
    fontSize: 14,
  },
  skipButton: {
    position: "absolute",
    top: 20,
    right: 20,
    padding: 10,
    zIndex: 1,
  },
  skipText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default LoginScreen;

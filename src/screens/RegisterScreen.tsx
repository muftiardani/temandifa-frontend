import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";
import { useAppTheme } from "../hooks/useAppTheme";
import { authService } from "../services/authService";
import { useAuthStore } from "../store/authStore";
import { AuthStackParamList } from "../types/navigation";
import ValidatedInput from "../components/common/ValidatedInput";
import AnimatedPressable from "../components/common/AnimatedPressable";

type RegisterScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  "Register"
>;

const LOGO = require("../../assets/icon.png");

const validateEmail = (email: string) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  const { colors } = useAppTheme();
  const { setTokens } = useAuthStore();

  const validatePassword = (password: string) => {
    if (password.length < 8) return t("auth.passwordMin8Chars");
    if (!/\d/.test(password)) return t("auth.passwordNeedsNumber");
    if (!/[a-z]/.test(password)) return t("auth.passwordNeedsLowercase");
    if (!/[A-Z]/.test(password)) return t("auth.passwordNeedsUppercase");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      return t("auth.passwordNeedsSymbol");
    return "";
  };

  useEffect(() => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password) === "";
    const doPasswordsMatch = password === confirmPassword && password !== "";

    setIsFormValid(isEmailValid && isPasswordValid && doPasswordsMatch);
  }, [email, password, confirmPassword]);

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (text.length > 0 && !validateEmail(text)) {
      setEmailError(t("auth.invalidEmail"));
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (text.length > 0) {
      setPasswordError(validatePassword(text));
    } else {
      setPasswordError("");
    }
    if (confirmPassword.length > 0 && text !== confirmPassword) {
      setConfirmPasswordError(t("auth.passwordsDoNotMatch"));
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (text.length > 0 && password !== text) {
      setConfirmPasswordError(t("auth.passwordsDoNotMatch"));
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleRegister = async () => {
    if (!isFormValid) {
      Toast.show({
        type: "error",
        text1: t("general.failure"),
        text2: t("auth.pleaseCheckFields"),
      });
      return;
    }

    setIsLoading(true);
    try {
      const { accessToken, refreshToken } = await authService.register({
        email,
        password,
      });
      await setTokens(accessToken, refreshToken);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: t("auth.registrationFailed"),
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
        <View style={styles.header}>
          <Image source={LOGO} style={styles.logo} />
          <Text style={[styles.title, { color: colors.text }]}>
            {t("auth.createAccount")}
          </Text>
          <Text style={[styles.subtitle, { color: colors.grey }]}>
            {t("auth.fillData")}
          </Text>
        </View>

        <ValidatedInput
          icon="mail-outline"
          placeholder={t("auth.email")}
          value={email}
          onChangeText={handleEmailChange}
          keyboardType="email-address"
          autoCapitalize="none"
          error={emailError}
          accessibilityLabel={t("auth.email")}
        />

        <ValidatedInput
          icon="lock-closed-outline"
          placeholder={t("auth.password")}
          value={password}
          onChangeText={handlePasswordChange}
          secureTextEntry
          error={passwordError}
          accessibilityLabel={t("auth.password")}
        />

        <ValidatedInput
          icon="lock-closed-outline"
          placeholder={t("auth.confirmPassword")}
          value={confirmPassword}
          onChangeText={handleConfirmPasswordChange}
          secureTextEntry
          error={confirmPasswordError}
          accessibilityLabel={t("auth.confirmPassword")}
        />

        <AnimatedPressable
          style={[
            styles.button,
            {
              backgroundColor:
                !isFormValid || isLoading ? colors.grey : colors.primary,
            },
          ]}
          onPress={handleRegister}
          disabled={!isFormValid || isLoading}
          accessibilityLabel={t("auth.register")}
          accessibilityRole="button"
        >
          {isLoading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.buttonText}>{t("auth.register")}</Text>
          )}
        </AnimatedPressable>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.footer}
          accessibilityRole="link"
          accessibilityLabel={`${t("auth.haveAccount")} ${t("auth.login")}`}
        >
          <Text style={[styles.footerText, { color: colors.grey }]}>
            {t("auth.haveAccount")}
            <Text style={{ color: colors.primary, fontWeight: "bold" }}>
              {t("auth.login")}
            </Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", padding: 20 },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 15,
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
  button: {
    width: "100%",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  footer: {
    marginTop: 30,
  },
  footerText: {
    textAlign: "center",
    fontSize: 14,
  },
});

export default RegisterScreen;

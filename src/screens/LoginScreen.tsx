import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../hooks/useAppTheme";
import { useLoginForm } from "../hooks/useLoginForm";
import ValidatedInput from "../components/common/ValidatedInput";
import AnimatedPressable from "../components/common/AnimatedPressable";

const LOGO = require("../../assets/auth-icon.png");

const LoginScreen: React.FC = () => {
  const {
    t,
    login,
    setLogin,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    isLoading,
    isBiometricSupported,
    googleAuthRequest,
    promptGoogleAuth,
    handleLogin,
    handleBiometricLogin,
    loginAsGuest,
    navigateToRegister,
    navigateToForgotPassword,
  } = useLoginForm();

  const { colors } = useAppTheme();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Image source={LOGO} style={styles.logo} />
          <Text style={[styles.title, { color: colors.text }]}>
            {t("auth.welcomeBack")}
          </Text>
          <Text style={[styles.subtitle, { color: colors.grey }]}>
            {t("auth.loginToContinue")}
          </Text>
        </View>

        <ValidatedInput
          icon="person-outline"
          placeholder={t("auth.usernameOrEmail")}
          value={login}
          onChangeText={setLogin}
          autoCapitalize="none"
          accessibilityLabel={t("auth.usernameOrEmail")}
          rightIcon={
            isBiometricSupported ? (
              <TouchableOpacity
                onPress={handleBiometricLogin}
                style={styles.biometricButton}
                accessibilityLabel={t("auth.loginWithBiometrics")}
                accessibilityRole="button"
              >
                <Ionicons name="finger-print" size={28} color={colors.grey} />
              </TouchableOpacity>
            ) : undefined
          }
        />

        <ValidatedInput
          icon="lock-closed-outline"
          placeholder={t("auth.password")}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          accessibilityLabel={t("auth.password")}
        />

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.rememberMeContainer}
            onPress={() => setRememberMe(!rememberMe)}
            accessibilityLabel={t("auth.rememberMe")}
            accessibilityState={{ checked: rememberMe }}
          >
            <Ionicons
              name={rememberMe ? "checkbox" : "square-outline"}
              size={24}
              color={colors.primary}
            />
            <Text
              style={[styles.linkText, { color: colors.text, marginLeft: 8 }]}
            >
              {t("auth.rememberMe")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={navigateToForgotPassword}
            accessibilityRole="link"
            accessibilityLabel={t("auth.forgotPassword")}
            accessibilityHint={t("auth.accessibility.forgotPasswordHint")}
          >
            <Text style={[styles.linkText, { color: colors.primary }]}>
              {t("auth.forgotPassword")}
            </Text>
          </TouchableOpacity>
        </View>

        <AnimatedPressable
          style={[
            styles.button,
            {
              backgroundColor: isLoading ? colors.grey : colors.primary,
              shadowColor: colors.black,
            },
          ]}
          onPress={handleLogin}
          disabled={isLoading}
          accessibilityLabel={
            t("auth.login") + t("general.accessibility.buttonSuffix")
          }
          accessibilityRole="button"
        >
          {isLoading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={[styles.buttonText, { color: colors.buttonText }]}>
              {t("auth.login")}
            </Text>
          )}
        </AnimatedPressable>

        <View style={styles.dividerContainer}>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.grey }]}>
            {t("auth.or")}
          </Text>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
        </View>

        <AnimatedPressable
          style={[styles.socialButton, { borderColor: colors.border }]}
          onPress={() => promptGoogleAuth()}
          disabled={!googleAuthRequest || isLoading}
          accessibilityLabel={
            t("auth.continueWithGoogle") +
            t("general.accessibility.buttonSuffix")
          }
          accessibilityRole="button"
        >
          <Ionicons name="logo-google" size={24} color={colors.text} />
          <Text style={[styles.socialButtonText, { color: colors.text }]}>
            {t("auth.continueWithGoogle")}
          </Text>
        </AnimatedPressable>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={loginAsGuest}
          accessibilityLabel={t("onboarding.skip")}
          accessibilityHint={t("onboarding.accessibility.skipHint")}
          accessibilityRole="button"
        >
          <Text style={[styles.skipText, { color: colors.grey }]}>
            {t("onboarding.skip")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={navigateToRegister}
          style={styles.footer}
          accessibilityRole="link"
          accessibilityLabel={`${t("auth.noAccount")} ${t("auth.register")}`}
          accessibilityHint={t("auth.accessibility.registerHint")}
        >
          <Text style={[styles.footerText, { color: colors.grey }]}>
            {t("auth.haveAccount")}{" "}
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
    width: 100,
    height: 100,
    marginBottom: 10,
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
  biometricButton: {
    padding: 10,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    width: "100%",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  linkText: {
    fontSize: 14,
    fontWeight: "500",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
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
    marginBottom: 20,
  },
  socialButtonText: { marginLeft: 10, fontSize: 16, fontWeight: "600" },
  footer: {
    marginTop: 20,
  },
  footerText: {
    textAlign: "center",
    fontSize: 14,
  },
  skipButton: {
    alignSelf: "center",
    padding: 10,
  },
  skipText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default LoginScreen;

import React from "react";
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
import { useAppTheme } from "../hooks/useAppTheme";
import { useRegisterForm } from "../hooks/useRegisterForm";
import ValidatedInput from "../components/common/ValidatedInput";
import AnimatedPressable from "../components/common/AnimatedPressable";

const LOGO = require("../../assets/auth-icon.png");

const RegisterScreen: React.FC = () => {
  const {
    t,
    email,
    password,
    confirmPassword,
    isLoading,
    emailError,
    passwordError,
    confirmPasswordError,
    isFormValid,
    handleEmailChange,
    handlePasswordChange,
    handleConfirmPasswordChange,
    handleRegister,
    navigateToLogin,
  } = useRegisterForm();

  const { colors } = useAppTheme();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Image
            source={LOGO}
            style={styles.logo}
            accessibilityLabel={t("settings.appName")}
          />
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
              shadowColor: colors.black,
            },
          ]}
          onPress={handleRegister}
          disabled={!isFormValid || isLoading}
          accessibilityLabel={
            t("auth.register") + t("general.accessibility.buttonSuffix")
          }
          accessibilityRole="button"
        >
          {isLoading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={[styles.buttonText, { color: colors.buttonText }]}>
              {t("auth.register")}
            </Text>
          )}
        </AnimatedPressable>

        <TouchableOpacity
          onPress={navigateToLogin}
          style={styles.footer}
          accessibilityRole="link"
          accessibilityLabel={`${t("auth.haveAccount")} ${t("auth.login")}`}
          accessibilityHint={t("auth.accessibility.loginHint")}
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
  button: {
    width: "100%",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 15,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    marginTop: 30,
  },
  footerText: {
    textAlign: "center",
    fontSize: 14,
  },
});

export default RegisterScreen;

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
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
import { AuthStackParamList } from "../types/navigation";
import { Ionicons } from "@expo/vector-icons";
import AnimatedPressable from "../components/common/AnimatedPressable";
import { useAppStore } from "../store/appStore";

type ForgotPasswordScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  "ForgotPassword"
>;

const LOGO = require("../../assets/auth-icon.png");

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  navigation,
}) => {
  const [email, setEmail] = useState("");
  const { colors } = useAppTheme();
  const { t } = useTranslation();

  const isLoading = useAppStore((state) => state.isLoading);
  const setIsLoading = useAppStore((state) => state.setIsLoading);

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Toast.show({
        type: "error",
        text1: t("general.failure"),
        text2: t("auth.allFieldsRequired"),
      });
      return;
    }
    setIsLoading(true);
    try {
      await authService.forgotPassword(email);
      Toast.show({
        type: "success",
        text1: t("general.success"),
        text2: t("auth.instructionsSentSuccess"),
      });
      navigation.goBack();
    } catch (error: any) {
      const errorMessage =
        error.message === "networkError"
          ? t("general.networkError")
          : error.message || t("general.genericError");
      Toast.show({
        type: "error",
        text1: t("general.failure"),
        text2: errorMessage,
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
            {t("auth.forgotPasswordTitle")}
          </Text>
          <Text style={[styles.subtitle, { color: colors.grey }]}>
            {t("auth.forgotPasswordSubtitle")}
          </Text>
        </View>

        <View
          style={[
            styles.inputContainer,
            { borderColor: colors.border, backgroundColor: colors.card },
          ]}
        >
          <Ionicons
            name="mail-outline"
            size={22}
            color={colors.grey}
            style={styles.inputIcon}
          />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder={t("auth.email")}
            placeholderTextColor={colors.grey}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            accessibilityLabel={t("auth.email")}
          />
        </View>

        <AnimatedPressable
          style={[
            styles.button,
            { backgroundColor: isLoading ? colors.grey : colors.primary },
          ]}
          onPress={handleForgotPassword}
          disabled={isLoading}
          accessibilityLabel={t("auth.sendInstructions")}
          accessibilityRole="button"
        >
          {isLoading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.buttonText}>{t("auth.sendInstructions")}</Text>
          )}
        </AnimatedPressable>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.footer}
          accessibilityLabel={t("auth.backToLogin")}
          accessibilityRole="link"
        >
          <Text style={[styles.footerText, { color: colors.primary }]}>
            {t("auth.backToLogin")}
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 20,
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
  button: {
    width: "100%",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
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
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ForgotPasswordScreen;

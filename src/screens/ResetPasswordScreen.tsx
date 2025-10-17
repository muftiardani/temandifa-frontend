import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../hooks/useAppTheme";
import { authService } from "../services/authService";
import { AuthStackParamList } from "../types/navigation";
import ValidatedInput from "../components/common/ValidatedInput";
import AnimatedPressable from "../components/common/AnimatedPressable";
import { useAppStore } from "../store/appStore";

type Props = NativeStackScreenProps<AuthStackParamList, "ResetPassword">;

const ResetPasswordScreen: React.FC<Props> = ({ route, navigation }) => {
  const { token } = route.params;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const isLoading = useAppStore((state) => state.isLoading);
  const setIsLoading = useAppStore((state) => state.setIsLoading);

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      Toast.show({
        type: "error",
        text1: t("general.failure"),
        text2: t("auth.allFieldsRequired"),
      });
      return;
    }
    if (password !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: t("general.failure"),
        text2: t("auth.passwordsDoNotMatch"),
      });
      return;
    }
    setIsLoading(true);
    try {
      await authService.resetPassword(token, password);
      Alert.alert(t("general.success"), t("resetPassword.successMessage"), [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            style={styles.backButton}
            accessibilityLabel={t("resetPassword.backToLoginHint")}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>

          <Text style={[styles.title, { color: colors.text }]}>
            {t("resetPassword.title")}
          </Text>
          <Text style={[styles.subtitle, { color: colors.grey }]}>
            {t("resetPassword.subtitle")}
          </Text>

          <ValidatedInput
            icon="lock-closed-outline"
            placeholder={t("auth.password")}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <ValidatedInput
            icon="lock-closed-outline"
            placeholder={t("auth.confirmPassword")}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          <AnimatedPressable
            style={[
              styles.button,
              { backgroundColor: isLoading ? colors.grey : colors.primary },
            ]}
            onPress={handleResetPassword}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.buttonText}>
                {t("resetPassword.saveButton")}
              </Text>
            )}
          </AnimatedPressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 1,
    padding: 10,
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
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  button: {
    width: "100%",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 15,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

export default ResetPasswordScreen;

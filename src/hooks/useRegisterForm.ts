import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";
import { authService } from "../services/authService";
import { useAuthStore } from "../store/authStore";
import { useAppStore } from "../store/appStore";
import { AuthStackParamList } from "../types/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RegisterNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Register"
>;

const validateEmail = (email: string) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const useRegisterForm = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<RegisterNavigationProp>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isLoading = useAppStore((state) => state.isLoading);
  const setIsLoading = useAppStore((state) => state.setIsLoading);
  const { setTokens } = useAuthStore();

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

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
    const isEmailValid = validateEmail(email) && emailError === "";
    const isPasswordValid =
      validatePassword(password) === "" && passwordError === "";
    const doPasswordsMatch = password === confirmPassword && password !== "";

    setIsFormValid(isEmailValid && isPasswordValid && doPasswordsMatch);
  }, [email, password, confirmPassword, emailError, passwordError, t]);

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
      const errorMessage =
        error.message === "networkError"
          ? t("general.networkError")
          : error.message || t("general.genericError");
      Toast.show({
        type: "error",
        text1: t("auth.registrationFailed"),
        text2: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToLogin = () => navigation.goBack();

  return {
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
  };
};

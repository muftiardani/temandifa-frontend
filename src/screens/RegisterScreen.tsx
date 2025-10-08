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
import { useAppTheme } from "../hooks/useAppTheme";
import { authService } from "../services/authService";
import { useAuthStore } from "../store/authStore";
import { AuthStackParamList } from "../types/navigation";
import ValidatedInput from "../components/common/ValidatedInput";

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

const validatePassword = (password: string) => {
  if (password.length < 8) return "Password minimal 8 karakter.";
  if (!/\d/.test(password)) return "Password harus mengandung angka.";
  if (!/[a-z]/.test(password)) return "Password harus mengandung huruf kecil.";
  if (!/[A-Z]/.test(password)) return "Password harus mengandung huruf besar.";
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
    return "Password harus mengandung simbol.";
  return "";
};

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  const { colors } = useAppTheme();
  const { setTokens } = useAuthStore();

  useEffect(() => {
    const isUsernameValid = username.length >= 3;
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password) === "";

    setIsFormValid(isUsernameValid && isEmailValid && isPasswordValid);
  }, [username, email, password]);

  const handleUsernameChange = (text: string) => {
    setUsername(text);
    if (text.length > 0 && text.length < 3) {
      setUsernameError("Username minimal 3 karakter.");
    } else {
      setUsernameError("");
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (text.length > 0 && !validateEmail(text)) {
      setEmailError("Format email tidak valid.");
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
  };

  const handleRegister = async () => {
    if (!isFormValid) {
      Toast.show({
        type: "error",
        text1: "Gagal",
        text2: "Harap periksa kembali semua kolom.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { accessToken, refreshToken } = await authService.register({
        username,
        email,
        password,
        phoneNumber,
      });
      await setTokens(accessToken, refreshToken);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Registrasi Gagal",
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
            Buat Akun Baru
          </Text>
          <Text style={[styles.subtitle, { color: colors.grey }]}>
            Isi data diri untuk memulai
          </Text>
        </View>

        <ValidatedInput
          icon="person-outline"
          placeholder="Username"
          value={username}
          onChangeText={handleUsernameChange}
          autoCapitalize="none"
          error={usernameError}
        />

        <ValidatedInput
          icon="mail-outline"
          placeholder="Email"
          value={email}
          onChangeText={handleEmailChange}
          keyboardType="email-address"
          autoCapitalize="none"
          error={emailError}
        />

        <ValidatedInput
          icon="call-outline"
          placeholder="Nomor Telepon (Opsional)"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />

        <ValidatedInput
          icon="lock-closed-outline"
          placeholder="Password"
          value={password}
          onChangeText={handlePasswordChange}
          secureTextEntry
          error={passwordError}
        />

        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor:
                !isFormValid || isLoading ? colors.grey : colors.primary,
            },
          ]}
          onPress={handleRegister}
          disabled={!isFormValid || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Daftar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.footer}
        >
          <Text style={[styles.footerText, { color: colors.grey }]}>
            Sudah punya akun?{" "}
            <Text style={{ color: colors.primary, fontWeight: "bold" }}>
              Login
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

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAppTheme } from "../hooks/useAppTheme";
import { authService } from "../services/authService";
import { useAuthStore } from "../store/authStore";
import { AuthStackParamList } from "../types/navigation";
import { Ionicons } from "@expo/vector-icons";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, "Login">;

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { colors } = useAppTheme();
  const { setAuthToken, loginAsGuest } = useAuthStore();

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      if (authentication?.accessToken) {
        handleGoogleLogin(authentication.accessToken);
      }
    } else if (response?.type === "error") {
      Alert.alert(
        "Login Google Gagal",
        "Terjadi kesalahan saat mencoba login dengan Google."
      );
    }
  }, [response]);

  const handleGoogleLogin = async (accessToken: string) => {
    setIsLoading(true);
    try {
      const { token } = await authService.loginWithGoogle(accessToken);
      await setAuthToken(token);
    } catch (error: any) {
      Alert.alert(
        "Login Gagal",
        error.message || "Gagal mengautentikasi dengan server."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!login.trim() || !password.trim()) {
      Alert.alert("Gagal", "Semua kolom harus diisi.");
      return;
    }
    setIsLoading(true);
    try {
      const { token } = await authService.login(login, password);
      await setAuthToken(token);
    } catch (error: any) {
      Alert.alert("Login Gagal", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity style={styles.skipButton} onPress={loginAsGuest}>
        <Text style={[styles.skipText, { color: colors.primary }]}>Lewati</Text>
      </TouchableOpacity>

      <Text style={[styles.title, { color: colors.text }]}>Selamat Datang</Text>

      <TextInput
        style={[
          styles.input,
          { color: colors.text, borderColor: colors.border },
        ]}
        placeholder="Username, Email, atau No. Telepon"
        placeholderTextColor={colors.grey}
        value={login}
        onChangeText={setLogin}
        autoCapitalize="none"
      />
      <TextInput
        style={[
          styles.input,
          { color: colors.text, borderColor: colors.border },
        ]}
        placeholder="Password"
        placeholderTextColor={colors.grey}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: isLoading ? colors.grey : colors.primary },
        ]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
        <Text style={[styles.linkText, { color: colors.primary }]}>
          Lupa Password?
        </Text>
      </TouchableOpacity>

      <View style={styles.dividerContainer}>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <Text style={[styles.dividerText, { color: colors.grey }]}>ATAU</Text>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
      </View>

      <TouchableOpacity
        style={[styles.googleButton, { borderColor: colors.border }]}
        onPress={() => promptAsync()}
        disabled={!request || isLoading}
      >
        <Ionicons name="logo-google" size={24} color={colors.text} />
        <Text style={[styles.googleButtonText, { color: colors.text }]}>
          Lanjutkan dengan Google
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={[styles.linkText, { color: colors.grey, marginTop: 20 }]}>
          Belum punya akun?{" "}
          <Text style={{ color: colors.primary, fontWeight: "bold" }}>
            Daftar
          </Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  skipButton: {
    position: "absolute",
    top: 60,
    right: 20,
    padding: 10,
    zIndex: 1,
  },
  skipText: {
    fontSize: 16,
    fontWeight: "600",
  },
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    height: 55,
    justifyContent: "center",
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  linkText: { marginTop: 15, textAlign: "center", fontSize: 14 },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 30,
  },
  divider: { flex: 1, height: 1 },
  dividerText: { marginHorizontal: 10, fontSize: 12 },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
  },
  googleButtonText: { marginLeft: 10, fontSize: 16, fontWeight: "600" },
});

export default LoginScreen;

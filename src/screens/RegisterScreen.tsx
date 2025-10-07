import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";
import { useAppTheme } from "../hooks/useAppTheme";
import { authService } from "../services/authService";
import { useAuthStore } from "../store/authStore";
import { AuthStackParamList } from "../types/navigation";

type RegisterScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  "Register"
>;

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { colors } = useAppTheme();
  const { setAuthToken } = useAuthStore();

  const handleRegister = async () => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      Toast.show({
        type: "error",
        text1: "Gagal",
        text2: "Username, email, dan password harus diisi.",
      });
      return;
    }
    setIsLoading(true);
    try {
      const { token } = await authService.register({
        username,
        email,
        password,
        phoneNumber,
      });
      await setAuthToken(token);
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Buat Akun Baru</Text>

      <TextInput
        style={[
          styles.input,
          { color: colors.text, borderColor: colors.border },
        ]}
        placeholder="Username"
        placeholderTextColor={colors.grey}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={[
          styles.input,
          { color: colors.text, borderColor: colors.border },
        ]}
        placeholder="Email"
        placeholderTextColor={colors.grey}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={[
          styles.input,
          { color: colors.text, borderColor: colors.border },
        ]}
        placeholder="Nomor Telepon (Opsional)"
        placeholderTextColor={colors.grey}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
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
        onPress={handleRegister}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Daftar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={[styles.linkText, { color: colors.grey, marginTop: 20 }]}>
          Sudah punya akun?{" "}
          <Text style={{ color: colors.primary, fontWeight: "bold" }}>
            Login
          </Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  linkText: { marginTop: 15, textAlign: "center", fontSize: 14 },
});

export default RegisterScreen;

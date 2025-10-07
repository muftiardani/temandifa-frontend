import React, { useState } from "react";
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
import { AuthStackParamList } from "../types/navigation";

type ForgotPasswordScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  "ForgotPassword"
>;

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  navigation,
}) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { colors } = useAppTheme();

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert("Gagal", "Email harus diisi.");
      return;
    }
    setIsLoading(true);
    try {
      await authService.forgotPassword(email);
      Alert.alert(
        "Berhasil",
        "Instruksi untuk mereset password telah dikirim ke email Anda."
      );
      navigation.goBack();
    } catch (error: any) {
      Alert.alert("Gagal", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Lupa Password</Text>
      <Text style={[styles.subtitle, { color: colors.grey }]}>
        Masukkan email Anda untuk menerima instruksi reset password.
      </Text>

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

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: isLoading ? colors.grey : colors.primary },
        ]}
        onPress={handleForgotPassword}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Kirim Instruksi</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text
          style={[styles.linkText, { color: colors.primary, marginTop: 20 }]}
        >
          Kembali ke Login
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
    marginBottom: 10,
  },
  subtitle: { fontSize: 16, textAlign: "center", marginBottom: 40 },
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

export default ForgotPasswordScreen;

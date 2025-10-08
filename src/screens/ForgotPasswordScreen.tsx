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
import { useAppTheme } from "../hooks/useAppTheme";
import { authService } from "../services/authService";
import { AuthStackParamList } from "../types/navigation";
import { Ionicons } from "@expo/vector-icons";

type ForgotPasswordScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  "ForgotPassword"
>;

const LOGO = require("../../assets/icon.png");

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  navigation,
}) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { colors } = useAppTheme();

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Toast.show({
        type: "error",
        text1: "Gagal",
        text2: "Email harus diisi.",
      });
      return;
    }
    setIsLoading(true);
    try {
      await authService.forgotPassword(email);
      Toast.show({
        type: "success",
        text1: "Berhasil",
        text2: "Instruksi untuk mereset password telah dikirim ke email Anda.",
      });
      navigation.goBack();
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Gagal",
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
            Lupa Password?
          </Text>
          <Text style={[styles.subtitle, { color: colors.grey }]}>
            Jangan khawatir! Masukkan email Anda untuk menerima instruksi reset
            password.
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
            placeholder="Email"
            placeholderTextColor={colors.grey}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

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

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.footer}
        >
          <Text style={[styles.footerText, { color: colors.primary }]}>
            Kembali ke Login
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
    width: 60,
    height: 60,
    marginBottom: 20,
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

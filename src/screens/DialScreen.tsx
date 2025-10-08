import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useAppTheme } from "../hooks/useAppTheme";
import { callService } from "../services/callService";
import { useCallStore } from "../store/callStore";
import { AppNavigationProp } from "../types/navigation";

const DialScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const navigation = useNavigation<AppNavigationProp>();
  const { setOutgoingCall } = useCallStore();

  const handleInitiateCall = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert("Gagal", "Silakan masukkan nomor telepon tujuan.");
      return;
    }
    setIsLoading(true);
    try {
      const data = await callService.initiate(phoneNumber);
      if (data.callId) {
        setOutgoingCall(data);
        navigation.replace("OutgoingCall");
      } else {
        Alert.alert(
          "Gagal Memanggil",
          data.message || "Terjadi kesalahan yang tidak diketahui."
        );
      }
    } catch (error: any) {
      Alert.alert(
        "Error Jaringan",
        error.message || "Gagal terhubung ke server."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.headerText }]}>
          Panggilan Video
        </Text>
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          Mulai Panggilan Baru
        </Text>
        <Text style={[styles.subtitle, { color: colors.grey }]}>
          Masukkan nomor telepon tujuan untuk memulai panggilan video.
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              color: colors.text,
              borderColor: colors.border,
              backgroundColor: colors.card,
            },
          ]}
          placeholder="Nomor Telepon"
          placeholderTextColor={colors.grey}
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          editable={!isLoading}
        />

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isLoading ? colors.grey : colors.primary },
          ]}
          onPress={handleInitiateCall}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="call" size={20} color="#fff" />
              <Text style={styles.buttonText}>Panggil</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  backButton: { marginRight: 16, padding: 8 },
  headerTitle: { fontSize: 20, fontWeight: "600" },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 10 },
  subtitle: {
    fontSize: 16,
    color: "gray",
    marginBottom: 40,
    textAlign: "center",
    maxWidth: "80%",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    padding: 15,
    borderRadius: 10,
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    height: 55,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default DialScreen;

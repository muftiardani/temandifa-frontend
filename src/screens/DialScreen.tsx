import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useAppTheme } from "../hooks/useAppTheme";
import { callService } from "../services/callService";
import { useCallStore } from "../store/callStore";
import { AppNavigationProp } from "../types/navigation";
import { useContactStore, EmergencyContact } from "../store/contactStore";

const DialScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { colors } = useAppTheme();
  const navigation = useNavigation<AppNavigationProp>();
  const { setOutgoingCall } = useCallStore();
  const { contacts } = useContactStore();

  const handleInitiateCall = async (numberToCall: string) => {
    if (!numberToCall.trim()) {
      Toast.show({
        type: "error",
        text1: "Gagal",
        text2: "Nomor telepon tidak valid.",
      });
      return;
    }
    setIsLoading(true);
    try {
      const data = await callService.initiate(numberToCall);
      if (data.callId) {
        setOutgoingCall(data);
        navigation.replace("OutgoingCall");
      } else {
        Toast.show({
          type: "error",
          text1: "Gagal Memanggil",
          text2: data.message || "Terjadi kesalahan yang tidak diketahui.",
        });
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error Jaringan",
        text2: error.message || "Gagal terhubung ke server.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderContactItem = ({ item }: { item: EmergencyContact }) => (
    <TouchableOpacity
      style={[styles.contactItem, { borderBottomColor: colors.border }]}
      onPress={() => handleInitiateCall(item.phoneNumber)}
    >
      <Ionicons name="person-circle-outline" size={40} color={colors.primary} />
      <View style={styles.contactInfo}>
        <Text style={[styles.contactName, { color: colors.text }]}>
          {item.name}
        </Text>
        <Text style={[styles.contactPhone, { color: colors.grey }]}>
          {item.phoneNumber}
        </Text>
      </View>
      <Ionicons name="call-outline" size={28} color={colors.success} />
    </TouchableOpacity>
  );

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

      <FlatList
        data={contacts}
        renderItem={renderContactItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.manualDialContainer}>
            <Text style={[styles.title, { color: colors.text }]}>
              Kontak Cepat
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
              placeholder="Atau masukkan Nomor Telepon"
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
              onPress={() => handleInitiateCall(phoneNumber)}
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
        }
        ListEmptyComponent={
          contacts.length === 0 ? (
            <Text style={styles.emptyText}>
              Belum ada kontak darurat disimpan.
            </Text>
          ) : null
        }
      />
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
  manualDialContainer: {
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
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
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  contactInfo: { flex: 1, marginLeft: 15 },
  contactName: { fontSize: 18, fontWeight: "600" },
  contactPhone: { fontSize: 14, marginTop: 2 },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "grey",
  },
});

export default DialScreen;

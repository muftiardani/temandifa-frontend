import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../hooks/useAppTheme";
import { useCallStore } from "../store/callStore";
import { callService } from "../services/callService";
import { ScreenNavigationProp } from "../types/navigation";

const IncomingCallScreen = () => {
  const { colors } = useAppTheme();
  const navigation = useNavigation<ScreenNavigationProp>();
  const { callId, callerName, setCallCredentials, clearCall } = useCallStore();

  const handleAccept = async () => {
    if (!callId) return;
    try {
      const data = await callService.answer(callId);
      if (data.token) {
        setCallCredentials(data);
        navigation.replace("VideoCall");
      } else {
        alert("Gagal menjawab, panggilan mungkin sudah berakhir.");
        clearCall();
        navigation.goBack();
      }
    } catch (error) {
      alert("Gagal terhubung ke server.");
      clearCall();
      navigation.goBack();
    }
  };

  const handleDecline = () => {
    if (callId) {
      callService.end(callId);
    }
    clearCall();
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.callerName}>{callerName || "Panggilan Masuk"}</Text>
        <Text style={styles.callType}>Panggilan Video TemanDifa</Text>
      </View>
      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            onPress={handleDecline}
            style={[styles.button, { backgroundColor: colors.danger }]}
          >
            <Ionicons name="close" size={40} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.buttonLabel}>Tolak</Text>
        </View>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            onPress={handleAccept}
            style={[styles.button, { backgroundColor: colors.success }]}
          >
            <Ionicons name="call" size={32} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.buttonLabel}>Terima</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1a2533",
    paddingVertical: 100,
  },
  infoContainer: {
    alignItems: "center",
  },
  callerName: { fontSize: 32, color: "white", fontWeight: "bold" },
  callType: { fontSize: 18, color: "rgba(255, 255, 255, 0.7)", marginTop: 10 },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
  },
  buttonWrapper: {
    alignItems: "center",
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonLabel: {
    color: "white",
    fontSize: 16,
  },
});

export default IncomingCallScreen;

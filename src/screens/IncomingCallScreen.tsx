import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useAppTheme } from "../hooks/useAppTheme";
import { useCallStore } from "../store/callStore";
import { callService } from "../services/callService";
import { AppNavigationProp } from "../types/navigation";

const IncomingCallScreen = () => {
  const { colors } = useAppTheme();
  const navigation = useNavigation<AppNavigationProp>();
  const { callId, callerName, setCallCredentials, clearCall } = useCallStore();
  const { t } = useTranslation();

  const isReceivingCall = useCallStore((state) => state.isReceivingCall);

  useEffect(() => {
    if (!isReceivingCall) {
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    }
  }, [isReceivingCall, navigation]);

  const handleAccept = async () => {
    if (!callId) return;
    try {
      const data = await callService.answer(callId);
      if (data.token) {
        setCallCredentials(data);
        navigation.replace("VideoCall");
      } else {
        alert(t("call.answerFailed"));
        clearCall();
      }
    } catch (error: any) {
      const errorMessage =
        error.message === "networkError"
          ? t("general.networkError")
          : t("call.connectionFailed");
      alert(errorMessage);
      clearCall();
    }
  };

  const handleDecline = async () => {
    if (!callId) return;
    try {
      await callService.end(callId);
    } catch (error) {
      console.error("Gagal menolak panggilan:", error);
    } finally {
      clearCall();
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.incomingCallBackground },
      ]}
    >
      <View style={styles.infoContainer}>
        <Text style={[styles.callerName, { color: colors.white }]}>
          {callerName || t("call.incomingCall")}
        </Text>
        <Text style={[styles.callType, { color: "rgba(255, 255, 255, 0.7)" }]}>
          {t("call.temandifaVideoCall")}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            onPress={handleDecline}
            style={[styles.button, { backgroundColor: colors.danger }]}
            accessibilityLabel={t("call.decline")}
            accessibilityRole="button"
          >
            <Ionicons name="close" size={40} color={colors.white} />
          </TouchableOpacity>
          <Text style={[styles.buttonLabel, { color: colors.white }]}>
            {t("call.decline")}
          </Text>
        </View>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            onPress={handleAccept}
            style={[styles.button, { backgroundColor: colors.success }]}
            accessibilityLabel={t("call.accept")}
            accessibilityRole="button"
          >
            <Ionicons name="call" size={32} color={colors.white} />
          </TouchableOpacity>
          <Text style={[styles.buttonLabel, { color: colors.white }]}>
            {t("call.accept")}
          </Text>
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
    paddingVertical: 100,
  },
  infoContainer: {
    alignItems: "center",
  },
  callerName: { fontSize: 32, fontWeight: "bold" },
  callType: { fontSize: 18, marginTop: 10 },
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
    fontSize: 16,
  },
});

export default IncomingCallScreen;

import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";
import { useAppTheme } from "../hooks/useAppTheme";
import { useCallStore } from "../store/callStore";
import { callService } from "../services/callService";

const OutgoingCallScreen = () => {
  const { colors } = useAppTheme();
  const navigation = useNavigation();
  const { callId, clearCall } = useCallStore();
  const { t } = useTranslation();

  const isActive = useCallStore((state) => state.isActive);

  useEffect(() => {
    if (!isActive) {
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    }
  }, [isActive, navigation]);

  const handleCancelCall = async () => {
    if (!callId) return;
    try {
      await callService.end(callId);
    } catch (error: any) {
      const errorMessage =
        error.message === "networkError"
          ? t("general.networkError")
          : error.message || t("general.genericError");
      Toast.show({
        type: "error",
        text1: t("general.failure"),
        text2: errorMessage,
      });
      console.error("Gagal membatalkan panggilan:", error);
    } finally {
      clearCall();
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.outgoingCallBackground },
      ]}
    >
      <View style={styles.infoContainer}>
        <ActivityIndicator size="large" color={colors.white} />
        <Text style={[styles.statusText, { color: colors.white }]}>
          {t("call.calling")}
        </Text>
        <Text style={[styles.calleeText, { color: colors.lightGrey }]}>
          {t("call.waitingForAnswer")}
        </Text>
      </View>
      <TouchableOpacity
        onPress={handleCancelCall}
        style={[styles.button, { backgroundColor: colors.danger }]}
        accessibilityLabel={t("dialogs.cancel")}
        accessibilityRole="button"
      >
        <Ionicons name="close" size={32} color={colors.white} />
      </TouchableOpacity>
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
  statusText: {
    fontSize: 28,
    marginTop: 20,
    fontWeight: "bold",
  },
  calleeText: {
    fontSize: 18,
    marginTop: 10,
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default OutgoingCallScreen;

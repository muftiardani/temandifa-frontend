import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";
import { useAppTheme } from "../hooks/useAppTheme";
import { authService } from "../services/authService";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import ScreenHeader from "../components/common/ScreenHeader";

type Props = NativeStackScreenProps<RootStackParamList, "SessionManagement">;

interface Session {
  id: string;
  userAgent: string;
  ip: string;
  lastActiveAt: string;
  createdAt: string;
  isCurrent: boolean;
}

const SessionManagementScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSessions = async () => {
    try {
      setIsLoading(true);
      const data = await authService.getSessions();
      setSessions(data);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error && error.message === "networkError"
          ? t("general.networkError")
          : error instanceof Error && error.message
          ? error.message
          : t("general.genericError");
      Toast.show({
        type: "error",
        text1: t("general.failure"),
        text2: errorMessage,
      });
      console.error("Gagal mengambil sesi:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleRevokeSession = (sessionId: string, isCurrent: boolean) => {
    Alert.alert(
      t("sessionManagement.deleteSessionTitle"),
      isCurrent
        ? t("sessionManagement.deleteCurrentSessionMessage")
        : t("sessionManagement.deleteOtherSessionMessage"),
      [
        { text: t("dialogs.cancel"), style: "cancel" },
        {
          text: t("dialogs.delete"),
          style: "destructive",
          onPress: async () => {
            setIsLoading(true);
            try {
              await authService.revokeSession(sessionId);
              Toast.show({
                type: "success",
                text1: t("general.success"),
                text2: t("sessionManagement.deleteSuccess"),
              });
              fetchSessions();
            } catch (error: unknown) {
              const errorMessage =
                error instanceof Error && error.message === "networkError"
                  ? t("general.networkError")
                  : error instanceof Error && error.message
                  ? error.message
                  : t("general.genericError");
              Toast.show({
                type: "error",
                text1: t("general.failure"),
                text2: errorMessage,
              });
              console.error("Gagal menghapus sesi:", error);
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Session }) => (
    <View
      style={[
        styles.itemContainer,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <Ionicons
        name={item.isCurrent ? "phone-portrait-outline" : "desktop-outline"}
        size={32}
        color={colors.primary}
      />
      <View style={styles.itemDetails}>
        <Text
          style={[styles.itemUserAgent, { color: colors.text }]}
          numberOfLines={1}
        >
          {item.isCurrent ? t("sessionManagement.thisDevice") : item.userAgent}
        </Text>
        <Text style={[styles.itemInfo, { color: colors.grey }]}>
          {t("sessionManagement.ipLabel")}: {item.ip}
        </Text>
        <Text style={[styles.itemInfo, { color: colors.grey }]}>
          {t("sessionManagement.lastActive")}:{" "}
          {new Date(item.lastActiveAt).toLocaleString()}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => handleRevokeSession(item.id, item.isCurrent)}
        accessibilityLabel={
          `${t("dialogs.delete")} ${
            item.isCurrent
              ? t("sessionManagement.thisDevice")
              : t("sessionManagement.title")
          } (${item.ip})` + t("general.accessibility.buttonSuffix")
        }
        accessibilityRole="button"
        style={styles.deleteButton}
      >
        <Ionicons name="log-out-outline" size={24} color={colors.danger} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title={t("sessionManagement.title")} />
      <View style={styles.contentContainer}>
        {isLoading && sessions.length === 0 ? (
          <ActivityIndicator
            style={{ marginTop: 20 }}
            size="large"
            color={colors.primary}
            accessibilityLabel={t("navigation.loading")}
          />
        ) : (
          <FlatList
            data={sessions}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            initialNumToRender={10}
            windowSize={5}
            refreshing={isLoading}
            onRefresh={fetchSessions}
            ListEmptyComponent={
              !isLoading ? (
                <Text
                  style={{
                    textAlign: "center",
                    color: colors.grey,
                    marginTop: 20,
                  }}
                >
                  {t("sessionManagement.noSessions")}
                </Text>
              ) : null
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  itemDetails: {
    flex: 1,
    marginHorizontal: 16,
  },
  itemUserAgent: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  itemInfo: {
    fontSize: 12,
    marginTop: 2,
  },
  deleteButton: {
    padding: 8,
  },
});

export default SessionManagementScreen;

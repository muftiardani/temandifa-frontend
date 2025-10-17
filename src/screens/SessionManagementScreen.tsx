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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleRevokeSession = (sessionId: string, isCurrent: boolean) => {
    Alert.alert(
      "Hapus Sesi",
      isCurrent
        ? "Anda akan keluar dari perangkat ini. Apakah Anda yakin?"
        : "Apakah Anda yakin ingin menghapus sesi ini?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              await authService.revokeSession(sessionId);
              Toast.show({
                type: "success",
                text1: t("general.success"),
                text2: "Sesi berhasil dihapus.",
              });
              fetchSessions();
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
        <Text style={[styles.itemUserAgent, { color: colors.text }]}>
          {item.isCurrent
            ? "Perangkat Ini"
            : item.userAgent.substring(0, 30) + "..."}
        </Text>
        <Text style={[styles.itemInfo, { color: colors.grey }]}>
          IP: {item.ip}
        </Text>
        <Text style={[styles.itemInfo, { color: colors.grey }]}>
          Terakhir Aktif: {new Date(item.lastActiveAt).toLocaleString()}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => handleRevokeSession(item.id, item.isCurrent)}
      >
        <Ionicons name="log-out-outline" size={24} color={colors.danger} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.headerText }]}>
          Manajemen Sesi
        </Text>
      </View>

      {isLoading ? (
        <ActivityIndicator
          style={{ marginTop: 20 }}
          size="large"
          color={colors.primary}
        />
      ) : (
        <FlatList
          data={sessions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text
              style={{ textAlign: "center", color: colors.grey, marginTop: 20 }}
            >
              Tidak ada sesi aktif.
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 16,
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
    marginLeft: 16,
  },
  itemUserAgent: {
    fontSize: 16,
    fontWeight: "600",
  },
  itemInfo: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default SessionManagementScreen;

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { useAppStore } from "../store/appStore";
import { useAppTheme } from "../hooks/useAppTheme";

type LanguageScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Language"
>;

const LanguageScreen: React.FC<LanguageScreenProps> = ({ navigation }) => {
  const { language, setLanguage } = useAppStore();
  const { t, colors } = useAppTheme();

  const languages = [
    { code: "id", name: "Bahasa Indonesia" },
    { code: "en", name: "English" },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.container}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            accessibilityLabel={`${t.general.back}. Tombol`}
            accessibilityRole="button"
          >
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.headerText }]}>
            {t.settings.language}
          </Text>
        </View>

        <View style={styles.content}>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.itemContainer,
                { borderBottomColor: colors.border },
              ]}
              onPress={() => setLanguage(lang.code as "id" | "en")}
              accessibilityRole="button"
              accessibilityState={{ checked: language === lang.code }}
              accessibilityLabel={`Pilih bahasa ${lang.name}.`}
            >
              <Text style={[styles.itemLabel, { color: colors.text }]}>
                {lang.name}
              </Text>
              {language === lang.code && (
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={colors.primary}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
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
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  content: { flex: 1, padding: 20 },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  itemLabel: { fontSize: 17 },
});

export default LanguageScreen;

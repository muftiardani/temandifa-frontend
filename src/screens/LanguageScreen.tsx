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
import { useTranslation } from "react-i18next";
import { RootStackParamList } from "../types/navigation";
import { useAppTheme } from "../hooks/useAppTheme";
import { useAppStore } from "../store/appStore";
import ScreenHeader from "../components/common/ScreenHeader";

type LanguageScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Language"
>;

const LanguageScreen: React.FC<LanguageScreenProps> = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const { colors } = useAppTheme();
  const { setLanguage } = useAppStore();
  const currentLanguage = i18n.language;

  const languages = [
    { code: "id", name: "Bahasa Indonesia" },
    { code: "en", name: "English" },
  ];

  const changeLanguage = (langCode: "id" | "en") => {
    i18n.changeLanguage(langCode);
    setLanguage(langCode);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader title={t("settings.language")} />
      <View style={styles.contentContainer}>
        <View style={styles.content}>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.itemContainer,
                { borderBottomColor: colors.border },
              ]}
              onPress={() => changeLanguage(lang.code as "id" | "en")}
              accessibilityRole="button"
              accessibilityState={{ checked: currentLanguage === lang.code }}
              accessibilityLabel={t(
                "languageScreen.accessibility.selectLanguageLabel",
                { languageName: lang.name }
              )}
            >
              <Text style={[styles.itemLabel, { color: colors.text }]}>
                {lang.name}
              </Text>
              {currentLanguage === lang.code && (
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={colors.primary}
                  style={styles.checkmarkIcon}
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
  contentContainer: {
    flex: 1,
  },
  content: { flex: 1, padding: 20 },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  itemLabel: {
    fontSize: 17,
  },
  checkmarkIcon: {
    position: "absolute",
    right: 0,
  },
});

export default LanguageScreen;

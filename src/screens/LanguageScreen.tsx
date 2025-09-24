import React, { useState } from "react";
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
import { commonStyles } from "../constants/Styles";
import { Colors } from "../constants/Colors";
import { Strings } from "../constants/Strings";

type LanguageScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Language"
>;

const LanguageScreen: React.FC<LanguageScreenProps> = ({ navigation }) => {
  const [selectedLanguage, setSelectedLanguage] = useState("id");

  const languages = [
    { code: "id", name: "Bahasa Indonesia" },
    { code: "en", name: "English" },
  ];

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={styles.container}>
        <View style={commonStyles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={commonStyles.backButton}
            accessibilityLabel={`${Strings.general.back}. Tombol`}
          >
            <Ionicons name="chevron-back" size={24} color={Colors.black} />
          </TouchableOpacity>
          <Text style={commonStyles.headerTitle}>
            {Strings.settings.language}
          </Text>
        </View>

        <View style={styles.content}>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={styles.itemContainer}
              onPress={() => setSelectedLanguage(lang.code)}
              accessibilityLabel={`Pilih bahasa ${lang.name}. Tombol`}
            >
              <Text style={styles.itemLabel}>{lang.name}</Text>
              {selectedLanguage === lang.code && (
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={Colors.primary}
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
  content: { flex: 1, padding: 20 },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  itemLabel: { fontSize: 17 },
});

export default LanguageScreen;

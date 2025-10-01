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
import { useAppTheme } from "../hooks/useAppTheme";

type AboutScreenProps = NativeStackScreenProps<RootStackParamList, "About">;

const AboutScreen: React.FC<AboutScreenProps> = ({ navigation }) => {
  const { t, colors } = useAppTheme();

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
            {t.settings.about}
          </Text>
        </View>

        <View style={styles.content}>
          <Text style={[styles.appName, { color: colors.primary }]}>
            {t.settings.appName}
          </Text>
          <Text style={[styles.version, { color: colors.grey }]}>
            Versi 1.0.0
          </Text>
          <Text style={[styles.description, { color: colors.text }]}>
            TemanDifa adalah aplikasi yang dirancang untuk membantu teman-teman
            disabilitas dalam aktivitas sehari-hari melalui teknologi.
          </Text>
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
  content: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
  },
  version: {
    fontSize: 16,
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
});

export default AboutScreen;

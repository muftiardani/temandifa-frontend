import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { useAppTheme } from "../hooks/useAppTheme";

type HelpAndGuideScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "HelpAndGuide"
>;

const HelpAndGuideScreen: React.FC<HelpAndGuideScreenProps> = ({
  navigation,
}) => {
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
            {t.settings.helpAndGuide}
          </Text>
        </View>

        <ScrollView style={styles.content}>
          <Text style={[styles.title, { color: colors.primary }]}>
            Selamat Datang di TemanDifa!
          </Text>
          <Text style={[styles.paragraph, { color: colors.grey }]}>
            Aplikasi ini dirancang untuk membantu Anda dalam aktivitas
            sehari-hari. Berikut adalah panduan singkat untuk setiap fitur yang
            tersedia.
          </Text>

          <Text style={[styles.subtitle, { color: colors.text }]}>
            Fitur Kamera
          </Text>
          <Text style={[styles.paragraph, { color: colors.grey }]}>
            Arahkan kamera ke objek di sekitar Anda, dan aplikasi akan mencoba
            mengidentifikasi dan memberitahukannya kepada Anda melalui suara.
            Fitur ini sangat berguna untuk mengenali benda-benda di lingkungan
            baru.
          </Text>

          <Text style={[styles.subtitle, { color: colors.text }]}>
            Fitur Scan
          </Text>
          <Text style={[styles.paragraph, { color: colors.grey }]}>
            Gunakan fitur Scan untuk membaca teks dari dokumen, buku, atau papan
            pengumuman. Anda dapat menggunakan kamera langsung atau mengunggah
            gambar dari galeri Anda. Hasil pemindaian teks dapat didengarkan.
          </Text>

          {/* ... Sisa teks panduan ... */}
        </ScrollView>
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
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default HelpAndGuideScreen;

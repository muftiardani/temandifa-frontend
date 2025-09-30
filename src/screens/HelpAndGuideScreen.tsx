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
import { commonStyles } from "../constants/Styles";
import { Colors } from "../constants/Colors";
import { useLocalization } from "../hooks/useLocalization";

type HelpAndGuideScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "HelpAndGuide"
>;

const HelpAndGuideScreen: React.FC<HelpAndGuideScreenProps> = ({
  navigation,
}) => {
  const t = useLocalization();

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={styles.container}>
        <View style={commonStyles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={commonStyles.backButton}
            accessibilityLabel={`${t.general.back}. Tombol`}
            accessibilityRole="button"
          >
            <Ionicons name="chevron-back" size={24} color={Colors.black} />
          </TouchableOpacity>
          <Text style={commonStyles.headerTitle}>
            {t.settings.helpAndGuide}
          </Text>
        </View>

        <ScrollView style={styles.content}>
          <Text style={styles.title}>Selamat Datang di TemanDifa!</Text>
          <Text style={styles.paragraph}>
            Aplikasi ini dirancang untuk membantu Anda dalam aktivitas
            sehari-hari. Berikut adalah panduan singkat untuk setiap fitur yang
            tersedia.
          </Text>

          <Text style={styles.subtitle}>Fitur Kamera</Text>
          <Text style={styles.paragraph}>
            Arahkan kamera ke objek di sekitar Anda, dan aplikasi akan mencoba
            mengidentifikasi dan memberitahukannya kepada Anda melalui suara.
            Fitur ini sangat berguna untuk mengenali benda-benda di lingkungan
            baru.
          </Text>

          <Text style={styles.subtitle}>Fitur Scan</Text>
          <Text style={styles.paragraph}>
            Gunakan fitur Scan untuk membaca teks dari dokumen, buku, atau papan
            pengumuman. Anda dapat menggunakan kamera langsung atau mengunggah
            gambar dari galeri Anda. Hasil pemindaian teks dapat didengarkan.
          </Text>

          <Text style={styles.subtitle}>Fitur Voice</Text>
          <Text style={styles.paragraph}>
            Tekan tombol mikrofon dan mulailah berbicara. Aplikasi akan mengubah
            ucapan Anda menjadi teks, yang dapat berguna untuk membuat catatan
            cepat atau pesan.
          </Text>

          <Text style={styles.subtitle}>Panggilan Darurat</Text>
          <Text style={styles.paragraph}>
            Tombol Panggilan Darurat di layar utama akan menghubungkan Anda
            secara langsung melalui panggilan video ke kontak darurat yang telah
            Anda siapkan. Gunakan fitur ini saat Anda membutuhkan bantuan
            segera.
          </Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: Colors.primary,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 8,
    color: Colors.textDefault,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.grey,
  },
});

export default HelpAndGuideScreen;

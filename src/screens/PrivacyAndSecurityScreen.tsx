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

type PrivacyAndSecurityScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "PrivacyAndSecurity"
>;

const PrivacyAndSecurityScreen: React.FC<PrivacyAndSecurityScreenProps> = ({
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
            {t.settings.privacyAndSecurity}
          </Text>
        </View>

        <ScrollView style={styles.content}>
          <Text style={styles.title}>Kebijakan Privasi dan Keamanan</Text>
          <Text style={styles.paragraph}>
            Kami menghargai privasi dan keamanan data Anda. Dokumen ini
            menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi
            informasi Anda.
          </Text>

          <Text style={styles.subtitle}>Pengumpulan Data</Text>
          <Text style={styles.paragraph}>
            Aplikasi TemanDifa hanya mengumpulkan data yang diperlukan untuk
            menjalankan fiturnya. Gambar yang Anda pindai dan audio yang Anda
            rekam dikirim ke server kami untuk diproses dan tidak disimpan
            setelahnya. Kami tidak mengumpulkan data pribadi seperti nama atau
            kontak Anda tanpa izin eksplisit.
          </Text>

          <Text style={styles.subtitle}>Izin Aplikasi</Text>
          <Text style={styles.paragraph}>
            Aplikasi ini memerlukan izin untuk mengakses kamera dan mikrofon.
            Izin kamera digunakan untuk fitur deteksi objek dan pemindaian
            dokumen. Izin mikrofon digunakan untuk fitur transkripsi suara. Data
            dari izin ini hanya digunakan saat Anda aktif menggunakan fitur
            terkait.
          </Text>

          <Text style={styles.subtitle}>Keamanan</Text>
          <Text style={styles.paragraph}>
            Kami menggunakan enkripsi standar industri untuk melindungi data
            yang dikirim antara perangkat Anda dan server kami. Kami berkomitmen
            untuk menjaga keamanan data Anda dari akses yang tidak sah.
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

export default PrivacyAndSecurityScreen;

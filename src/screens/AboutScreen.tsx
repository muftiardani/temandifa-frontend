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
import { commonStyles } from "../constants/Styles";
import { Colors } from "../constants/Colors";
import { Strings } from "../constants/Strings";

type AboutScreenProps = NativeStackScreenProps<RootStackParamList, "About">;

const AboutScreen: React.FC<AboutScreenProps> = ({ navigation }) => {
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
          <Text style={commonStyles.headerTitle}>{Strings.settings.about}</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.appName}>{Strings.settings.appName}</Text>
          <Text style={styles.version}>Versi 1.0.0</Text>
          <Text style={styles.description}>
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
  content: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.primary,
  },
  version: {
    fontSize: 16,
    color: Colors.grey,
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: Colors.textDefault,
    textAlign: "center",
    lineHeight: 24,
  },
});

export default AboutScreen;

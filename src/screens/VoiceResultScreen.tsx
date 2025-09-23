import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { commonStyles } from "../constants/Styles";
import { Colors } from "../constants/Colors";
import { Strings } from "../constants/Strings";

type VoiceResultScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "VoiceResult"
>;

const VoiceResultScreen: React.FC<VoiceResultScreenProps> = ({
  route,
  navigation,
}) => {
  const { transcribedText } = route.params;

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
            {Strings.voiceResult.title}
          </Text>
        </View>
        <ScrollView style={styles.contentScrollView}>
          <Text style={styles.resultText}>
            {transcribedText || Strings.scanResult.noTextDetected}
          </Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentScrollView: { flex: 1, padding: 20 },
  resultText: { fontSize: 18, lineHeight: 26, color: Colors.textDefault },
});

export default VoiceResultScreen;

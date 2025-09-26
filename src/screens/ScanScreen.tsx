import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";

import { RootStackParamList } from "../types/navigation";
import { apiService } from "../services/api";
import { commonStyles } from "../constants/Styles";
import { Colors } from "../constants/Colors";
import { Strings } from "../constants/Strings";
import LoadingIndicator from "../components/common/LoadingIndicator";

type ScanScreenProps = NativeStackScreenProps<RootStackParamList, "Scan">;

const ScanScreen: React.FC<ScanScreenProps> = ({ navigation }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const placeholderTranslateY = useSharedValue(0);

  useEffect(() => {
    placeholderTranslateY.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedPlaceholderStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: placeholderTranslateY.value }],
  }));

  const handleKameraPress = () => navigation.navigate("DocumentScanner");

  const handleUnggahPress = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Toast.show({
        type: "info",
        text1: Strings.general.error,
        text2: Strings.permissions.gallery,
      });
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets[0].uri) {
      uploadImageForScan(result.assets[0].uri);
    }
  };

  const uploadImageForScan = async (uri: string) => {
    setIsProcessing(true);
    try {
      const data = await apiService.scanImage(uri);
      if (data) {
        navigation.navigate("ScanResult", { scannedText: data.scannedText });
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: Strings.general.failure,
        text2: error.message || Strings.general.genericError,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={commonStyles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={commonStyles.backButton}
          accessibilityLabel={`${Strings.general.back}. Tombol`}
          accessibilityRole="button"
        >
          <Ionicons name="chevron-back" size={24} color={Colors.black} />
        </TouchableOpacity>
        <Text style={commonStyles.headerTitle}>{Strings.scanScreen.title}</Text>
      </View>

      <View style={styles.content}>
        {isProcessing ? (
          <LoadingIndicator text={Strings.scanScreen.processing} />
        ) : (
          <Animated.View
            style={[styles.placeholderContainer, animatedPlaceholderStyle]}
          >
            <Ionicons name="document-text-outline" size={100} color="#E0E0E0" />
            <Text style={styles.placeholderText}>
              {Strings.scanScreen.placeholder}
            </Text>
          </Animated.View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cameraButton]}
            onPress={handleKameraPress}
            disabled={isProcessing}
            accessibilityLabel={`${Strings.scanScreen.camera}. Tombol`}
            accessibilityHint="Membuka kamera untuk memindai dokumen"
            accessibilityRole="button"
          >
            <Ionicons name="camera" size={32} color={Colors.white} />
            <Text style={styles.buttonText}>{Strings.scanScreen.camera}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.uploadButton]}
            onPress={handleUnggahPress}
            disabled={isProcessing}
            accessibilityLabel={`${Strings.scanScreen.upload}. Tombol`}
            accessibilityHint="Mengunggah gambar dari galeri untuk dipindai"
            accessibilityRole="button"
          >
            <Ionicons name="cloud-upload" size={32} color={Colors.white} />
            <Text style={styles.buttonText}>{Strings.scanScreen.upload}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  content: { flex: 1, alignItems: "center", padding: 20 },
  placeholderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#F7F7F7",
    borderRadius: 16,
  },
  placeholderText: {
    marginTop: 10,
    color: Colors.textPlaceholder,
    fontSize: 16,
  },
  buttonContainer: { width: "100%", paddingTop: 20 },
  button: {
    width: "100%",
    height: 100,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 20,
    marginBottom: 16,
  },
  cameraButton: { backgroundColor: Colors.accent },
  uploadButton: { backgroundColor: Colors.secondary },
  buttonText: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 8,
  },
});

export default ScanScreen;

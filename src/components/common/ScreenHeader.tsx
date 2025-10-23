import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useAppTheme } from "../../hooks/useAppTheme";
import { AppNavigationProp } from "../../types/navigation";

interface ScreenHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

const STATUSBAR_HEIGHT =
  StatusBar.currentHeight || (Platform.OS === "ios" ? 44 : 0);
const HEADER_HEIGHT = 56;

const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  showBackButton = true,
  onBackPress,
}) => {
  const navigation = useNavigation<AppNavigationProp>();
  const { colors } = useAppTheme();
  const { t } = useTranslation();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View
      style={[
        styles.headerContainer,
        {
          borderBottomColor: colors.border,
          backgroundColor: colors.background,
        },
      ]}
    >
      {showBackButton ? (
        <TouchableOpacity
          onPress={handleBackPress}
          style={styles.buttonContainer}
          accessibilityLabel={
            t("general.back") + t("general.accessibility.buttonSuffix")
          }
          accessibilityHint={t("general.accessibility.backHint")}
          accessibilityRole="button"
        >
          <Ionicons name="chevron-back" size={28} color={colors.text} />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
      <View style={styles.titleContainer}>
        <Text
          style={[styles.headerTitle, { color: colors.headerText }]}
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>
      {showBackButton ? (
        <View style={styles.placeholder} />
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingTop: STATUSBAR_HEIGHT,
    height: HEADER_HEIGHT + STATUSBAR_HEIGHT,
    borderBottomWidth: 1,
  },
  buttonContainer: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
    width: 44,
    height: HEADER_HEIGHT,
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: HEADER_HEIGHT,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  placeholder: {
    width: 44,
    height: HEADER_HEIGHT,
  },
});

export default ScreenHeader;

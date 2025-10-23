import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useAppTheme } from "../../hooks/useAppTheme";

interface Props {
  text?: string;
}

const LoadingIndicator: React.FC<Props> = ({ text }) => {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const loadingLabel = text || t("navigation.loading");

  return (
    <View style={styles.container}>
      <ActivityIndicator
        size="large"
        color={colors.primary}
        accessibilityLabel={loadingLabel}
      />
      {text && (
        <Text style={[styles.text, { color: colors.grey }]}>{text}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    marginTop: 12,
    fontSize: 16,
  },
});

export default LoadingIndicator;

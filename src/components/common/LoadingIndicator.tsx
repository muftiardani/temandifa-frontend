import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { useAppTheme } from "../../hooks/useAppTheme";

interface Props {
  text?: string;
}

const LoadingIndicator: React.FC<Props> = ({ text }) => {
  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
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

import React from "react";
import { View, ActivityIndicator, StyleSheet, Modal } from "react-native";
import { useAppStore } from "../../store/appStore";
import { useAppTheme } from "../../hooks/useAppTheme";

const GlobalLoadingIndicator = () => {
  const isLoading = useAppStore((state) => state.isLoading);
  const { colors } = useAppTheme();

  return (
    <Modal visible={isLoading} transparent>
      <View style={[styles.container, { backgroundColor: colors.overlay }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default GlobalLoadingIndicator;

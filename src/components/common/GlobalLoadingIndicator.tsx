import React from "react";
import { View, ActivityIndicator, StyleSheet, Modal } from "react-native";
import { useTranslation } from "react-i18next";
import { useAppStore } from "../../store/appStore";
import { useAppTheme } from "../../hooks/useAppTheme";

const GlobalLoadingIndicator = () => {
  const isLoading = useAppStore((state) => state.isLoading);
  const { colors } = useAppTheme();
  const { t } = useTranslation();

  return (
    <Modal visible={isLoading} transparent>
      <View style={[styles.container, { backgroundColor: colors.overlay }]}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
          accessibilityLabel={t("navigation.loading")}
        />
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

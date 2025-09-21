import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, ViewStyle, StyleSheet } from "react-native";

type HomeButtonProps = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  backgroundColor: string;
  style?: ViewStyle;
  onPress?: () => void;
  layout?: "horizontal" | "vertical";
};

export default function HomeButton({
  title,
  icon,
  backgroundColor,
  style,
  onPress,
  layout = "vertical",
}: HomeButtonProps) {
  const isHorizontal = layout === "horizontal";

  const containerStyle = isHorizontal
    ? styles.horizontalContainer
    : styles.verticalContainer;

  return (
    <TouchableOpacity
      style={[styles.baseContainer, { backgroundColor }, containerStyle, style]}
      onPress={onPress}
    >
      <Ionicons
        name={icon}
        size={isHorizontal ? 48 : 36}
        color="#fff"
        style={isHorizontal ? styles.horizontalIcon : styles.verticalIcon}
      />
      <Text style={[styles.text, isHorizontal && styles.horizontalText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  baseContainer: {
    borderRadius: 20,
    padding: 20,
  },
  verticalContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  horizontalContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 30,
  },
  verticalIcon: {
    marginBottom: 8,
  },
  horizontalIcon: {
    marginRight: 20,
  },
  text: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  horizontalText: {
    fontSize: 24,
  },
});

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../../hooks/useAppTheme";

type IconName = "camera" | "scan" | "mic";
type Layout = "vertical" | "horizontal";

interface HomeButtonProps {
  title: string;
  icon: IconName;
  backgroundColor: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  layout?: Layout;
}

const HomeButton: React.FC<HomeButtonProps> = ({
  title,
  icon,
  backgroundColor,
  onPress,
  style,
  layout = "vertical",
}) => {
  const { colors } = useAppTheme();

  const containerStyle = [
    styles.container,
    { backgroundColor },
    layout === "horizontal" ? styles.layoutHorizontal : styles.layoutVertical,
    style,
  ];

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      accessibilityLabel={title}
      accessibilityRole="button"
    >
      <Ionicons name={icon} size={42} color={colors.white} />
      <Text style={[styles.title, { color: colors.white }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  layoutVertical: {
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  layoutHorizontal: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 8,
  },
});

export default HomeButton;

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, ViewStyle, StyleSheet } from "react-native";
import { Colors } from "../../constants/Colors";

type HomeButtonProps = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  backgroundColor: string;
  style?: ViewStyle;
  onPress?: () => void;
  layout?: "horizontal" | "vertical";
};

const HomeButton = React.memo(
  ({
    title,
    icon,
    backgroundColor,
    style,
    onPress,
    layout = "vertical",
  }: HomeButtonProps) => {
    const isHorizontal = layout === "horizontal";
    const containerStyle = isHorizontal
      ? styles.horizontalContainer
      : styles.verticalContainer;

    return (
      <TouchableOpacity
        style={[
          styles.baseContainer,
          { backgroundColor },
          containerStyle,
          style,
        ]}
        onPress={onPress}
        accessibilityLabel={`${title}. Tombol`}
        accessibilityHint={`Ketuk dua kali untuk membuka fitur ${title}`}
        activeOpacity={0.7}
      >
        <Ionicons
          name={icon}
          size={isHorizontal ? 48 : 36}
          color={Colors.white}
          style={isHorizontal ? styles.horizontalIcon : styles.verticalIcon}
        />
        <Text style={[styles.text, isHorizontal && styles.horizontalText]}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  }
);

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
    color: Colors.white,
    fontSize: 18,
    fontWeight: "600",
  },
  horizontalText: {
    fontSize: 24,
  },
});

export default HomeButton;

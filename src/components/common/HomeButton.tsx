import React from "react";
import { Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Colors } from "../../constants/Colors";

type HomeButtonProps = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  backgroundColor: string;
  style?: object;
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
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: scale.value }],
      };
    });

    const handlePressIn = () => {
      scale.value = withSpring(0.95);
    };

    const handlePressOut = () => {
      scale.value = withSpring(1);
    };

    return (
      <Animated.View style={[animatedStyle, style]}>
        <Pressable
          style={[styles.baseContainer, { backgroundColor }, containerStyle]}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          accessibilityLabel={`${title}. Tombol`}
          accessibilityHint={`Ketuk dua kali untuk membuka fitur ${title}`}
          accessibilityRole="button"
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
        </Pressable>
      </Animated.View>
    );
  }
);

const styles = StyleSheet.create({
  baseContainer: {
    borderRadius: 20,
    padding: 20,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  verticalContainer: {},
  horizontalContainer: {
    flexDirection: "row",
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

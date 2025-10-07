import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useAppTheme } from "../../hooks/useAppTheme";

type HomeButtonProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress: () => void;
  backgroundColor: string;
  layout?: "horizontal" | "vertical";
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const HomeButton = ({
  icon,
  title,
  onPress,
  backgroundColor,
  layout = "vertical",
  style,
  testID,
}: HomeButtonProps) => {
  const { colors } = useAppTheme();

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

  const isHorizontal = layout === "horizontal";

  return (
    <Animated.View style={[styles.container, animatedStyle, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.button,
          {
            backgroundColor,
            flexDirection: isHorizontal ? "row" : "column",
            justifyContent: isHorizontal ? "flex-start" : "center",
            paddingLeft: isHorizontal ? 30 : 0,
          },
        ]}
        testID={testID}
      >
        <Ionicons
          name={icon}
          size={isHorizontal ? 40 : 50}
          color={colors.white}
          testID={testID ? `${testID}-icon` : undefined}
        />
        <Text
          style={[
            styles.text,
            {
              color: colors.white,
              marginLeft: isHorizontal ? 20 : 0,
              fontSize: isHorizontal ? 24 : 18,
            },
          ]}
        >
          {title}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: "hidden",
  },
  button: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    marginTop: 10,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default React.memo(HomeButton);

import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { AnimationDurations } from "../constants/animations";
import { useAppTheme } from "../hooks/useAppTheme";

const SPLASH_ICON = require("../../assets/splash-icon.png");

interface Props {
  onAnimationComplete: () => void;
  onReady: () => void;
}

const AnimatedSplashScreen: React.FC<Props> = ({
  onAnimationComplete,
  onReady,
}) => {
  const { colors } = useAppTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    scale.value = withTiming(1.5, {
      duration: AnimationDurations.splashScreenScale,
      easing: Easing.inOut(Easing.ease),
    });

    opacity.value = withTiming(
      0,
      {
        duration: AnimationDurations.splashScreenFade,
        easing: Easing.inOut(Easing.ease),
      },
      (isFinished) => {
        if (isFinished) {
          runOnJS(onAnimationComplete)();
        }
      }
    );
  }, [onAnimationComplete]);

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background }]}
      onLayout={onReady}
    >
      <Animated.Image
        source={SPLASH_ICON}
        style={[styles.image, animatedStyle]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
  },
});

export default AnimatedSplashScreen;

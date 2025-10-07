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

const SPLASH_ICON = require("../../assets/splash-icon.png");

interface Props {
  onAnimationComplete: () => void;
  onReady: () => void;
}

const AnimatedSplashScreen: React.FC<Props> = ({
  onAnimationComplete,
  onReady,
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    const onComplete = () => {
      onAnimationComplete();
    };

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
          runOnJS(onComplete)();
        }
      }
    );
  }, [onAnimationComplete, scale, opacity]);

  return (
    <View style={styles.container} onLayout={onReady}>
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
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
  },
});

export default AnimatedSplashScreen;

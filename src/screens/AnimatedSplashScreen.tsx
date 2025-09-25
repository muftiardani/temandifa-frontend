import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";

const SPLASH_ICON = require("../../assets/splash-icon.png");

interface Props {
  onAnimationComplete: () => void;
}

const AnimatedSplashScreen: React.FC<Props> = ({ onAnimationComplete }) => {
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
      duration: 1200,
      easing: Easing.inOut(Easing.ease),
    });
    opacity.value = withTiming(
      0,
      { duration: 1000, easing: Easing.inOut(Easing.ease) },
      (isFinished) => {
        if (isFinished) {
          runOnJS(onComplete)();
        }
      }
    );
  }, [onAnimationComplete, scale, opacity]);

  return (
    <View style={styles.container}>
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

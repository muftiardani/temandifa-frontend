import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { RootNavigatorParamList } from "../types/navigation";
import { useAppTheme } from "../hooks/useAppTheme";

type OnboardingScreenProps = NativeStackScreenProps<
  RootNavigatorParamList,
  "Onboarding"
>;

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const { t, colors } = useAppTheme();
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useSharedValue(0);

  const onboardingData = t.onboarding.slides;

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem("@hasCompletedOnboarding", "true");
      navigation.replace("Auth", { screen: "Login" });
    } catch (e) {
      console.error("Gagal menyimpan status onboarding", e);
      navigation.replace("Auth", { screen: "Login" });
    }
  };

  const handleNext = (currentIndex: number) => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      completeOnboarding();
    }
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: (typeof onboardingData)[0];
    index: number;
  }) => {
    const isLastItem = index === onboardingData.length - 1;

    return (
      <View style={[styles.slideContainer, { width }]}>
        <Ionicons name={item.icon} size={120} color={colors.primary} />
        <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
        <Text style={[styles.description, { color: colors.grey }]}>
          {item.description}
        </Text>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() =>
            isLastItem ? completeOnboarding() : handleNext(index)
          }
        >
          <Text style={styles.buttonText}>
            {isLastItem ? t.onboarding.getStarted : t.onboarding.next}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <TouchableOpacity style={styles.skipButton} onPress={completeOnboarding}>
        <Text style={[styles.skipText, { color: colors.grey }]}>
          {t.onboarding.skip}
        </Text>
      </TouchableOpacity>

      <Animated.FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.key}
      />

      <View style={styles.paginationContainer}>
        {onboardingData.map((_, index) => {
          const animatedStyle = useAnimatedStyle(() => {
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ];
            const scale = interpolate(
              scrollX.value,
              inputRange,
              [0.8, 1.4, 0.8],
              Extrapolate.CLAMP
            );
            const opacity = interpolate(
              scrollX.value,
              inputRange,
              [0.6, 1, 0.6],
              Extrapolate.CLAMP
            );
            return { transform: [{ scale }], opacity };
          });
          return (
            <Animated.View
              key={index}
              style={[
                styles.paginationDot,
                { backgroundColor: colors.primary },
                animatedStyle,
              ]}
            />
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slideContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 60,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 150,
    width: "100%",
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 8,
  },
  skipButton: {
    position: "absolute",
    top: 60,
    right: 20,
    zIndex: 1,
    padding: 10,
  },
  skipText: {
    fontSize: 16,
    fontWeight: "500",
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 50,
    position: "absolute",
    bottom: 50,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default OnboardingScreen;

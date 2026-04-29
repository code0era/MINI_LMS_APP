import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from "react-native-reanimated";

export function SkeletonCard() {
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000 }),
        withTiming(0.5, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View className="bg-surface-card rounded-2xl mb-4 overflow-hidden border border-surface-border p-4">
      <Animated.View className="h-40 w-full bg-surface-border rounded-xl mb-4" style={animatedStyle} />
      
      <Animated.View className="w-1/3 h-4 bg-surface-border rounded-md mb-3" style={animatedStyle} />
      
      <Animated.View className="w-full h-6 bg-surface-border rounded-md mb-2" style={animatedStyle} />
      <Animated.View className="w-2/3 h-6 bg-surface-border rounded-md mb-4" style={animatedStyle} />
      
      <View className="flex-row items-center justify-between mt-2">
        <View className="flex-row items-center flex-1">
          <Animated.View className="w-6 h-6 bg-surface-border rounded-md mr-2" style={animatedStyle} />
          <Animated.View className="w-24 h-4 bg-surface-border rounded-md" style={animatedStyle} />
        </View>
        <Animated.View className="w-16 h-6 bg-surface-border rounded-md" style={animatedStyle} />
      </View>
    </View>
  );
}

// Documentation: Uses react-native-reanimated for smooth, continuous shimmer effects during data fetching.

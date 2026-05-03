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
    <View className="bg-white rounded-[32px] mb-6 overflow-hidden border border-slate-100 p-6">
      <Animated.View className="h-48 w-full bg-slate-50 rounded-2xl mb-6" style={animatedStyle} />
      
      <View className="flex-row items-center mb-4">
        <Animated.View className="w-20 h-4 bg-slate-50 rounded-md mr-4" style={animatedStyle} />
        <Animated.View className="w-12 h-4 bg-slate-50 rounded-md" style={animatedStyle} />
      </View>
      
      <Animated.View className="w-full h-8 bg-slate-50 rounded-md mb-4" style={animatedStyle} />
      
      <View className="flex-row items-center justify-between mb-6">
        <View className="flex-row items-center space-x-3">
          <Animated.View className="w-24 h-4 bg-slate-50 rounded-md" style={animatedStyle} />
        </View>
        <Animated.View className="w-16 h-4 bg-slate-50 rounded-md" style={animatedStyle} />
      </View>

      <Animated.View className="w-full h-12 bg-slate-50 rounded-2xl mt-2" style={animatedStyle} />
    </View>
  );
}

// Documentation: Uses react-native-reanimated for smooth, continuous shimmer effects during data fetching.

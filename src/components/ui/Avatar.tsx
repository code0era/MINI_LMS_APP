import React from "react";
import { View, Text } from "react-native";
import { Image } from "expo-image";

interface AvatarProps {
  url?: string | null;
  fallback?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Avatar({ url, fallback = "?", size = "md", className }: AvatarProps) {
  const sizeMap = {
    sm: "w-8 h-8 rounded-md",
    md: "w-12 h-12 rounded-lg",
    lg: "w-16 h-16 rounded-xl",
    xl: "w-24 h-24 rounded-2xl",
  };

  const textMap = {
    sm: "text-xs",
    md: "text-base",
    lg: "text-xl",
    xl: "text-3xl",
  };

  const containerStyle = `bg-surface-card border-2 border-surface-border items-center justify-center overflow-hidden ${sizeMap[size]} ${className || ""}`.trim();

  if (url) {
    return (
      <View className={containerStyle}>
        <Image
          source={{ uri: url }}
          className="w-full h-full"
          contentFit="cover"
          transition={200}
        />
      </View>
    );
  }

  return (
    <View className={containerStyle}>
      <Text className={twMerge("text-text-primary font-semi", textMap[size])}>
        {fallback.charAt(0).toUpperCase()}
      </Text>
    </View>
  );
}

// Documentation: Reusable Avatar component utilizing expo-image for aggressive caching and fast rendering.

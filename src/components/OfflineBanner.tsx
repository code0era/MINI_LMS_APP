import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNetworkStatus } from "../hooks/useNetworkStatus";

export function OfflineBanner() {
  const isOnline = useNetworkStatus();

  if (isOnline) return null;

  return (
    <SafeAreaView edges={["top"]} className="bg-error">
      <View className="py-2 items-center justify-center flex-row">
        <Text className="text-white text-xs font-semi mr-2">⚠️</Text>
        <Text className="text-white text-xs font-semi">
          You are offline. Showing cached content.
        </Text>
      </View>
    </SafeAreaView>
  );
}

// Documentation: Auto-mounting banner that alerts users when they drop connection and switch to cached data.

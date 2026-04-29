import React from "react";
import { View, Text, SafeAreaView } from "react-native";
import { useNetworkStatus } from "../hooks/useNetworkStatus";

export function OfflineBanner() {
  const isOnline = useNetworkStatus();

  if (isOnline) return null;

  return (
    <SafeAreaView className="bg-error">
      <View className="py-2 items-center justify-center flex-row">
        <Text className="text-white text-xs font-semi mr-2">⚠️</Text>
        <Text className="text-white text-xs font-semi">
          You are offline. Showing cached content.
        </Text>
      </View>
    </SafeAreaView>
  );
}

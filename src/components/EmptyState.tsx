import React from "react";
import { View, Text } from "react-native";
import { Button } from "./ui/Button";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  icon = "📚",
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center p-6">
      <Text className="text-6xl mb-4">{icon}</Text>
      <Text className="text-2xl font-bold text-text-primary mb-2 text-center">
        {title}
      </Text>
      <Text className="text-base text-text-secondary text-center mb-8">
        {description}
      </Text>
      
      {actionLabel && onAction && (
        <Button
          label={actionLabel}
          onPress={onAction}
          variant="outline"
          className="min-w-[200px]"
        />
      )}
    </View>
  );
}

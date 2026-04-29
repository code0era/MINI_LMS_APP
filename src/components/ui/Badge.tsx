import React from "react";
import { View, Text } from "react-native";
import { twMerge } from "tailwind-merge";

interface BadgeProps {
  label: string;
  variant?: "primary" | "secondary" | "success" | "warning" | "error";
  className?: string;
}

export function Badge({ label, variant = "primary", className }: BadgeProps) {
  const variantStyles = {
    primary: "bg-primary-100 border-primary-200",
    secondary: "bg-surface-card border-surface-border",
    success: "bg-success/10 border-success/20",
    warning: "bg-warning/10 border-warning/20",
    error: "bg-error/10 border-error/20",
  };

  const textStyles = {
    primary: "text-primary-700",
    secondary: "text-text-secondary",
    success: "text-success",
    warning: "text-warning",
    error: "text-error",
  };

  return (
    <View
      className={twMerge(
        "px-2.5 py-1 rounded-full border items-center justify-center",
        variantStyles[variant],
        className
      )}
    >
      <Text
        className={twMerge(
          "text-xs font-medium uppercase tracking-wider",
          textStyles[variant]
        )}
      >
        {label}
      </Text>
    </View>
  );
}

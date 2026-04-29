import React from "react";
import { View, Text } from "react-native";

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

  const containerStyle = `self-start px-2 py-0.5 rounded-full border items-center justify-center ${variantStyles[variant]} ${className || ""}`.trim();
  const textStyle = `text-xs font-medium uppercase tracking-wider ${textStyles[variant]}`;

  return (
    <View
      className={containerStyle}
    >
      <Text
        className={textStyle}
      >
        {label}
      </Text>
    </View>
  );
}

// Documentation: Reusable Badge component supporting multiple semantic color variants (primary, success, warning).

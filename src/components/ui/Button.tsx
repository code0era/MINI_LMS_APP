import React, { forwardRef } from "react";
import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps, View } from "react-native";
import * as Haptics from "expo-haptics";

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  hapticFeedback?: boolean;
}

export const Button = forwardRef<View, ButtonProps>(
  (
    {
      label,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      hapticFeedback = true,
      className,
      onPress,
      ...props
    },
    ref
  ) => {
    const handlePress = (e: any) => {
      if (hapticFeedback) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      onPress?.(e);
    };

    const baseStyles = "flex-row items-center justify-center rounded-xl";
    
    const variantStyles = {
      primary: "bg-primary-600 active:bg-primary-700",
      secondary: "bg-surface-card active:bg-surface-border",
      outline: "border-2 border-primary-600 active:bg-primary-50",
      danger: "bg-error active:opacity-80",
      ghost: "active:bg-surface-card",
    };

    const textStyles = {
      primary: "text-white font-semi",
      secondary: "text-text-primary font-medium",
      outline: "text-primary-600 font-semi",
      danger: "text-white font-semi",
      ghost: "text-primary-600 font-medium",
    };

    const sizeStyles = {
      sm: "px-3 py-2",
      md: "px-4 py-3",
      lg: "px-6 py-4",
    };

    const textSizeStyles = {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    };

    const containerStyle = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabled || isLoading ? "opacity-50" : ""} ${className || ""}`.trim();

    const labelStyle = `${textStyles[variant]} ${textSizeStyles[size]} ${leftIcon ? "ml-2" : ""} ${rightIcon ? "mr-2" : ""}`.trim();

    return (
      <TouchableOpacity
        ref={ref}
        className={containerStyle}
        disabled={disabled || isLoading}
        onPress={handlePress}
        activeOpacity={0.7}
        {...props}
      >
        {isLoading ? (
          <ActivityIndicator color={variant === "outline" || variant === "ghost" ? "#4f46e5" : "#ffffff"} />
        ) : (
          <>
            {leftIcon}
            <Text className={labelStyle}>{label}</Text>
            {rightIcon}
          </>
        )}
      </TouchableOpacity>
    );
  }
);

Button.displayName = "Button";

// Documentation: Core Button component with integrated haptic feedback, loading states, and NativeWind styling.

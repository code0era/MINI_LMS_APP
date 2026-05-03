import React, { forwardRef } from "react";
import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps, View, Platform } from "react-native";
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
      if (hapticFeedback && Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      }
      onPress?.(e);
    };

    const baseStyles = "flex-row items-center justify-center rounded-full shadow-sm elevation-3";
    
    const variantStyles = {
      primary: "bg-primary-500 active:bg-primary-600",
      secondary: "bg-white border border-slate-100 active:bg-slate-50",
      outline: "border-2 border-primary-500 active:bg-primary-50",
      danger: "bg-red-500 active:bg-red-600",
      ghost: "active:bg-slate-50",
    };

    const textStyles = {
      primary: "text-white font-black uppercase tracking-widest",
      secondary: "text-slate-700 font-bold",
      outline: "text-primary-500 font-black uppercase tracking-widest",
      danger: "text-white font-black uppercase tracking-widest",
      ghost: "text-primary-500 font-bold",
    };

    const sizeStyles = {
      sm: "px-4 py-2",
      md: "px-6 py-4",
      lg: "px-8 py-5",
    };

    const textSizeStyles = {
      sm: "text-[10px]",
      md: "text-xs",
      lg: "text-sm",
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
          <ActivityIndicator color={variant === "outline" || variant === "ghost" ? "#4db6ac" : "#ffffff"} />
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

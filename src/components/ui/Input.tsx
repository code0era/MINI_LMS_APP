import React, { forwardRef, useState } from "react";
import { View, TextInput, Text, TouchableOpacity, TextInputProps } from "react-native";
import { twMerge } from "tailwind-merge";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      leftIcon,
      rightIcon,
      isPassword = false,
      className,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleFocus = (e: any) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: any) => {
      setIsFocused(false);
      props.onBlur?.(e);
    };

    const containerStyle = twMerge(
      "flex-row items-center bg-surface-card rounded-xl border-2 px-3 h-14",
      isFocused ? "border-primary-500" : "border-surface-border",
      error && "border-error",
      className
    );

    return (
      <View className="mb-4 w-full">
        {label && (
          <Text className="text-sm font-medium text-text-secondary mb-1.5 ml-1">
            {label}
          </Text>
        )}
        
        <View className={containerStyle}>
          {leftIcon && <View className="mr-2">{leftIcon}</View>}
          
          <TextInput
            ref={ref}
            className="flex-1 text-base text-text-primary py-2"
            placeholderTextColor="#64748b"
            secureTextEntry={isPassword && !isPasswordVisible}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          
          {isPassword ? (
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              className="p-2"
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <Text className="text-text-secondary text-sm">
                {isPasswordVisible ? "Hide" : "Show"}
              </Text>
            </TouchableOpacity>
          ) : (
            rightIcon && <View className="ml-2">{rightIcon}</View>
          )}
        </View>

        {error && (
          <Text className="text-xs text-error mt-1.5 ml-1">{error}</Text>
        )}
      </View>
    );
  }
);

Input.displayName = "Input";

// Documentation: Form input component with built-in error state styling and secure text toggle for passwords.

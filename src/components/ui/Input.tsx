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
      "flex-row items-center bg-white rounded-[24px] border-2 px-5 h-16 shadow-sm",
      isFocused ? "border-primary-500" : "border-slate-100",
      error && "border-red-400",
      className
    );

    return (
      <View className="mb-5 w-full">
        {label && (
          <Text className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
            {label}
          </Text>
        )}
        
        <View className={containerStyle}>
          {leftIcon && <View className="mr-3">{leftIcon}</View>}
          
          <TextInput
            ref={ref}
            className="flex-1 text-base text-slate-800 py-2 font-medium"
            placeholderTextColor="#cbd5e1"
            secureTextEntry={isPassword && !isPasswordVisible}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          
          {isPassword ? (
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              className="bg-slate-50 px-3 py-1.5 rounded-xl"
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <Text className="text-primary-500 text-[10px] font-black uppercase tracking-tighter">
                {isPasswordVisible ? "Hide" : "Show"}
              </Text>
            </TouchableOpacity>
          ) : (
            rightIcon && <View className="ml-3">{rightIcon}</View>
          )}
        </View>

        {error && (
          <Text className="text-[10px] text-red-500 font-bold mt-2 ml-1">{error}</Text>
        )}
      </View>
    );
  }
);

Input.displayName = "Input";

// Documentation: Form input component with built-in error state styling and secure text toggle for passwords.

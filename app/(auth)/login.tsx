import React, { useEffect } from "react";
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useRouter } from "expo-router";
import { Input } from "../../src/components/ui/Input";
import { Button } from "../../src/components/ui/Button";
import { useAuthStore } from "../../src/store/authStore";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error, isAuthenticated, clearError } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/(tabs)/home");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    return () => clearError();
  }, []);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
    } catch (err) {
      // Error handled in store
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-DEFAULT">
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View className="flex-1 p-6 justify-center">
            <View className="mb-10 items-center">
              <View className="w-20 h-20 bg-primary-500 rounded-2xl items-center justify-center mb-6">
                <Text className="text-4xl">🌊</Text>
              </View>
              <Text className="text-3xl font-bold text-text-primary text-center mb-2">
                Welcome back
              </Text>
              <Text className="text-base text-text-secondary text-center">
                Sign in to continue your learning journey
              </Text>
            </View>

            {error && (
              <View className="bg-error/10 border border-error/20 p-4 rounded-xl mb-6">
                <Text className="text-error text-center">{error}</Text>
              </View>
            )}

            <View className="space-y-4">
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Email"
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.email?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Password"
                    placeholder="Enter your password"
                    isPassword
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.password?.message}
                  />
                )}
              />

              <View className="items-end mb-6">
                <Text className="text-primary-500 text-sm font-medium">
                  Forgot Password?
                </Text>
              </View>

              <Button
                label="Sign In"
                onPress={handleSubmit(onSubmit)}
                isLoading={isLoading}
                className="w-full mb-6"
              />

              <View className="flex-row justify-center items-center">
                <Text className="text-text-secondary text-base">
                  Don't have an account?{" "}
                </Text>
                <Link href="/(auth)/register" asChild>
                  <Text className="text-primary-500 text-base font-bold">
                    Sign Up
                  </Text>
                </Link>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

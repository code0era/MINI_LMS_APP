import React, { useEffect } from "react";
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useRouter } from "expo-router";
import { Input } from "../../src/components/ui/Input";
import { Button } from "../../src/components/ui/Button";
import { useAuthStore } from "../../src/store/authStore";

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading, error, isAuthenticated, clearError } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
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

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await register(data);
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
          <View className="flex-1 p-6 justify-center mt-8">
            <View className="mb-10 items-center">
              <Text className="text-3xl font-bold text-text-primary text-center mb-2">
                Create Account
              </Text>
              <Text className="text-base text-text-secondary text-center">
                Join CourseWave to start learning today
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
                name="username"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Username"
                    placeholder="Choose a username"
                    autoCapitalize="none"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.username?.message}
                  />
                )}
              />

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
                    placeholder="Create a password"
                    isPassword
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.password?.message}
                  />
                )}
              />

              <Button
                label="Sign Up"
                onPress={handleSubmit(onSubmit)}
                isLoading={isLoading}
                className="w-full mt-4 mb-6"
              />

              <View className="flex-row justify-center items-center">
                <Text className="text-text-secondary text-base">
                  Already have an account?{" "}
                </Text>
                <Link href="/(auth)/login" asChild>
                  <Text className="text-primary-500 text-base font-bold">
                    Sign In
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

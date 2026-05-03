import React, { useEffect } from "react";
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView, TouchableOpacity, Pressable } from "react-native";
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
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View className="flex-1 p-8 justify-center">
            <View className="mb-12">
              <View className="w-16 h-16 bg-primary-500 rounded-3xl items-center justify-center mb-8 shadow-lg shadow-primary-500/30">
                <Text className="text-3xl">📸</Text>
              </View>
              <Text className="text-4xl font-black text-slate-900 mb-3 tracking-tight">
                Welcome{"\n"}Back!
              </Text>
              <Text className="text-base font-medium text-slate-400">
                Pick up where you left off.
              </Text>
            </View>

            {error && (
              <View className="bg-red-50 border border-red-100 p-5 rounded-[24px] mb-8">
                <Text className="text-red-500 font-bold text-center text-xs">{error}</Text>
              </View>
            )}

            <View>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Email Address"
                    placeholder="name@example.com"
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
                    placeholder="••••••••"
                    isPassword
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.password?.message}
                  />
                )}
              />

              <View className="items-end mb-8">
                <Pressable>
                  <Text className="text-primary-500 text-xs font-bold uppercase tracking-widest">
                    Forgot Password?
                  </Text>
                </Pressable>
              </View>

              <Button
                label="Sign In"
                onPress={handleSubmit(onSubmit)}
                isLoading={isLoading}
                size="lg"
                className="w-full mb-8 shadow-xl shadow-primary-500/40"
              />

              <View className="flex-row justify-center items-center">
                <Text className="text-slate-400 text-sm font-medium">
                  Don't have an account?{" "}
                </Text>
                <Link href="/(auth)/register" asChild>
                  <TouchableOpacity>
                    <Text className="text-primary-500 text-sm font-black uppercase tracking-widest">
                      Sign Up
                    </Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

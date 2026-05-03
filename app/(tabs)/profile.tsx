import React from "react";
import { View, Text, Switch, Alert, ScrollView, TouchableOpacity, Platform } from "react-native";
import { useAuthStore } from "../../src/store/authStore";
import { usePrefsStore } from "../../src/store/prefsStore";
import { useCourseStore } from "../../src/store/courseStore";
import { Button } from "../../src/components/ui/Button";
import { Avatar } from "../../src/components/ui/Avatar";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { darkMode, toggleDarkMode, notifGranted, setNotifGranted } = usePrefsStore();
  const { enrolled, bookmarks } = useCourseStore();

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Sign Out", 
        style: "destructive", 
        onPress: async () => {
          await logout();
          router.replace("/(auth)/login");
        } 
      },
    ]);
  };

  const handleToggleNotifs = async (val: boolean) => {
    // In a real app we'd request actual OS permissions here
    await setNotifGranted(val);
    if (val) {
      Alert.alert("Notifications Enabled", "You will now receive milestone alerts.");
    }
  };

  if (!user) return null;

  const menuItems = [
    { label: "My Courses", icon: "🎬", route: "/(tabs)/bookmarks" },
    { label: "Dark Mode", icon: "🌙", toggle: true, value: darkMode, onToggle: toggleDarkMode },
    { label: "Notification", icon: "🔔", toggle: true, value: notifGranted, onToggle: handleToggleNotifs },
    { label: "Certificate", icon: "📜", route: null },
    { label: "Watch History", icon: "🕒", route: null },
    { label: "Available For Hire", icon: "💼", toggle: true, value: false },
    { label: "Payment", icon: "💳", route: null },
    { label: "Contact Support", icon: "🎧", route: null },
    { label: "Terms Of Services", icon: "📄", route: null },
    { label: "Privacy & Policy", icon: "🔒", route: null },
  ];

  return (
    <ScrollView className="flex-1 bg-white dark:bg-slate-900" showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View className="p-8 items-center border-b border-slate-50 dark:border-slate-800">
        <Avatar url={user.avatar?.url} fallback={user.username} size="xl" className="mb-5 shadow-lg border-2 border-primary-100 dark:border-primary-900/50" />
        <Text className="text-3xl font-black text-slate-900 dark:text-white mb-1">
          {user.fullName || user.username}
        </Text>
        <Text className="text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-widest">
           Following : 32  •  Total Attend Lessons : 52
        </Text>
      </View>

      <View className="p-6">
        <View className="space-y-2">
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              activeOpacity={0.6}
              onPress={() => {
                if (Platform.OS !== "web") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                }
                if (item.route) {
                  router.push(item.route as any);
                } else if (!item.toggle) {
                  Alert.alert("Coming Soon", `${item.label} feature is being modernized and will be available in the next update!`);
                }
              }}
              className="flex-row items-center justify-between p-5 bg-slate-50/50 dark:bg-slate-800/50 rounded-[24px] mb-3 border border-slate-100/50 dark:border-slate-700/50"
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-700 items-center justify-center mr-4 shadow-sm">
                  <Text className="text-lg">{item.icon}</Text>
                </View>
                <Text className="text-slate-800 dark:text-slate-100 text-[15px] font-bold">{item.label}</Text>
              </View>
              
              {item.toggle ? (
                <Switch
                  value={item.value}
                  onValueChange={item.onToggle}
                  trackColor={{ false: "#e2e8f0", true: "#4db6ac" }}
                  thumbColor="#ffffff"
                />
              ) : (
                <Text className="text-slate-300 dark:text-slate-600 text-lg">›</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <Button
          label="Logout"
          variant="danger"
          size="lg"
          className="mt-8 mb-12 shadow-xl shadow-red-500/20"
          onPress={handleLogout}
          leftIcon={<Text className="mr-2">🚪</Text>}
        />
      </View>
    </ScrollView>
  );
}

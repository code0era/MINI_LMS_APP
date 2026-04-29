import React from "react";
import { View, Text, Switch, Alert, ScrollView } from "react-native";
import { useAuthStore } from "../../src/store/authStore";
import { usePrefsStore } from "../../src/store/prefsStore";
import { useCourseStore } from "../../src/store/courseStore";
import { Button } from "../../src/components/ui/Button";
import { Avatar } from "../../src/components/ui/Avatar";
import { useRouter } from "expo-router";

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

  return (
    <ScrollView className="flex-1 bg-surface-DEFAULT">
      <View className="p-6 items-center border-b border-surface-border bg-surface-card">
        <Avatar url={user.avatar?.url} fallback={user.username} size="xl" className="mb-4" />
        <Text className="text-2xl font-bold text-text-primary mb-1">
          {user.fullName || user.username}
        </Text>
        <Text className="text-text-secondary">{user.email}</Text>
      </View>

      <View className="p-6">
        <Text className="text-sm font-semi text-text-secondary uppercase tracking-wider mb-4">
          Learning Stats
        </Text>
        
        <View className="flex-row justify-between mb-8">
          <View className="bg-surface-card rounded-xl p-4 flex-1 mr-2 border border-surface-border items-center">
            <Text className="text-3xl font-bold text-primary-500 mb-1">{enrolled.length}</Text>
            <Text className="text-xs text-text-secondary font-medium uppercase text-center">Enrolled</Text>
          </View>
          <View className="bg-surface-card rounded-xl p-4 flex-1 ml-2 border border-surface-border items-center">
            <Text className="text-3xl font-bold text-primary-500 mb-1">{bookmarks.length}</Text>
            <Text className="text-xs text-text-secondary font-medium uppercase text-center">Bookmarks</Text>
          </View>
        </View>

        <Text className="text-sm font-semi text-text-secondary uppercase tracking-wider mb-4">
          Preferences
        </Text>

        <View className="bg-surface-card rounded-xl border border-surface-border mb-8 overflow-hidden">
          <View className="flex-row items-center justify-between p-4 border-b border-surface-border">
            <View className="flex-row items-center">
              <Text className="text-xl mr-3">🌙</Text>
              <Text className="text-text-primary text-base font-medium">Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: "#334155", true: "#6366f1" }}
              thumbColor="#ffffff"
            />
          </View>

          <View className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center">
              <Text className="text-xl mr-3">🔔</Text>
              <Text className="text-text-primary text-base font-medium">Notifications</Text>
            </View>
            <Switch
              value={notifGranted}
              onValueChange={handleToggleNotifs}
              trackColor={{ false: "#334155", true: "#6366f1" }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        <Button
          label="Sign Out"
          variant="danger"
          onPress={handleLogout}
        />
      </View>
    </ScrollView>
  );
}

import { Tabs } from "expo-router";
import { View, Text } from "react-native";
import { AnalyticsProvider } from "../../src/services/analytics";
import { useColorScheme } from "nativewind";

export default function TabsLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <AnalyticsProvider>
      <Tabs
        screenOptions={{
          headerShown: true,
          tabBarStyle: {
            backgroundColor: isDark ? "#0f172a" : "#ffffff", // slate-900 or white
            borderTopColor: isDark ? "#1e293b" : "#f1f5f9", // slate-800 or border
            height: 80,
            paddingBottom: 20,
            paddingTop: 10,
            elevation: 0,
            shadowOpacity: 0,
          },
          tabBarActiveTintColor: "#4db6ac",
          tabBarInactiveTintColor: isDark ? "#64748b" : "#94a3b8", // slate-500 or muted
          headerStyle: {
            backgroundColor: isDark ? "#0f172a" : "#ffffff",
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTitleStyle: {
            color: "#4db6ac",
            fontWeight: "bold",
            fontSize: 22,
          },
          headerTintColor: "#4db6ac",
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Courses",
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>📚</Text>,
          }}
        />
        <Tabs.Screen
          name="bookmarks"
          options={{
            title: "My Course",
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🎬</Text>,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>👤</Text>,
          }}
        />
      </Tabs>
    </AnalyticsProvider>
  );
}

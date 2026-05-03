import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "../src/store/authStore";
import { usePrefsStore } from "../src/store/prefsStore";
import { ErrorBoundary } from "../src/components/ErrorBoundary";
import { OfflineBanner } from "../src/components/OfflineBanner";
import { useNotifications } from "../src/hooks/useNotifications";
import { useColorScheme } from "nativewind";

import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import "../global.css";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reload may cause this to fail, which is okay */
});

export default function RootLayout() {
  const hydrateAuth = useAuthStore((s) => s.hydrate);
  const hydratePrefs = usePrefsStore((s) => s.hydrate);
  const darkMode = usePrefsStore((s) => s.darkMode);
  const [isReady, setIsReady] = useState(false);

  const { setColorScheme } = useColorScheme();

  // Initialize background notification tracking
  useNotifications();

  useEffect(() => {
    async function init() {
      try {
        await Promise.all([hydratePrefs(), hydrateAuth()]);
      } catch (e) {
        console.warn("Hydration failed", e);
      } finally {
        setIsReady(true);
        // Delay hide slightly to avoid flash on some platforms
        setTimeout(async () => {
          try {
            await SplashScreen.hideAsync();
          } catch (e) {
            // Ignore splash screen errors
          }
        }, 100);
      }
    }
    init();
  }, []);

  useEffect(() => {
    if (isReady) {
      setColorScheme(darkMode ? "dark" : "light");
    }
  }, [darkMode, isReady]);

  if (!isReady) {
    return null; // Or a splash screen component
  }

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <StatusBar style={darkMode ? "light" : "dark"} />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" options={{ animation: "fade" }} />
          <Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
          <Stack.Screen
            name="course/[id]"
            options={{
              presentation: "modal",
              animation: "slide_from_bottom",
            }}
          />
          <Stack.Screen
            name="webview/[id]"
            options={{
              presentation: "fullScreenModal",
              animation: "slide_from_bottom",
            }}
          />
        </Stack>
        <OfflineBanner />
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

// Documentation: Root layout orchestrating global providers: Sentry, PostHog, Notifications, and Error Boundary.

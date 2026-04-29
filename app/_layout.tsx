import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "../src/store/authStore";
import { usePrefsStore } from "../src/store/prefsStore";
import { ErrorBoundary } from "../src/components/ErrorBoundary";
import { OfflineBanner } from "../src/components/OfflineBanner";
import "../global.css"; // Ensure NativeWind CSS is imported

export default function RootLayout() {
  const hydrateAuth = useAuthStore((s) => s.hydrate);
  const hydratePrefs = usePrefsStore((s) => s.hydrate);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function init() {
      await Promise.all([hydratePrefs(), hydrateAuth()]);
      setIsReady(true);
    }
    init();
  }, []);

  if (!isReady) {
    return null; // Or a splash screen component
  }

  return (
    <ErrorBoundary>
      <StatusBar style="light" />
      <OfflineBanner />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" options={{ animation: "fade" }} />
        <Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
        <Stack.Screen 
          name="course/[id]" 
          options={{ 
            presentation: "modal",
            animation: "slide_from_bottom"
          }} 
        />
        <Stack.Screen 
          name="webview/[id]" 
          options={{ 
            presentation: "fullScreenModal",
            animation: "slide_from_bottom"
          }} 
        />
      </Stack>
    </ErrorBoundary>
  );
}

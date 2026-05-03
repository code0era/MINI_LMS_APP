import React, { useMemo, useRef, useState, useEffect } from "react";
import { View, SafeAreaView, ActivityIndicator, Alert, Pressable, Text, TouchableOpacity, Platform } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { WebView } from "react-native-webview";
import type { WebViewMessageEvent } from "react-native-webview";
import { useCourseStore } from "../../src/store/courseStore";
import { courseHtmlTemplate } from "../../src/services/webviewContent";
import * as Haptics from "expo-haptics";
import { ErrorBoundary } from "../../src/components/ErrorBoundary";

export default function CourseWebViewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { courses } = useCourseStore();
  const webviewRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState(true);

  const course = useMemo(() => courses.find((c) => c.id === id), [courses, id]);

  if (!course) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#4db6ac" />
      </View>
    );
  }

  // Inject data exactly when document ends loading
  const injectedScript = `
    setTimeout(function() {
      window.injectCourseData('${JSON.stringify({
    title: course.title,
    description: course.description,
    instructor: { name: course.instructor.name }
  }).replace(/'/g, "\\'")}');
    }, 100);
    true;
  `;

  const handleMessage = (event: any) => {
    try {
      // WebView uses event.nativeEvent.data, window message uses event.data
      const rawData = event.nativeEvent?.data || event.data;
      if (typeof rawData !== 'string') return;

      const data = JSON.parse(rawData);

      switch (data.type) {
        case "DATA_LOADED":
          setIsLoading(false);
          break;
        case "VIDEO_PLAY":
          if (Platform.OS !== "web") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          break;
        case "VIDEO_COMPLETE":
          if (Platform.OS !== "web") {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
          break;
        case "MODULE_COMPLETE":
          if (Platform.OS !== "web") {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
          Alert.alert(
            "Module Complete!",
            "Great job finishing this section.",
            [{ text: "Continue", onPress: () => router.back() }]
          );
          break;
        case "ERROR":
          console.error("WebView Error:", data.payload.message);
          break;
      }
    } catch (e) {
      // Many messages come through the window, ignore non-JSON ones
    }
  };

  // For web: listen to window messages
  useEffect(() => {
    if (Platform.OS === "web") {
      window.addEventListener("message", handleMessage);
      return () => window.removeEventListener("message", handleMessage);
    }
  }, []);


  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center px-6 py-4 border-b border-slate-50">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Text className="text-xl text-primary-500 font-bold">←</Text>
        </TouchableOpacity>
        <Text className="flex-1 text-xl font-black text-slate-900" numberOfLines={1}>
          Interactive Player
        </Text>
      </View>

      <View className="flex-1 relative bg-slate-900">
        {isLoading && (
          <View className="absolute inset-0 z-10 items-center justify-center bg-white">
            <ActivityIndicator size="large" color="#4db6ac" />
            <Text className="text-slate-400 font-bold mt-4 uppercase tracking-widest text-[10px]">Loading player...</Text>
          </View>
        )}

        <ErrorBoundary>
          {Platform.OS === "web" ? (
            <iframe
              id="course-webview"
              srcDoc={courseHtmlTemplate}
              style={{ flex: 1, border: "none" }}
              onLoad={(e) => {
                // For web, we need to inject the script manually after load
                const iframe = e.target as HTMLIFrameElement;
                if (iframe.contentWindow) {
                  // Execute the script in the iframe's context
                  const script = document.createElement('script');
                  script.innerHTML = injectedScript;
                  iframe.contentDocument?.body.appendChild(script);
                }
              }}
            />
          ) : (
            <WebView
              ref={webviewRef}
              source={{ html: courseHtmlTemplate }}
              injectedJavaScript={injectedScript}
              onMessage={handleMessage}
              className="flex-1 bg-white"
              originWhitelist={['*']}
              javaScriptEnabled={true}
              bounces={false}
            />
          )}
        </ErrorBoundary>
      </View>
    </SafeAreaView>
  );
}

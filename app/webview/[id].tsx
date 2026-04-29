import React, { useMemo, useRef, useState } from "react";
import { View, SafeAreaView, ActivityIndicator, Alert, Pressable, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { WebView, WebViewMessageEvent } from "react-native-webview";
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
      <View className="flex-1 items-center justify-center bg-surface-DEFAULT">
        <ActivityIndicator size="large" color="#6366f1" />
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

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      switch (data.type) {
        case "DATA_LOADED":
          setIsLoading(false);
          break;
        case "VIDEO_PLAY":
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case "VIDEO_COMPLETE":
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case "MODULE_COMPLETE":
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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
      console.error("Failed to parse WebView message", e);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-DEFAULT">
      <View className="flex-row items-center p-4 border-b border-surface-border">
        <Pressable
          onPress={() => router.back()}
          className="bg-surface-card w-10 h-10 rounded-full items-center justify-center mr-3"
        >
          <Text className="text-xl leading-none text-text-primary">✕</Text>
        </Pressable>
        <Text className="flex-1 text-lg font-bold text-text-primary" numberOfLines={1}>
          Interactive Player
        </Text>
      </View>
      
      <View className="flex-1 relative">
        {isLoading && (
          <View className="absolute inset-0 z-10 items-center justify-center bg-surface-DEFAULT">
            <ActivityIndicator size="large" color="#6366f1" />
            <Text className="text-text-secondary mt-4">Loading player...</Text>
          </View>
        )}
        
        <ErrorBoundary>
          <WebView
            ref={webviewRef}
            source={{ html: courseHtmlTemplate }}
            injectedJavaScript={injectedScript}
            onMessage={handleMessage}
            className="flex-1 bg-surface-DEFAULT"
            originWhitelist={['*']}
            javaScriptEnabled={true}
            bounces={false}
          />
        </ErrorBoundary>
      </View>
    </SafeAreaView>
  );
}

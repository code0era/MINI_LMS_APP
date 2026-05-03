import React, { useMemo } from "react";
import { View, Text, ScrollView, SafeAreaView, Pressable, TouchableOpacity, Platform } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import { useCourseStore } from "../../src/store/courseStore";
import { Button } from "../../src/components/ui/Button";
import { Badge } from "../../src/components/ui/Badge";
import { Avatar } from "../../src/components/ui/Avatar";
import { formatPrice, formatRating } from "../../src/utils/formatters";
import * as Haptics from "expo-haptics";
import thumbnailImg from "../../assets/thumbnail.png";

export default function CourseDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState("Lessons");

  const { courses, enrolled, bookmarks, toggleBookmark, enroll } = useCourseStore();

  const course = useMemo(() => courses.find((c) => c.id === id), [courses, id]);
  const isEnrolled = enrolled.includes(id as string);
  const isBookmarked = bookmarks.includes(id as string);

  if (!course) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-slate-800 text-lg">Course not found</Text>
        <Button label="Go Back" onPress={() => router.back()} className="mt-4" />
      </View>
    );
  }

  const handleEnroll = async () => {
    if (isEnrolled) {
      router.push(`/webview/${id}`);
      return;
    }

    try {
      await enroll(course.id);
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      router.push(`/webview/${id}`);
    } catch (err) {
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }
  };

  const handleBookmark = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    toggleBookmark(course.id);
  };

  const tabs = ["Lessons", "Discussions", "Q&A"];

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900">
      <ScrollView className="flex-1" bounces={false} showsVerticalScrollIndicator={false}>
        {/* Header Image Area */}
        <View className="relative h-72 w-full">
          <Image
            source={thumbnailImg}
            className="w-full h-full"
            contentFit="cover"
          />
          <View className="absolute inset-0 bg-black/20" />

          <Pressable
            onPress={() => router.back()}
            className="absolute top-6 left-6 bg-white/20 w-11 h-11 rounded-full items-center justify-center backdrop-blur-md border border-white/30"
          >
            <Text className="text-xl leading-none text-white">←</Text>
          </Pressable>

          <Pressable
            onPress={handleBookmark}
            className="absolute top-6 right-6 bg-white/20 w-11 h-11 rounded-full items-center justify-center backdrop-blur-md border border-white/30"
          >
            <Text className="text-2xl leading-none">
              {isBookmarked ? "❤️" : "🤍"}
            </Text>
          </Pressable>

          <TouchableOpacity
            className="absolute top-1/2 left-1/2 mt-[-30px] ml-[-30px] bg-primary-500 w-15 h-15 rounded-full items-center justify-center shadow-2xl border-4 border-white/50"
            onPress={handleEnroll}
          >
            <Text className="text-white text-2xl ml-1">▶</Text>
          </TouchableOpacity>
        </View>

        <View className="p-7">
          <View className="flex-row items-center justify-between mb-5">
            <View className="bg-primary-50 px-4 py-1.5 rounded-full">
              <Text className="text-primary-600 font-black text-[10px] uppercase tracking-widest">{course.category}</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-amber-400 mr-1.5">★</Text>
              <Text className="font-black text-slate-800 text-sm">
                {formatRating(course.rating)}
              </Text>
            </View>
          </View>

          <Text className="text-3xl font-black text-slate-900 dark:text-white mb-4 leading-tight">
            {course.title}
          </Text>

          {/* Tabs */}
          <View className="flex-row border-b border-slate-100 dark:border-slate-800 mb-8">
            {tabs.map((tab) => (
              <Pressable
                key={tab}
                onPress={() => setActiveTab(tab)}
                className={`pb-4 mr-8 border-b-2 ${activeTab === tab ? 'border-primary-500' : 'border-transparent'}`}
              >
                <Text className={`text-[13px] font-black uppercase tracking-wider ${activeTab === tab ? 'text-primary-500' : 'text-slate-400 dark:text-slate-500'}`}>
                  {tab}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Tab Content: What You Will Learn */}
          <View className="mb-8">
            <Text className="text-lg font-black text-slate-900 dark:text-white mb-4">What You Will Learn</Text>
            <Text className="text-slate-500 dark:text-slate-400 text-[15px] leading-7 font-medium mb-6">
              {course.description}
            </Text>

            <View className="space-y-4">
              {["Mastering the camera settings", "Understanding exposure triangle", "Composition techniques"].map((item, index) => (
                <View key={index} className="flex-row items-center mb-3">
                  <View className="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/40 items-center justify-center mr-3">
                    <Text className="text-primary-600 dark:text-primary-400 text-[10px] font-black">✓</Text>
                  </View>
                  <Text className="text-slate-600 dark:text-slate-300 font-medium text-sm">{item}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Lessons List Mockup */}
          <View>
            <View className="flex-row items-center justify-between mb-5">
              <Text className="text-lg font-black text-slate-900 dark:text-white">Lessons</Text>
              <Text className="text-xs text-slate-400 dark:text-slate-500 font-bold">12 Lessons</Text>
            </View>

            {[1, 2, 3].map((num) => (
              <View key={num} className="bg-slate-50 dark:bg-slate-800/50 rounded-[24px] p-5 mb-4 flex-row items-center justify-between border border-slate-100 dark:border-slate-700/50">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-700 items-center justify-center mr-4 shadow-sm">
                    <Text className="text-primary-500 font-black">{num}</Text>
                  </View>
                  <View>
                    <Text className="text-slate-800 dark:text-slate-100 font-bold mb-1">Introduction Part {num}</Text>
                    <Text className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tighter">15:00 MIN</Text>
                  </View>
                </View>
                <View className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 items-center justify-center shadow-sm">
                  <Text className="text-slate-300 dark:text-slate-500 text-xs">{num === 1 ? '🔓' : '🔒'}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Floating Bottom Bar */}
      <View className="p-8 pt-4 bg-white dark:bg-slate-900 border-t border-slate-50 dark:border-slate-800 shadow-2xl">
        <Button
          label={isEnrolled ? "Continue Learning" : "Enroll Now"}
          size="lg"
          className="shadow-xl shadow-primary-500/30"
          onPress={handleEnroll}
        />
      </View>
    </SafeAreaView>
  );
}

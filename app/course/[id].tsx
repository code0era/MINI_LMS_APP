import React, { useMemo } from "react";
import { View, Text, ScrollView, SafeAreaView, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import { useCourseStore } from "../../src/store/courseStore";
import { Button } from "../../src/components/ui/Button";
import { Badge } from "../../src/components/ui/Badge";
import { Avatar } from "../../src/components/ui/Avatar";
import { formatPrice, formatRating } from "../../src/utils/formatters";
import * as Haptics from "expo-haptics";

export default function CourseDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const { courses, enrolled, bookmarks, toggleBookmark, enroll } = useCourseStore();
  
  const course = useMemo(() => courses.find((c) => c.id === id), [courses, id]);
  const isEnrolled = enrolled.includes(id as string);
  const isBookmarked = bookmarks.includes(id as string);

  if (!course) {
    return (
      <View className="flex-1 items-center justify-center bg-surface-DEFAULT">
        <Text className="text-text-primary text-lg">Course not found</Text>
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
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.push(`/webview/${id}`);
    } catch (err) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleBookmark = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleBookmark(course.id);
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-DEFAULT">
      <ScrollView className="flex-1" bounces={false}>
        <View className="relative h-64 w-full">
          <Image
            source={{ uri: course.thumbnail }}
            className="w-full h-full"
            contentFit="cover"
          />
          <Pressable
            onPress={() => router.back()}
            className="absolute top-4 left-4 bg-surface-card/90 w-10 h-10 rounded-full items-center justify-center"
          >
            <Text className="text-xl leading-none text-text-primary">←</Text>
          </Pressable>
          <Pressable
            onPress={handleBookmark}
            className="absolute top-4 right-4 bg-surface-card/90 w-10 h-10 rounded-full items-center justify-center"
          >
            <Text className="text-2xl leading-none">
              {isBookmarked ? "★" : "☆"}
            </Text>
          </Pressable>
        </View>

        <View className="p-6">
          <View className="flex-row items-center justify-between mb-4">
            <Badge label={course.category} variant="primary" />
            <View className="flex-row items-center">
              <Text className="text-warning mr-1">★</Text>
              <Text className="font-medium text-text-primary">
                {formatRating(course.rating)}
              </Text>
            </View>
          </View>

          <Text className="text-2xl font-bold text-text-primary mb-2">
            {course.title}
          </Text>
          
          <Text className="text-text-secondary text-base leading-relaxed mb-6">
            {course.description}
          </Text>

          <View className="bg-surface-card rounded-xl p-4 border border-surface-border mb-8 flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <Avatar url={course.instructor.avatar} size="lg" className="mr-3" />
              <View className="flex-1">
                <Text className="text-sm text-text-secondary mb-1">Instructor</Text>
                <Text className="text-base font-bold text-text-primary" numberOfLines={1}>
                  {course.instructor.name}
                </Text>
                <Text className="text-xs text-text-secondary mt-0.5">
                  {course.instructor.country}
                </Text>
              </View>
            </View>
          </View>

          <View className="flex-row items-center justify-between mb-8">
            <View>
              <Text className="text-sm text-text-secondary mb-1">Price</Text>
              <Text className="text-3xl font-bold text-primary-500">
                {formatPrice(course.price)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="p-6 pt-2 bg-surface-DEFAULT border-t border-surface-border">
        <Button
          label={isEnrolled ? "Continue Learning" : "Enroll Now"}
          size="lg"
          onPress={handleEnroll}
        />
      </View>
    </SafeAreaView>
  );
}

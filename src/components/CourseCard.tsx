import React, { memo } from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import type { Course } from "../types/course";
import { formatPrice, formatRating } from "../utils/formatters";

interface CourseCardProps {
  course: Course;
  isBookmarked: boolean;
  onPress: (id: string) => void;
  onBookmark: (id: string) => void;
}

function CourseCardBase({
  course,
  isBookmarked,
  onPress,
  onBookmark,
}: CourseCardProps) {
  const handleBookmark = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onBookmark(course.id);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onPress(course.id)}
      className="bg-surface-card rounded-2xl mb-4 overflow-hidden border border-surface-border"
    >
      <View className="relative h-48 w-full">
        <Image
          source={{ uri: course.thumbnail }}
          className="w-full h-full"
          contentFit="cover"
          transition={300}
        />
        <View className="absolute top-3 left-3 bg-surface-card/90 px-2 py-1 rounded-md">
          <Text className="text-xs font-semi text-primary-500 uppercase tracking-wider">
            {course.category}
          </Text>
        </View>
        <Pressable
          onPress={handleBookmark}
          hitSlop={12}
          className="absolute top-3 right-3 bg-surface-card/90 w-8 h-8 rounded-full items-center justify-center"
        >
          <Text className="text-lg leading-none">
            {isBookmarked ? "★" : "☆"}
          </Text>
        </Pressable>
      </View>

      <View className="p-4">
        <View className="flex-row items-center mb-2">
          <Text className="text-warning text-sm mr-1">★</Text>
          <Text className="text-sm font-medium text-text-secondary">
            {formatRating(course.rating)}
          </Text>
          <Text className="text-sm text-surface-muted mx-2">•</Text>
          <Text className="text-sm text-text-secondary">{course.brand}</Text>
        </View>

        <Text
          className="text-lg font-semi text-text-primary mb-1"
          numberOfLines={2}
        >
          {course.title}
        </Text>
        
        <View className="flex-row items-center mt-3 justify-between">
          <View className="flex-row items-center flex-1 pr-2">
            <Image
              source={{ uri: course.instructor.avatar }}
              className="w-6 h-6 rounded-md mr-2"
              contentFit="cover"
            />
            <Text className="text-sm text-text-secondary font-medium" numberOfLines={1}>
              {course.instructor.name}
            </Text>
          </View>
          <Text className="text-lg font-bold text-primary-500">
            {formatPrice(course.price)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// React.memo prevents re-renders when other list items change
export const CourseCard = memo(CourseCardBase, (prev, next) => {
  return (
    prev.course.id === next.course.id &&
    prev.isBookmarked === next.isBookmarked
  );
});

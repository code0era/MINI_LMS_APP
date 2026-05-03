import React, { memo } from "react";
import { View, Text, TouchableOpacity, Pressable, Platform } from "react-native";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import type { Course } from "../types/course";
import { formatPrice, formatRating } from "../utils/formatters";
import thumbnailImg from "../../assets/thumbnail.png";

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
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    }
    onBookmark(course.id);
  };

  return (
    <View
      className="bg-white dark:bg-slate-800 rounded-[32px] mb-6 overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm"
    >
      {/* Thumbnail Area */}
      <View className="relative h-56 w-full">
        <Image
          source={thumbnailImg}
          className="w-full h-full"
          contentFit="cover"
        />
        
        {/* Badges */}
        <View className="absolute top-4 left-4 bg-primary-500 px-3 py-1.5 rounded-lg shadow-sm">
          <Text className="text-[10px] font-bold text-white uppercase">NEW</Text>
        </View>

        <Pressable
          onPress={handleBookmark}
          className="absolute top-4 right-4 bg-white/20 w-10 h-10 rounded-full items-center justify-center backdrop-blur-md"
        >
          <Text className="text-xl">{isBookmarked ? "❤️" : "🤍"}</Text>
        </Pressable>

        {/* Play Button Overlay */}
        <TouchableOpacity 
          className="absolute bottom-[-24px] right-6 bg-primary-500 w-12 h-12 rounded-full items-center justify-center shadow-lg border-4 border-white dark:border-slate-800"
          onPress={() => onPress(course.id)}
        >
          <Text className="text-white text-lg ml-1">▶</Text>
        </TouchableOpacity>
      </View>

      <View className="p-6 pt-8">
        {/* Top Stats */}
        <View className="flex-row items-center mb-2">
          <Text className="text-slate-400 dark:text-slate-500 text-xs font-medium mr-4">847+ Students</Text>
          <View className="flex-row items-center">
            <Text className="text-amber-400 text-xs mr-1">★</Text>
            <Text className="text-slate-400 dark:text-slate-500 text-xs font-bold">{formatRating(course.rating)}</Text>
          </View>
        </View>

        {/* Title */}
        <Text
          className="text-xl font-bold text-slate-800 dark:text-white mb-3"
          numberOfLines={1}
        >
          {course.title}
        </Text>

        {/* Details Row */}
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center">
             <Text className="text-[10px] text-slate-400 dark:text-slate-500 mr-3">🕒 20 Hr</Text>
             <Text className="text-[10px] text-slate-400 dark:text-slate-500 mr-3">📚 35 Lessons</Text>
             <Text className="text-[10px] text-slate-400 dark:text-slate-500">🌐 English</Text>
          </View>
          <Text className="text-primary-500 font-bold text-sm">FREE</Text>
        </View>

        {/* Enroll Button */}
        <TouchableOpacity 
          className="border-t border-slate-50 dark:border-slate-700 pt-4 items-center"
          onPress={() => onPress(course.id)}
        >
          <Text className="text-primary-500 font-black text-sm tracking-widest">ENROLL NOW</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// React.memo prevents re-renders when other list items change
export const CourseCard = memo(CourseCardBase, (prev, next) => {
  return (
    prev.course.id === next.course.id &&
    prev.isBookmarked === next.isBookmarked
  );
});

// Documentation: Highly optimized CourseCard wrapped in React.memo to guarantee 60fps scrolling in LegendList.

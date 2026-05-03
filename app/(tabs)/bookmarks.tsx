import React, { useMemo, useCallback } from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useCourseStore } from "../../src/store/courseStore";
import { CourseCard } from "../../src/components/CourseCard";
import { EmptyState } from "../../src/components/EmptyState";
import { LegendList } from "@legendapp/list";

import type { Course } from "../../src/types/course";

export default function BookmarksScreen() {
  const router = useRouter();
  const { courses, bookmarks, toggleBookmark } = useCourseStore();

  const bookmarkedCourses = useMemo<Course[]>(() => {
    return courses.filter((c) => bookmarks.includes(c.id));
  }, [courses, bookmarks]);

  const handleCoursePress = useCallback((id: string) => {
    router.push(`/course/${id}`);
  }, [router]);

  const handleBookmark = useCallback((id: string) => {
    toggleBookmark(id);
  }, [toggleBookmark]);

  return (
    <View className="flex-1 bg-white dark:bg-slate-900">
      <LegendList<Course>
        data={bookmarkedCourses}
        estimatedItemSize={400}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <View className="px-5 pt-4">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-xl font-black text-slate-900 dark:text-white">Photography</Text>
              <Pressable>
                <Text className="text-xs text-slate-300 dark:text-slate-500 font-bold uppercase tracking-widest">View All</Text>
              </Pressable>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View className="px-5">
            <CourseCard
              course={item}
              isBookmarked={true}
              onPress={handleCoursePress}
              onBookmark={handleBookmark}
            />
          </View>
        )}
        ListEmptyComponent={
          <View className="px-5">
            <EmptyState
              title="No Bookmarks Yet"
              description="Explore the catalog and bookmark courses you're interested in taking later."
              actionLabel="Explore Courses"
              onAction={() => router.push("/(tabs)/home")}
            />
          </View>
        }
      />
    </View>
  );
}

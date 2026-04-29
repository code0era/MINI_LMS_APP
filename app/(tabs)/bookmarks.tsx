import React, { useMemo, useCallback } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { useCourseStore } from "../../src/store/courseStore";
import { CourseCard } from "../../src/components/CourseCard";
import { EmptyState } from "../../src/components/EmptyState";
import { LegendList } from "@legendapp/list";

export default function BookmarksScreen() {
  const router = useRouter();
  const { courses, bookmarks, toggleBookmark } = useCourseStore();

  const bookmarkedCourses = useMemo(() => {
    return courses.filter((c) => bookmarks.includes(c.id));
  }, [courses, bookmarks]);

  const handleCoursePress = useCallback((id: string) => {
    router.push(`/course/${id}`);
  }, [router]);

  const handleBookmark = useCallback((id: string) => {
    toggleBookmark(id);
  }, [toggleBookmark]);

  return (
    <View className="flex-1 bg-surface-DEFAULT">
      <LegendList
        data={bookmarkedCourses}
        estimatedItemSize={280}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <CourseCard
            course={item}
            isBookmarked={true}
            onPress={handleCoursePress}
            onBookmark={handleBookmark}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="No Bookmarks Yet"
            description="Explore the catalog and bookmark courses you're interested in taking later."
            actionLabel="Explore Courses"
            onAction={() => router.push("/(tabs)/home")}
          />
        }
      />
    </View>
  );
}

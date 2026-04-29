import React, { useEffect, useState, useMemo, useCallback } from "react";
import { View, FlatList, RefreshControl, Text } from "react-native";
import { useRouter } from "expo-router";
import { useCourseStore } from "../../src/store/courseStore";
import { CourseCard } from "../../src/components/CourseCard";
import { SkeletonCard } from "../../src/components/SkeletonCard";
import { SearchBar } from "../../src/components/SearchBar";
import { EmptyState } from "../../src/components/EmptyState";
import { LegendList } from "@legendapp/list";

export default function HomeScreen() {
  const router = useRouter();
  const { 
    courses, 
    bookmarks, 
    isLoading, 
    isRefreshing, 
    loadCourses, 
    toggleBookmark 
  } = useCourseStore();
  
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadCourses(false);
  }, []);

  const filteredCourses = useMemo(() => {
    if (!searchQuery) return courses;
    const lowerQuery = searchQuery.toLowerCase();
    return courses.filter(
      (c) =>
        c.title.toLowerCase().includes(lowerQuery) ||
        c.instructor.name.toLowerCase().includes(lowerQuery) ||
        c.category.toLowerCase().includes(lowerQuery)
    );
  }, [courses, searchQuery]);

  const handleRefresh = useCallback(() => {
    loadCourses(true);
  }, [loadCourses]);

  const handleCoursePress = useCallback((id: string) => {
    router.push(`/course/${id}`);
  }, [router]);

  const handleBookmark = useCallback((id: string) => {
    toggleBookmark(id);
  }, [toggleBookmark]);

  if (isLoading && courses.length === 0) {
    return (
      <View className="flex-1 bg-surface-DEFAULT p-4">
        <SearchBar onSearch={setSearchQuery} />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface-DEFAULT">
      <View className="px-4 pt-4">
        <SearchBar onSearch={setSearchQuery} />
      </View>

      <LegendList
        data={filteredCourses}
        estimatedItemSize={280}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#6366f1"
          />
        }
        renderItem={({ item }) => (
          <CourseCard
            course={item}
            isBookmarked={bookmarks.includes(item.id)}
            onPress={handleCoursePress}
            onBookmark={handleBookmark}
          />
        )}
        ListEmptyComponent={
          !isLoading ? (
            <EmptyState
              title="No courses found"
              description={`We couldn't find any courses matching "${searchQuery}"`}
              actionLabel="Clear Search"
              onAction={() => setSearchQuery("")}
            />
          ) : null
        }
      />
    </View>
  );
}

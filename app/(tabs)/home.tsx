import React, { useEffect, useState, useMemo, useCallback } from "react";
import { View, RefreshControl, Text, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useCourseStore } from "../../src/store/courseStore";
import { CourseCard } from "../../src/components/CourseCard";
import { SkeletonCard } from "../../src/components/SkeletonCard";
import { SearchBar } from "../../src/components/SearchBar";
import { EmptyState } from "../../src/components/EmptyState";
import { LiveCreators } from "../../src/components/LiveCreators";
import { LegendList } from "@legendapp/list";
import { useAIRecommendations } from "../../src/hooks/useAIRecommendations";

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
  const { recommendation, isLoading: isAILoading } = useAIRecommendations();

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

  const photographyCourses = useMemo(() => filteredCourses.filter(c => c.category === "Photography"), [filteredCourses]);
  const videographyCourses = useMemo(() => filteredCourses.filter(c => c.category === "Videography" || c.category === "Design"), [filteredCourses]);

  const handleBookmark = useCallback((id: string) => {
    toggleBookmark(id);
  }, [toggleBookmark]);

  if (isLoading && courses.length === 0) {
    return (
      <View className="flex-1 bg-white p-5">
        <SearchBar onSearch={setSearchQuery} />
        <View className="mt-8">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      </View>
    );
  }

  const renderSection = (title: string, data: any[]) => (
    <View className="mb-10">
      <View className="flex-row items-center justify-between px-5 mb-5">
        <Text className="text-xl font-black text-slate-900 dark:text-white">{title}</Text>
        <Pressable>
          <Text className="text-xs text-slate-300 dark:text-slate-500 font-bold uppercase tracking-widest">View All</Text>
        </Pressable>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={{ paddingLeft: 20 }}
      >
        {data.map((item) => (
          <View key={item.id} style={{ width: 300 }} className="mr-5">
            <CourseCard
              course={item}
              isBookmarked={bookmarks.includes(item.id)}
              onPress={handleCoursePress}
              onBookmark={handleBookmark}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View className="flex-1 bg-white dark:bg-slate-900">
      <View className="px-5 pt-6 pb-2">
        <SearchBar onSearch={setSearchQuery} />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <LiveCreators />

        {recommendation && !searchQuery && (
          <View className="bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-900/30 rounded-[32px] p-7 mb-10 mx-5 shadow-sm">
            <View className="flex-row items-center mb-3">
              <Text className="text-3xl mr-4">✨</Text>
              <View>
                <Text className="font-black text-primary-700 dark:text-primary-400 text-base">AI Recommendation</Text>
                <Text className="text-primary-500/60 dark:text-primary-400/60 text-[10px] font-bold uppercase tracking-widest">Personalized for you</Text>
              </View>
            </View>
            <Text className="text-slate-600 dark:text-slate-300 leading-7 text-[14px] font-medium">
              {recommendation}
            </Text>
          </View>
        )}

        {photographyCourses.length > 0 && renderSection("Photography", photographyCourses)}
        {videographyCourses.length > 0 && renderSection("Videography", videographyCourses)}

        {filteredCourses.length === 0 && !isLoading && (
          <EmptyState
            title="No courses found"
            description={`We couldn't find any courses matching "${searchQuery}"`}
            actionLabel="Clear Search"
            onAction={() => setSearchQuery("")}
          />
        )}
      </ScrollView>
    </View>
  );
}

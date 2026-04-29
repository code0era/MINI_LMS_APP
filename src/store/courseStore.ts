import { create } from "zustand";
import { fetchCourses } from "../api/courses";
import type { Course } from "../types/course";
import { storage, STORAGE_KEYS } from "../services/storage";

interface CourseState {
  courses: Course[];
  bookmarks: string[]; // Array of course IDs
  enrolled: string[];  // Array of course IDs
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;

  hydrate: () => Promise<void>;
  loadCourses: (refresh?: boolean) => Promise<void>;
  toggleBookmark: (courseId: string) => Promise<void>;
  enroll: (courseId: string) => Promise<void>;
}

const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

export const useCourseStore = create<CourseState>((set, get) => ({
  courses: [],
  bookmarks: [],
  enrolled: [],
  isLoading: false,
  isRefreshing: false,
  error: null,

  hydrate: async () => {
    try {
      const [cachedCourses, cachedBookmarks, cachedEnrolled] = await Promise.all([
        storage.get<Course[]>(STORAGE_KEYS.COURSES_CACHE),
        storage.get<string[]>(STORAGE_KEYS.BOOKMARKS),
        storage.get<string[]>(STORAGE_KEYS.ENROLLED),
      ]);

      set({
        courses: cachedCourses || [],
        bookmarks: cachedBookmarks || [],
        enrolled: cachedEnrolled || [],
      });
    } catch (err) {
      console.error("Failed to hydrate course store", err);
    }
  },

  loadCourses: async (refresh = false) => {
    if (refresh) {
      set({ isRefreshing: true, error: null });
    } else {
      set({ isLoading: true, error: null });
      
      // Check cache first if not refreshing
      const lastFetch = await storage.get<number>(STORAGE_KEYS.COURSES_CACHE_TS);
      if (lastFetch && Date.now() - lastFetch < CACHE_EXPIRY_MS && get().courses.length > 0) {
        set({ isLoading: false });
        return;
      }
    }

    try {
      // In a real app we'd handle pagination, but for the assignment 
      // we'll fetch a random page if refreshing to simulate variety
      const page = refresh ? Math.floor(Math.random() * 5) + 1 : 1;
      const fetchedCourses = await fetchCourses(page);
      
      await storage.set(STORAGE_KEYS.COURSES_CACHE, fetchedCourses);
      await storage.set(STORAGE_KEYS.COURSES_CACHE_TS, Date.now());
      
      set({ 
        courses: fetchedCourses, 
        isLoading: false, 
        isRefreshing: false 
      });
    } catch (err: any) {
      set({ 
        error: "Failed to load courses. Showing cached data if available.",
        isLoading: false, 
        isRefreshing: false 
      });
    }
  },

  toggleBookmark: async (courseId: string) => {
    const currentBookmarks = get().bookmarks;
    const isBookmarked = currentBookmarks.includes(courseId);
    
    const newBookmarks = isBookmarked
      ? currentBookmarks.filter(id => id !== courseId)
      : [...currentBookmarks, courseId];
      
    set({ bookmarks: newBookmarks });
    
    // In a real app we might sync this with the backend queue
    // For now we persist locally
    try {
      await storage.set(STORAGE_KEYS.BOOKMARKS, newBookmarks);
    } catch (err) {
      // Revert if persistence fails
      set({ bookmarks: currentBookmarks });
    }
  },

  enroll: async (courseId: string) => {
    const currentEnrolled = get().enrolled;
    if (currentEnrolled.includes(courseId)) return;
    
    const newEnrolled = [...currentEnrolled, courseId];
    set({ enrolled: newEnrolled });
    
    try {
      await storage.set(STORAGE_KEYS.ENROLLED, newEnrolled);
    } catch (err) {
      set({ enrolled: currentEnrolled });
      throw new Error("Failed to save enrollment");
    }
  }
}));

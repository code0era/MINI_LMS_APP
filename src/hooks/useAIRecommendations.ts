import { useState, useEffect } from "react";
import Groq from "groq-sdk";
import { GROQ_API_KEY } from "../constants/env";
import { useCourseStore } from "../store/courseStore";

const groq = new Groq({
  apiKey: GROQ_API_KEY,
  dangerouslyAllowBrowser: true, // Required for React Native usage
});

export function useAIRecommendations() {
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { courses, bookmarks, enrolled } = useCourseStore();

  useEffect(() => {
    async function fetchRecommendation() {
      if (!GROQ_API_KEY) return;
      if (bookmarks.length === 0 && enrolled.length === 0) return;
      if (courses.length === 0) return;

      setIsLoading(true);

      try {
        // Collect context for the LLM
        const userInterestIds = [...new Set([...bookmarks, ...enrolled])];
        const userInterests = courses
          .filter(c => userInterestIds.includes(c.id))
          .map(c => c.category)
          .join(", ");

        const availableCourses = courses
          .filter(c => !userInterestIds.includes(c.id))
          .map(c => `${c.title} (${c.category})`)
          .join(", ");

        const prompt = `
          The user is interested in these course categories: ${userInterests}.
          Here are available courses they haven't enrolled in or bookmarked yet: ${availableCourses}.
          Recommend ONE specific course from the available list that fits their interests.
          Keep it under 2 sentences, engaging, and mention the course title exactly.
        `;

        const chatCompletion = await groq.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: "llama3-8b-8192", // Fast and free model
          temperature: 0.7,
        });

        setRecommendation(chatCompletion.choices[0]?.message?.content || null);
      } catch (err) {
        console.error("AI Recommendation failed:", err);
      } finally {
        setIsLoading(false);
      }
    }

    // Only run when bookmarks or enrolled list changes significantly, 
    // or run once on mount. For this demo, run once on mount if data exists.
    fetchRecommendation();
  }, [bookmarks.length, enrolled.length]); // Re-run when lists change

  return { recommendation, isLoading };
}

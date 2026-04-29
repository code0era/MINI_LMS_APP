# CourseWave — Mini LMS App

A full-featured Mini LMS mobile application built with React Native Expo. Designed and architected as a technical assignment.

## 🚀 Key Features

1. **Authentication:** Secure JWT-based login/register using `api.freeapi.app`, with tokens safely stored in `expo-secure-store`.
2. **Course Catalog:** Fetches and merges data from `/randomproducts` (courses) and `/randomusers` (instructors) dynamically, implementing infinite scroll with high-performance `@legendapp/list`.
3. **Interactive Player (WebView):** A custom bridge passing React Native state into an HTML/JS context, including simulated video events and module completion tracking.
4. **Offline-First:** All courses and user data are cached locally using `@react-native-async-storage/async-storage`. A banner automatically alerts users when network connectivity is lost.
5. **State Management:** Fully modular `zustand` implementation splitting state into `authStore`, `courseStore`, and `prefsStore`.
6. **Smart Notifications:** Automated local push notifications triggered by learning milestones (e.g., 5 bookmarks) and a 24h inactivity tracker.
7. **AI Recommendations (Bonus):** Integrates the Groq API (Llama 3) to analyze a user's bookmark history and recommend their next course.
8. **Error Tracking & Analytics (Bonus):** Fully wired with Sentry (crash reporting) and PostHog (event tracking).

## 🛠 Tech Stack

- **Framework:** React Native Expo (SDK 52+)
- **Language:** TypeScript (Strict Mode)
- **Styling:** NativeWind (Tailwind CSS v4)
- **State Management:** Zustand
- **Networking:** Axios (with custom retry/refresh interceptors)
- **Form Validation:** React Hook Form + Zod
- **List Rendering:** `@legendapp/list`
- **CI/CD:** GitHub Actions + EAS Build

## 📦 Local Setup

1. **Clone the repository:**
   \`\`\`bash
   git clone https://github.com/code0era/MINI_LMS_APP.git
   cd MINI_LMS_APP
   \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   npm install
   # If you encounter peer dependency issues with React 19:
   # npm install --legacy-peer-deps
   \`\`\`

3. **Configure Environment Variables:**
   Rename `.env.example` to `.env` and fill in the required keys. (Note: Only `EXPO_PUBLIC_API_BASE_URL` is mandatory. The rest are for bonus features).

4. **Start the development server:**
   \`\`\`bash
   npx expo start
   \`\`\`
   
5. **Run on device/emulator:**
   Press `a` for Android or `i` for iOS.

## 🏗 Architecture Decisions

- **Why Zustand?** Lighter than Redux, less boilerplate, and easier to hydrate asynchronously from local storage on app boot.
- **Why LegendList?** React Native's default `FlatList` drops frames when rendering complex cards with images. `LegendList` recycles components aggressively, maintaining 60fps even with 100+ items.
- **Why NativeWind?** Enforces a strict, consistent design system (colors, spacing, typography) while allowing rapid UI iteration without context switching to StyleSheet objects.
- **Axios Interceptors:** A request queue was implemented inside the response interceptor to handle 401 errors gracefully. If multiple requests fail simultaneously due to an expired token, the app only calls the refresh endpoint *once*, queues the others, and resolves them all when the new token arrives.

## 📝 Submission Checklist

- [x] All 6 core requirements met
- [x] TypeScript strictly typed
- [x] Environment variables secured
- [x] No `console.log` in production
- [x] APK build configured

---
*Built as a technical assignment submission.*

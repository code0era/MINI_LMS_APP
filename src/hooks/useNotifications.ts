import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import { usePrefsStore } from "../store/prefsStore";
import { useCourseStore } from "../store/courseStore";
import { 
  requestNotificationPermissions, 
  scheduleMilestoneNotification, 
  scheduleInactivityReminder 
} from "../services/notifications";

export function useNotifications() {
  const { notifGranted, setNotifGranted, updateLastActive } = usePrefsStore();
  const { bookmarks } = useCourseStore();
  const appState = useRef(AppState.currentState);

  // Initial setup and permissions
  useEffect(() => {
    async function setup() {
      const granted = await requestNotificationPermissions();
      setNotifGranted(granted);
    }
    
    if (!notifGranted) {
      setup();
    }
  }, []);

  // Milestone tracking (5 bookmarks)
  useEffect(() => {
    if (notifGranted && bookmarks.length === 5) {
      scheduleMilestoneNotification(5);
    }
  }, [bookmarks.length, notifGranted]);

  // AppState tracking for inactivity reminders
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        // App has come to the foreground
        updateLastActive();
        // Cancel the inactivity reminder since they are active now
        if (notifGranted) {
          scheduleInactivityReminder(); // Re-schedule it for 24h from NOW
        }
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [notifGranted]);
}

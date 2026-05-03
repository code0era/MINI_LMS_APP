import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#4db6ac",
      });
    }

    if (Platform.OS === "web") return false;

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    return finalStatus === "granted";
  } catch (err) {
    console.warn("Notification permissions failed:", err);
    return false;
  }
}

export async function scheduleMilestoneNotification(bookmarksCount: number) {
  if (Platform.OS === "web") return;

  try {
    if (bookmarksCount === 5) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Milestone Reached! 🎉",
          body: "You've bookmarked 5 courses! Ready to start learning?",
          sound: true,
        },
        trigger: null, // trigger immediately
      });
    }
  } catch (err) {
    console.warn("Milestone notification failed:", err);
  }
}

export async function scheduleInactivityReminder() {
  if (Platform.OS === "web") return;

  try {
    // Cancel any existing inactivity reminder first
    await Notifications.cancelAllScheduledNotificationsAsync().catch(() => {});
    
    // Schedule a new one for 24 hours from now
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "We miss you! 👋",
        body: "It's been a day since you last learned something new. Jump back in!",
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 60 * 60 * 24, // 24 hours
      },
    });
  } catch (err) {
    console.warn("Inactivity reminder failed:", err);
  }
}

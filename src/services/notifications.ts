import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#6366f1",
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  return finalStatus === "granted";
}

export async function scheduleMilestoneNotification(bookmarksCount: number) {
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
}

export async function scheduleInactivityReminder() {
  // Cancel any existing inactivity reminder first
  await Notifications.cancelAllScheduledNotificationsAsync();
  
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
}

import { isDevice } from "expo-device";
import {
  AndroidImportance,
  getExpoPushTokenAsync,
  getPermissionsAsync,
  requestPermissionsAsync,
  setNotificationChannelAsync,
  setNotificationHandler,
} from "expo-notifications";
import { useEffect } from "react";
import { Platform } from "react-native";

import { projectId } from "./constants";

// Based on: https://docs.expo.dev/push-notifications/push-notifications-setup/#test-using-the-push-notifications-tool

export const setExpoNotificationHandler = () => {
  setNotificationHandler({
    handleNotification: () =>
      Promise.resolve({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
  });
};

const registerForPushNotificationsAsync = async () => {
  if (Platform.OS === "android") {
    await setNotificationChannelAsync("default", {
      name: "default",
      importance: AndroidImportance.DEFAULT,
    });
  }

  if (!isDevice) {
    return null;
  }

  const { status: existingStatus } = await getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return null;
  }

  const { data } = await getExpoPushTokenAsync({ projectId });
  return data;
};

export const useExpoNotifications = () => {
  useEffect(() => {
    void registerForPushNotificationsAsync().then((token) => {
      // TODO: send token to server
      console.error(token);
    });
  }, []);
};

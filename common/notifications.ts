import ExpoConstants from "expo-constants";
import { isDevice } from "expo-device";
import {
  AndroidImportance,
  getExpoPushTokenAsync,
  getPermissionsAsync,
  requestPermissionsAsync,
  setNotificationChannelAsync,
  setNotificationHandler,
} from "expo-notifications";
import { useCallback } from "react";
import { Platform } from "react-native";

import { useMutation } from "./api";

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

const getExpoNotificationToken = async () => {
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

  const { data } = await getExpoPushTokenAsync({
    projectId: (
      ExpoConstants.expoConfig!.extra!["eas"] as { projectId: string }
    )["projectId"],
  });
  return data;
};

export const useDeviceRegistration = () => {
  const registerDevice = useMutation("post", "/api/v1/account/device");
  return useCallback(
    (identityToken: string) =>
      requestIdleCallback(async () => {
        const deviceToken = await getExpoNotificationToken();
        if (deviceToken) {
          await registerDevice({
            body: { deviceToken, deviceType: Platform.OS },
            headers: { Authorization: `Bearer ${identityToken}` },
          });
        }
      }),
    [registerDevice],
  );
};

import { useState, useEffect, useRef } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

const updateUserPushToken = async (token: string) => {
  console.log("Mengirim Expo Push Token ke backend:", token);
};

export const usePushNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>("");

  async function registerForPushNotificationsAsync(): Promise<
    string | undefined
  > {
    if (!Device.isDevice) {
      console.warn("Push notification hanya berfungsi di perangkat fisik.");
      return;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      console.error("Izin notifikasi tidak diberikan!");
      return;
    }

    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    if (!projectId) {
      console.error(
        "EAS project ID tidak ditemukan di app.json. Jalankan `eas project:init`."
      );
      return;
    }

    try {
      const token = (await Notifications.getExpoPushTokenAsync({ projectId }))
        .data;
      return token;
    } catch (e) {
      console.error("Gagal mendapatkan Expo Push Token:", e);
    }
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        setExpoPushToken(token);
        updateUserPushToken(token);
      }
    });
  }, []);

  return { expoPushToken };
};

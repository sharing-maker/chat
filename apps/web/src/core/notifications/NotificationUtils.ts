import { getMessaging, getToken } from "firebase/messaging";

export const requestNotificationPermission = () => {
  let granted = false;
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      granted = true;
    }
  });
  return granted;
};

export const getFcmToken = async () => {
  let fcmToken = "";
  const messaging = getMessaging();
  await getToken(messaging, {
    vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
  })
    .then((currentToken) => {
      if (currentToken) {
        fcmToken = currentToken;
      } else {
        console.error(
          "No registration token available. Request permission to generate one."
        );
      }
    })
    .catch((err) => {
      console.error("An error occurred while retrieving token. ", err);
    });
  return fcmToken;
};

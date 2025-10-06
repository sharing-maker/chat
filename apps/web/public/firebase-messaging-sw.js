/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */

// Change the Firebase version to match the version in your application.
importScripts(
  "https://www.gstatic.com/firebasejs/12.3.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/12.3.0/firebase-messaging-compat.js"
);

importScripts("/droppii-messaging/droppii-firebase-message.js");

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  let ex = {};
  try {
    ex = JSON.parse(payload.data?.ex || "{}");
  } catch (error) {
    ex = {};
  }

  const notificationTitle = ex?.title || "New message";
  const notificationOptions = {
    body: ex?.desc,
    icon: ex?.icon || "/droppii.jpeg",
    data: ex,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        if (clientList.length > 0) {
          // focus tab đầu tiên
          const client = clientList[0];
          client.focus();

          // Gửi message cho tab đó để next/router handle
          if (event.notification.data?.conversationId) {
            client.postMessage({
              type: "onNotificationNewMessageClick",
              conversationId: event.notification.data?.conversationId,
            });
          }
          return;
        }

        // Nếu chưa có tab nào → mở mới (full reload)
        return clients.openWindow(self.location.origin);
      })
  );
});

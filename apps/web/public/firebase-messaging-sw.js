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
importScripts("/droppii-messaging/droppii-helper.js");

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

async function onPushNotification(e) {
  try {
    const payload = e?.data?.json();
    let ex = {};
    try {
      ex = JSON.parse(payload?.data?.ex || "{}");
    } catch (error) {
      ex = {};
    }

    const clientList = await getClientList();
    if (hasVisibleClients(clientList)) return;

    const notificationTitle = ex?.title || "Droppii Chat";
    const notificationBody = ex?.desc || "Bạn có tin nhắn mới";
    const notificationOptions = {
      body: notificationBody,
      icon: ex?.icon || "/droppii.jpeg",
      data: ex,
    };
    return self.registration.showNotification(
      notificationTitle,
      notificationOptions
    );
  } catch (error) {
    console.error(error, "[firebase-messaging-sw.js] error");
  }
}

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

self.addEventListener("push", (e) => {
  e.waitUntil(onPushNotification(e));
});

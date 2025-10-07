/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */

function hasVisibleClients(clientList) {
  return clientList.some(
    (client) =>
      client.visibilityState === "visible" &&
      // Ignore chrome-extension clients as that matches the background pages of extensions, which
      // are always considered visible for some reason.
      !client.url.startsWith("chrome-extension://")
  );
}

function getClientList() {
  return self.clients.matchAll({
    type: "window",
    includeUncontrolled: true,
  });
}

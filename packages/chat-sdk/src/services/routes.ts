export const ENDPOINTS = {
  chatService: {
    getChatToken: "/chat-service/v1/auth/token",
    getSessionSummary: "chat-service/v1/crm/sessions/assigned/summary",
    getSessionsByTagOrStatus: "chat-service/v1/crm/sessions/assigned/query",
    searchMessage: "chat-service/v1/messages/search",
    updateSession: (sessionId: string) =>
      `chat-service/v1/crm/sessions/${sessionId}`,
  },
  identityService: {
    getToken: "/identity-service/v1/identity/get-token",
  },
  userService: {
    getCurrentUserInfo: "/user-service/v1/app/user",
  },
};

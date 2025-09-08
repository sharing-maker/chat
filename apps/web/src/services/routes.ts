export const ENDPOINTS = {
  chatService: {
    getChatToken: "/chat-service/v1/auth/token",
    getSessionSummary: "chat-service/v1/crm/sessions/assigned/summary",
    getSessionsByStatus: "chat-service/v1/crm/sessions/assigned/query",
  },
  identityService: {
    getToken: "/identity-service/v1/identity/get-token",
  },
  userService: {
    getCurrentUserInfo: "/user-service/v1/app/user",
  },
};

export const ROUTES = {
  CHAT: "/chat",
  LOGIN: "/login",
};

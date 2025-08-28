import { useMutation } from "@tanstack/react-query";
import { apiInstance } from "@web/services/api";
import { QUERY_KEYS } from "@web/services/query";
import { ENDPOINTS } from "@web/services/routes";

export const useRefetchChatToken = () =>
  useMutation({
    mutationKey: [QUERY_KEYS.REFRESH_CHAT_TOKEN],
    mutationFn: async () => {
      const res = await apiInstance.post<any>(
        ENDPOINTS.chatService.getChatToken
      );
      return res.data;
    },
  });

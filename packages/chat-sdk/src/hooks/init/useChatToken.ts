import { useMutation } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../services/query";
import { apiInstance } from "../../services/api";
import { ENDPOINTS } from "../../services/routes";

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

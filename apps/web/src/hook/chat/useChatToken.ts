import { DChatPlatform } from "@droppii-org/chat-sdk";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiInstance } from "@web/services/api";
import { QUERY_KEYS } from "@web/services/query";
import { ENDPOINTS } from "@web/services/routes";

interface UseRefetchChatTokenProps {
  platformID: DChatPlatform;
  userID: string;
}
export const useRefetchChatToken = () =>
  useMutation({
    mutationKey: [QUERY_KEYS.REFRESH_CHAT_TOKEN],
    mutationFn: async (params: UseRefetchChatTokenProps) => {
      const res = await apiInstance.post<any>(
        ENDPOINTS.chatService.getChatToken,
        params
      );
      return res.data;
    },
  });

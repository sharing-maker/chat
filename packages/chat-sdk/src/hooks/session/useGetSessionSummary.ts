import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../services/query";
import { apiInstance } from "../../services/api";
import { ENDPOINTS } from "../../services/routes";
import { BaseResponse, ISessionSummaryResponse } from "../../types/dto";

export const useGetSessionSummary = () =>
  useQuery({
    queryKey: [QUERY_KEYS.GET_SESSION_SUMMARY],
    queryFn: async () => {
      const res = await apiInstance.post<BaseResponse<ISessionSummaryResponse>>(
        ENDPOINTS.chatService.getSessionSummary,
        {
          applicationType: "OBEFE",
        }
      );
      return res?.data?.data;
    },
  });

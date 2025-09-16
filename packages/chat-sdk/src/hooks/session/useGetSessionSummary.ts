import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../services/query";
import { apiInstance } from "../../services/api";
import { ENDPOINTS } from "../../services/routes";
import { BaseResponse, ISessionSummaryResponse } from "../../types/dto";
import useAuthStore from "../../store/auth";

export const useGetSessionSummary = () =>
  useQuery({
    queryKey: [QUERY_KEYS.GET_SESSION_SUMMARY],
    queryFn: async () => {
      const res = await apiInstance.post<BaseResponse<ISessionSummaryResponse>>(
        ENDPOINTS.chatService.getSessionSummary,
        {
          applicationType: useAuthStore.getState().applicationType,
        }
      );
      return res?.data?.data;
    },
  });

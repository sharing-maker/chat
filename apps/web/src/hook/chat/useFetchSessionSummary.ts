import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { apiInstance } from "@web/services/api";
import { ENDPOINTS } from "@web/services/routes";
import { BaseResponse } from "@web/types/common";

const GET_SESSION_SUMMARY_KEY = "GET_SESSION_SUMMARY_KEY";

export const useFetchSessionSummary = (): UseQueryResult<
  ISessionSummary,
  unknown
> => {
  return useQuery({
    queryKey: [GET_SESSION_SUMMARY_KEY],
    queryFn: async () => {
      const res = await apiInstance.post(
        ENDPOINTS.chatService.getSessionSummary,
        {
          applicationType: "OBEFE",
        }
      );
      return res?.data?.data;
    },
  });
};

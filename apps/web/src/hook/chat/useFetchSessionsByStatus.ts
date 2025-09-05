import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { apiInstance } from "@web/services/api";
import { ENDPOINTS } from "@web/services/routes";
import { BaseResponse } from "@web/types/common";
import { ISessionByStatus } from "./type";

const GET_SESSION_BY_STATUS_KEY = "GET_SESSION_BY_STATUS_KEY";

export const useFetchSessionByStatus = ({
  status,
  tag,
}: {
  status?: string;
  tag?: string;
}): UseQueryResult<BaseResponse<ISessionByStatus>, unknown> => {
  return useQuery({
    queryKey: [GET_SESSION_BY_STATUS_KEY, status, tag],
    queryFn: async () => {
      const res = await apiInstance.post(
        ENDPOINTS.chatService.getSessionsByStatus,
        {
          applicationType: "OBEFE",
          status,
          tag,
        }
      );
      return res.data?.data;
    },
  });
};

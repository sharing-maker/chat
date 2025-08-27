import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { apiInstance } from "@web/services/api";
import { ENDPOINTS } from "@web/services/routes";
import { BaseResponse } from "@web/types/common";

const GET_CURRENT_USER_KEY = "GET_CURRENT_USER_KEY";

export const useFetchCurrentUser = (
  disabled?: boolean
): UseQueryResult<BaseResponse<any>, unknown> => {
  return useQuery({
    queryKey: [GET_CURRENT_USER_KEY],
    queryFn: async () => {
      const res = await apiInstance.get(
        ENDPOINTS.userService.getCurrentUserInfo
      );
      return res.data;
    },
    enabled: !disabled,
  });
};

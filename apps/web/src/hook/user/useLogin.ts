import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { apiInstance } from "@web/services/api";
import { ENDPOINTS } from "@web/services/routes";
import { BaseResponse } from "@web/types/common";

interface useFetchTokenProps {
  username: string;
  password: string;
}

export const useFetchToken = (): UseMutationResult<
  BaseResponse<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }>,
  unknown,
  useFetchTokenProps
> =>
  useMutation({
    mutationFn: async (data: useFetchTokenProps) => {
      const res = await apiInstance.post<any>(
        ENDPOINTS.identityService.getToken,
        {
          username: data.username,
          password: data.password,
        }
      );

      return res.data;
    },
  });

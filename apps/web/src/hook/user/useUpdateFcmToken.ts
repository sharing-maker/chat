import { useMutation } from "@tanstack/react-query";
import { apiInstance } from "@web/services/api";
import { ENDPOINTS } from "@web/services/routes";
import { BaseResponse } from "@web/types/common";
import { UpdateFcmTokenRequest } from "@web/types/dto";

export const useUpdateFcmToken = () =>
  useMutation({
    mutationFn: async (payload: UpdateFcmTokenRequest) => {
      const res = await apiInstance.post<BaseResponse<any>>(
        ENDPOINTS.chatService.uploadFcmToken,
        payload
      );
      return res.data;
    },
  });

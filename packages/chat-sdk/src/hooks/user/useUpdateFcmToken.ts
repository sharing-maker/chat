import { useMutation } from "@tanstack/react-query";
import { apiInstance } from "../../services/api";
import { BaseResponse, UpdateFcmTokenRequest } from "../../types/dto";
import { ENDPOINTS } from "../../services/routes";
import { DChatPlatform } from "../..";
import useAuthStore from "../../store/auth";
import dayjs from "dayjs";

export const useUpdateFcmToken = () =>
  useMutation({
    mutationFn: async (fcmToken: string) => {
      const res = await apiInstance.post<BaseResponse<any>>(
        ENDPOINTS.chatService.uploadFcmToken,
        {
          platformID: DChatPlatform.Web,
          fcmToken,
          account: useAuthStore.getState().userID || "",
          expireTime: dayjs().add(7, "day").valueOf(),
        },
        {
          headers: {
            operationID: `fcm_update_${dayjs().valueOf()}`,
          },
        }
      );
      return res.data;
    },
  });

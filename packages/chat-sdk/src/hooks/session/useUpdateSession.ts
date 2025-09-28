"use client";
import { useMutation } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../services/query";
import { apiInstance } from "../../services/api";
import { ENDPOINTS } from "../../services/routes";
import useAuthStore from "../../store/auth";
import { UpdateSessionResponse } from "../../types/dto";
import { emit } from "../../utils/events";

interface UpdateSessionParams {
  sessionId: string;
  status?: string;
  tag?: string;
}

export const useUpdateSession = () =>
  useMutation({
    mutationKey: [QUERY_KEYS.UPDATE_SESSION],
    mutationFn: async ({ sessionId, status, tag }: UpdateSessionParams) => {
      const res = await apiInstance.put<any>(
        ENDPOINTS.chatService.updateSession(sessionId),
        {
          status,
          tag,
          applicationType: useAuthStore.getState().applicationType,
        }
      );
      return res.data;
    },
  });

export const updateSession = (data: UpdateSessionResponse) =>
  emit("UPDATE_SESSION", data);

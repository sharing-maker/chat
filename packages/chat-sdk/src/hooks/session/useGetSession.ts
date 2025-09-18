"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { apiInstance } from "../../services/api";
import { ENDPOINTS } from "../../services/routes";
import { BaseResponse, SessionByTagOrStatusRequest } from "../../types/dto";
import { QUERY_KEYS } from "../../services/query";
import { IFilterSummary, ISessionByStatus } from "../../store/type";
import { useMemo } from "react";
import useConversationStore from "../../store/conversation";
import { DChatSDK } from "../../constants/sdk";
import useAuthStore from "../../store/auth";
import { PAGE_SIZE } from "../../constants";

export const useGetSession = (
  filter: IFilterSummary,
  options?: { pageSize?: number }
) => {
  const conversationList = useConversationStore(
    (state) => state.conversationList
  );
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    ...rest
  } = useInfiniteQuery({
    initialPageParam: 1,
    queryKey: [QUERY_KEYS.GET_SESSION_BY_TAG_OR_STATUS, filter, options],
    queryFn: async ({ pageParam = 1 }) => {
      const params: SessionByTagOrStatusRequest = {
        applicationType: useAuthStore.getState().applicationType,
        tag: filter.tag,
        status: filter.status,
        page: pageParam,
        pageSize: options?.pageSize || PAGE_SIZE,
        searchTerm: filter.searchTerm,
      };
      const res = await apiInstance.post<BaseResponse<ISessionByStatus[]>>(
        ENDPOINTS.chatService.getSessionsByTagOrStatus,
        params
      );

      //FIND NEW CONVERSATIONS
      const conversationList = useConversationStore.getState().conversationList;
      const newConversations = res?.data?.data?.filter((session) => {
        return !conversationList.some(
          (conversation) =>
            conversation.conversationID === session.conversationId
        );
      });
      if (newConversations?.length) {
        DChatSDK.getMultipleConversation(
          newConversations.map((session) => session.conversationId)
        ).then((res) => {
          useConversationStore
            .getState()
            .updateConversationList(res.data, "filter");
        });
      }
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      const pageSize = options?.pageSize || PAGE_SIZE;
      const dataLength = lastPage?.data?.length || 0;
      const currentPage = lastPage?.pageable?.pageNumber || 1;
      return dataLength < pageSize ? undefined : currentPage + 1;
    },
    enabled: hasValidFilter(filter),
  });

  const { dataFlatten } = useMemo(() => {
    if (!data) {
      return { dataFlatten: [] as ISessionByStatus[] };
    }

    const allItems = data.pages.flatMap((page) => page.data);

    // Map session theo conversationId
    const sessionMap = new Map(
      allItems.map((s) => [s.conversationId, s] as const)
    );

    const merged: ISessionByStatus[] = conversationList
      .map((conv) => {
        const session = sessionMap.get(conv.conversationID);
        if (!session) return null;
        return {
          ...session,
          conversation: conv, // gắn trực tiếp vào
        };
      })
      .filter((x): x is ISessionByStatus => Boolean(x));

    return { dataFlatten: merged };
  }, [data, conversationList]);

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    dataFlatten,
    ...rest,
  };
};

function hasValidFilter(filter: IFilterSummary): boolean {
  return Object.values(filter).some((v) => {
    if (typeof v === "string") return v.trim() !== "";
    return v !== undefined && v !== null;
  });
}

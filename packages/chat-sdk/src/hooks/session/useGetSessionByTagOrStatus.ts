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

export const useGetSessionByTagOrStatus = (filter: IFilterSummary) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    ...rest
  } = useInfiniteQuery({
    initialPageParam: 1,
    queryKey: [QUERY_KEYS.GET_SESSION_BY_TAG_OR_STATUS, filter],
    queryFn: async ({ pageParam = 1 }) => {
      const params: SessionByTagOrStatusRequest = {
        applicationType: "OBEFE",
        tag: filter.tag,
        status: filter.status,
        page: pageParam,
        pageSize: 100,
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
      const currentPage = lastPage?.pageable?.pageNumber || 1;
      const totalPages = lastPage?.pageable?.totalPages || 1;
      return currentPage + 1 < totalPages ? currentPage + 1 : undefined;
    },
    enabled: !!filter.tag || !!filter.status,
  });

  const { dataFlatten } = useMemo(() => {
    if (!data)
      return {
        dataFlatten: [],
      };

    const allItems = data.pages.flatMap((page) => page.data);

    return {
      dataFlatten: allItems,
    };
  }, [data]);

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

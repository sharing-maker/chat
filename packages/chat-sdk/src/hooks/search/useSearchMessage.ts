import { useInfiniteQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../services/query";
import { apiInstance } from "../../services/api";
import { ENDPOINTS } from "../../services/routes";
import {
  SearchMessageItem,
  SearchMessageRequest,
  SearchMessageResponse,
} from "../../types/dto";
import { useMemo } from "react";
import dayjs from "dayjs";
import useAuthStore from "../../store/auth";
import { PAGE_SIZE } from "../../constants";

interface UseSearchMessagePayload {
  payload: Pick<
    SearchMessageRequest,
    "contentType" | "pageSize" | "recvID" | "searchTerm"
  >;
  options?: { pageSize?: number };
}

export const useSearchMessage = ({
  payload,
  options,
}: UseSearchMessagePayload) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    ...rest
  } = useInfiniteQuery({
    initialPageParam: 1,
    queryKey: [QUERY_KEYS.SEARCH_MESSAGE, payload, options],
    queryFn: async ({ pageParam = 1 }) => {
      const params: SearchMessageRequest = {
        pageSize: options?.pageSize || PAGE_SIZE,
        ...payload,
        page: pageParam,
        applicationType: useAuthStore.getState().applicationType,
      };
      const res = await apiInstance.post<SearchMessageResponse>(
        ENDPOINTS.chatService.searchMessage,
        params
      );
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      const pageSize = options?.pageSize || PAGE_SIZE;
      const dataLength = lastPage?.data?.length || 0;
      const currentPage = lastPage?.pageable?.pageNumber || 1;
      return dataLength < pageSize ? undefined : currentPage + 1;
    },
    enabled: hasValidFilter(payload),
  });

  const { groupedData, dataFlatten } = useMemo(() => {
    if (!data)
      return {
        groupedData: {},
        dataFlatten: [],
      };

    const allItems = data.pages.flatMap((page) => page.data);

    const mGroupeddata = allItems.reduce<Record<string, SearchMessageItem[]>>(
      (acc, item) => {
        const dateKey = dayjs(item.chatLog.sendTime).format("YYYY-MM-DD");
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(item);
        return acc;
      },
      {}
    );
    return {
      groupedData: mGroupeddata,
      dataFlatten: allItems,
    };
  }, [data]);

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    groupedData,
    dataFlatten,
    ...rest,
  };
};

const hasValidFilter = (
  filter: UseSearchMessagePayload["payload"]
): boolean => {
  return Object.values(filter).some((v) => {
    if (typeof v === "string") return v.trim() !== "";
    return v !== undefined && v !== null;
  });
};

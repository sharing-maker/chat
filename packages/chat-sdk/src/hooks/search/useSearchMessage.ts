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

export const useSearchMessage = (
  payload: SearchMessageRequest,
  options?: { pageSize?: number }
) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    ...rest
  } = useInfiniteQuery({
    initialPageParam: 1,
    queryKey: [QUERY_KEYS.GET_IMAGE_COLLECTION, payload, options],
    queryFn: async ({ pageParam = 1 }) => {
      const params: SearchMessageRequest = {
        pageSize: options?.pageSize || 50,
        ...payload,
        page: pageParam,
      };
      const res = await apiInstance.post<SearchMessageResponse>(
        ENDPOINTS.chatService.getMediaCollection,
        params
      );
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage?.pageable?.pageNumber;
      const totalPages = lastPage?.pageable?.totalPages;
      return currentPage + 1 <= totalPages ? currentPage + 1 : undefined;
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

const hasValidFilter = (filter: SearchMessageRequest): boolean => {
  return Object.values(filter).some((v) => {
    if (typeof v === "string") return v.trim() !== "";
    return v !== undefined && v !== null;
  });
};

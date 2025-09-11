import { useInfiniteQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../services/query";
import { MessageType } from "@openim/wasm-client-sdk";
import { apiInstance } from "../../services/api";
import { ENDPOINTS } from "../../services/routes";
import {
  MediaCollectionItem,
  MediaCollectionRequest,
  MediaCollectionResponse,
} from "../../types/dto";
import { useMemo } from "react";
import dayjs from "dayjs";

export const useMediaCollection = ({
  recvID,
  contentType,
}: {
  recvID: string;
  contentType: MessageType;
}) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    ...rest
  } = useInfiniteQuery({
    initialPageParam: 1,
    queryKey: [QUERY_KEYS.GET_IMAGE_COLLECTION, recvID, contentType],
    queryFn: async ({ pageParam = 1 }) => {
      const params: MediaCollectionRequest = {
        contentType,
        recvID,
        page: pageParam,
        pageSize: 50,
      };
      const res = await apiInstance.post<MediaCollectionResponse>(
        ENDPOINTS.chatService.getMediaCollection,
        params
      );
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage?.pageable?.pageNumber;
      const totalPages = lastPage?.pageable?.totalPages;
      return currentPage + 1 < totalPages ? currentPage + 1 : undefined;
    },
    enabled: !!recvID,
  });

  const { groupedData, dataFlatten } = useMemo(() => {
    if (!data)
      return {
        groupedData: {},
        dataFlatten: [],
      };

    const allItems = data.pages.flatMap((page) => page.data);

    const mGroupeddata = allItems.reduce<Record<string, MediaCollectionItem[]>>(
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

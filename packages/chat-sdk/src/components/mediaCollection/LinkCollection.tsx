import { Empty, Spin } from "antd";
import { useTranslation } from "react-i18next";
import useConversationStore from "../../store/conversation";
import { useSearchMessage } from "../../hooks/search/useSearchMessage";
import { useCallback, useEffect, useState } from "react";
import { SearchMessageItem } from "../../types/dto";
import dayjs from "dayjs";
import InfiniteScroll from "react-infinite-scroll-component";
import { MessageType } from "@openim/wasm-client-sdk";
import { Icon } from "../icon";

const LinkPreview = ({ url }: { url: string }) => {
  const [title, setTitle] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!url) return;

    setIsLoading(true);
    fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`)
      .then((res) => res.json())
      .then((res) => {
        if (res?.data?.title) {
          setTitle(res.data.title);
        }
      })
      .catch(() => {
        setTitle("");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [url]);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col truncate text-blue-600 cursor-pointer"
      title={title || url}
    >
      {isLoading && (
        <span className="font-medium truncate text-gray-900">{url}</span>
      )}

      {!isLoading &&
        (title ? (
          <>
            <span className="font-medium truncate text-gray-900">{title}</span>
            <span className="text-sm text-gray-500 truncate">{url}</span>
          </>
        ) : (
          <span className="font-medium truncate text-gray-900">{url}</span>
        ))}
    </a>
  );
};

const LinkCollection = () => {
  const { t } = useTranslation();
  const selectedSourceId = useConversationStore(
    (state) => state.selectedSourceId
  );

  const { groupedData, fetchNextPage, hasNextPage, dataFlatten, isLoading } =
    useSearchMessage({
      payload: {
        recvID: selectedSourceId,
        contentType: MessageType.UrlTextMessage,
      },
    });

  const renderItem = useCallback((date: string, items: SearchMessageItem[]) => {
    return (
      <div key={date} className="px-3">
        <span className="text-sm font-medium text-gray-500 px-3">
          {dayjs(date).format("DD MMMM, YYYY")}
        </span>
        <div className="flex flex-col gap-1 mt-2">
          {items.map((item) => {
            const urls = JSON.parse(item?.chatLog?.content || "{}")?.urls || [];

            return (
              <div key={item.chatLog?.clientMsgID}>
                {urls.map((url: string, index: number) => (
                  <div
                    key={`${item.chatLog?.clientMsgID}-${index}`}
                    className="bg-gray-100 flex gap-2 items-center p-2 mb-1"
                  >
                    <Icon icon="link-b" size={16} className="shrink-0" />
                    <LinkPreview url={url} />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  }, []);

  if (dataFlatten.length === 0 && !isLoading)
    return <Empty description={t("no_media_files")} />;
  if (isLoading)
    return (
      <div className="flex items-center justify-center">
        <Spin />
      </div>
    );

  return (
    <div id="scrollableFileDiv" className="h-full overflow-auto">
      <InfiniteScroll
        dataLength={Object.keys(groupedData).length}
        next={fetchNextPage}
        hasMore={hasNextPage}
        loader={
          <div className="flex items-center justify-center py-2">
            <Spin />
          </div>
        }
        scrollableTarget="scrollableFileDiv"
      >
        {Object.entries(groupedData).map(([date, items]) =>
          renderItem(date, items)
        )}
      </InfiniteScroll>
    </div>
  );
};

export default LinkCollection;

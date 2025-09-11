import { FileElem, MessageType } from "@openim/wasm-client-sdk";
import { useMediaCollection } from "../../hooks/collection/useMediaCollection";
import InfiniteScroll from "react-infinite-scroll-component";
import { Empty, Spin } from "antd";
import { useCallback } from "react";
import { MediaCollectionItem } from "../../types/dto";
import dayjs from "dayjs";
import useConversationStore from "../../store/conversation";
import { useTranslation } from "react-i18next";
import { documentIcon } from "../../assets/svg";
import { shortenFileName } from "../message/footer/FilePreview";
import { renderFileSize } from "../../utils/common";

const FileCollection = () => {
  const { t } = useTranslation();
  const selectedSourceId = useConversationStore(
    (state) => state.selectedSourceId
  );
  const { groupedData, fetchNextPage, hasNextPage, dataFlatten, isLoading } =
    useMediaCollection({
      recvID: selectedSourceId,
      contentType: MessageType.FileMessage,
    });

  const handleDownload = (url: string, fileName: string) => {
    if (!url) {
      console.warn("Không có link file để tải");
      return;
    }

    const link = document.createElement("a");
    link.href = url;
    if (fileName) {
      link.setAttribute("download", fileName);
    }
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");

    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const renderItem = useCallback(
    (date: string, items: MediaCollectionItem[]) => {
      return (
        <div key={date} className="px-3">
          <span className="text-sm font-medium text-gray-500">
            {dayjs(date).format("DD MMM, YYYY")}
          </span>
          <div className="flex flex-col gap-1 mt-2">
            {items.map((item) => {
              const fileContent = JSON.parse(
                item?.chatLog?.content || "{}"
              ) as FileElem;
              return (
                <div
                  key={item.chatLog?.clientMsgID}
                  className="relative flex flex-row items-center gap-2 align-center bg-gray-100 rounded-md p-2 cursor-pointer"
                  onClick={() =>
                    handleDownload(
                      fileContent?.sourceUrl || "",
                      fileContent?.fileName || ""
                    )
                  }
                >
                  {documentIcon}
                  <div className="flex flex-col flex-1">
                    <span className="text-sm font-medium">
                      {shortenFileName(fileContent?.fileName || "", {
                        maxLength: 32,
                      })}
                    </span>
                    <span className="text-xs text-gray-500">
                      {`${renderFileSize(
                        fileContent.fileSize || 0
                      )}  -  ${dayjs(item?.chatLog?.sendTime || 0).format(
                        "HH:mm"
                      )}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    },
    []
  );
  if (dataFlatten.length === 0 && !isLoading)
    return <Empty description={t("no_media_files")} />;
  if (isLoading)
    return (
      <div className="flex items-center justify-center">
        <Spin />
      </div>
    );
  return (
    <div
      id="scrollableFileDiv"
      style={{
        height: "100%",
        overflow: "auto",
      }}
    >
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

export default FileCollection;

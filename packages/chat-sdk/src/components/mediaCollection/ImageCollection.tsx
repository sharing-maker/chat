import { MessageType, PictureElem } from "@openim/wasm-client-sdk";
import { useSearchMessage } from "../../hooks/search/useSearchMessage";
import InfiniteScroll from "react-infinite-scroll-component";
import { Button, Empty, Image, Space, Spin } from "antd";
import { useCallback } from "react";
import { SearchMessageItem } from "../../types/dto";
import dayjs from "dayjs";
import useConversationStore from "../../store/conversation";
import { images } from "../../constants/images";
import { useTranslation } from "react-i18next";
import { TOP_OFFSET } from ".";
import { DownloadOutlined } from "@ant-design/icons";

const ImageCollection = () => {
  const { t } = useTranslation();
  const selectedSourceId = useConversationStore(
    (state) => state.selectedSourceId
  );
  const { groupedData, fetchNextPage, hasNextPage, dataFlatten, isLoading } =
    useSearchMessage({
      recvID: selectedSourceId,
      contentType: MessageType.PictureMessage,
    });

  const handleDownload = (imageUrl?: string) => {
    if (!imageUrl) return;
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderItem = useCallback((date: string, items: SearchMessageItem[]) => {
    return (
      <div key={date} className="mb-2">
        <span className="text-sm font-medium text-gray-500 px-3">
          {dayjs(date).format("DD MMMM, YYYY")}
        </span>
        <div className="grid grid-cols-3 justify-start gap-px py-2">
          {items.map((item) => {
            const imageContent = JSON.parse(
              item?.chatLog?.content || "{}"
            ) as PictureElem;
            const sourceUrl =
              imageContent.sourcePicture?.url ||
              imageContent.snapshotPicture?.url;
            return (
              <div
                className="border inline-block w-full h-full aspect-square"
                key={item?.chatLog?.clientMsgID}
              >
                <Image
                  rootClassName="cursor-pointer w-full h-full"
                  className="w-full !h-full object-cover"
                  src={sourceUrl}
                  preview
                  placeholder={
                    <div className="flex items-center justify-center">
                      <Spin />
                    </div>
                  }
                  fallback={images.imageFailed}
                />
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
    <div id="scrollableImageDiv" className="h-full overflow-auto">
      <Image.PreviewGroup
        preview={{
          toolbarRender: (originalNode, info) => {
            const imageUrl = info?.image?.url;
            return (
              <div className="flex flex-col justify-center gap-2">
                {originalNode}
                {imageUrl && (
                  <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    className="self-center"
                    onClick={() => handleDownload(imageUrl)}
                  >
                    {t("download")}
                  </Button>
                )}
              </div>
            );
          },
        }}
      >
        <InfiniteScroll
          dataLength={dataFlatten.length}
          next={fetchNextPage}
          hasMore={hasNextPage}
          loader={
            <div className="flex items-center justify-center py-2">
              <Spin />
            </div>
          }
          scrollableTarget="scrollableImageDiv"
        >
          {Object.entries(groupedData).map(([date, items]) =>
            renderItem(date, items)
          )}
        </InfiniteScroll>
      </Image.PreviewGroup>
    </div>
  );
};

export default ImageCollection;

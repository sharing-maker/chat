import { MessageType, VideoElem } from "@openim/wasm-client-sdk";
import { useSearchMessage } from "../../hooks/search/useSearchMessage";
import InfiniteScroll from "react-infinite-scroll-component";
import { Carousel, Empty, Image, Modal, Spin } from "antd";
import { useCallback, useState } from "react";
import { SearchMessageItem } from "../../types/dto";
import dayjs from "dayjs";
import useConversationStore from "../../store/conversation";
import { useBoolean } from "ahooks";
import { images } from "../../constants/images";
import { Icon } from "../icon";
import { useTranslation } from "react-i18next";
import { TOP_OFFSET } from ".";

const VideoCollection = () => {
  const { t } = useTranslation();
  const selectedSourceId = useConversationStore(
    (state) => state.selectedSourceId
  );
  const { groupedData, fetchNextPage, hasNextPage, dataFlatten, isLoading } =
    useSearchMessage({
      recvID: selectedSourceId,
      contentType: MessageType.VideoMessage,
    });

  const [open, { setTrue, setFalse }] = useBoolean(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleOpenPreview = (index: number) => {
    setCurrentIndex(index);
    setTrue();
  };

  const renderItem = useCallback((date: string, items: SearchMessageItem[]) => {
    return (
      <div key={date} className="mb-2">
        <span className="text-sm font-medium text-gray-500 px-3">
          {dayjs(date).format("DD MMMM, YYYY")}
        </span>
        <div className="grid grid-cols-3 justify-start gap-px py-2">
          {items.map((item) => {
            const videoContent = JSON.parse(
              item?.chatLog?.content || "{}"
            ) as VideoElem;
            const globalIndex = dataFlatten.findIndex(
              (v) => v.chatLog?.clientMsgID === item.chatLog?.clientMsgID
            );
            return (
              <div
                className="border relative w-full h-full aspect-square cursor-pointer"
                key={item?.chatLog?.clientMsgID}
                onClick={() => handleOpenPreview(globalIndex)}
              >
                <Image
                  rootClassName="w-full h-full"
                  src={videoContent.snapshotUrl}
                  alt="video thumbnail"
                  className="w-full !h-full object-cover"
                  fallback={images.imageFailed}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 text-white text-2xl">
                  <Icon icon="play-b" size={24} color="white" />
                </div>
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
    <div id="scrollableVideoDiv" className="h-full overflow-auto">
      <InfiniteScroll
        dataLength={Object.keys(groupedData).length}
        next={fetchNextPage}
        hasMore={hasNextPage}
        loader={
          <div className="flex items-center justify-center py-2">
            <Spin />
          </div>
        }
        scrollableTarget="scrollableVideoDiv"
      >
        {Object.entries(groupedData).map(([date, items]) =>
          renderItem(date, items)
        )}
      </InfiniteScroll>
      <Modal
        open={open}
        onCancel={setFalse}
        footer={null}
        centered
        styles={{
          content: {
            padding: 0,
          },
        }}
      >
        <Carousel
          dots
          infinite={false}
          initialSlide={currentIndex}
          afterChange={(i) => setCurrentIndex(i)}
        >
          {dataFlatten.map((item, idx) => {
            const videoContent = JSON.parse(
              item?.chatLog?.content || "{}"
            ) as VideoElem;
            const sourceUrl = videoContent.videoUrl;
            return (
              <div key={idx} style={{ textAlign: "center" }}>
                <video
                  src={sourceUrl}
                  controls
                  autoPlay={idx === currentIndex}
                  style={{ width: "100%", maxHeight: "80vh" }}
                />
              </div>
            );
          })}
        </Carousel>
      </Modal>
    </div>
  );
};

export default VideoCollection;

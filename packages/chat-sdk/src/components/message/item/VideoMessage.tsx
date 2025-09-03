import { MessageItem, MessageStatus } from "@openim/wasm-client-sdk";
import { Spin } from "antd";

interface VideoMessageItemProps {
  message: MessageItem;
}

const min = (a: number, b: number) => (a > b ? b : a);

const VideoMessageItem = (props: VideoMessageItemProps) => {
  const { message } = props;
  const imageHeight = message.videoElem!.snapshotHeight;
  const imageWidth = message.videoElem!.snapshotWidth;
  const minHeight = min(200, imageWidth) * (imageHeight / imageWidth) + 2;
  const adaptedHight = min(minHeight, imageHeight) + 10;
  const adaptedWidth = min(imageWidth, 200) + 10;

  const sourceUrl = message.videoElem!.videoUrl;
  const isSending = message.status === MessageStatus.Sending;
  const minStyle = {
    minHeight: `${adaptedHight}px`,
    minWidth: `${adaptedWidth}px`,
  };

  return (
    <Spin spinning={isSending}>
      <div className="relative max-w-[200px]" style={minStyle}>
        <video className="max-w-[200px] rounded-md" src={sourceUrl} controls />
      </div>
    </Spin>
  );
};

export default VideoMessageItem;

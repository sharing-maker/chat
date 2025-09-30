import dayjs from "dayjs";
import clsx from "clsx";
import { Avatar } from "antd";
import { useChatContext } from "../../../context/ChatContext";
import {
  MessageItem as MessageItemType,
  MessageType,
} from "@openim/wasm-client-sdk";
import TextMessageItem from "./TextMessage";
import ImageMessageItem from "./ImageMessage";
import FileMessageItem from "./FileMessage";
import VideoMessageItem from "./VideoMessage";
import {
  getVisibleNeighbor,
  visibleTypeMessage,
} from "../../../hooks/message/useMessage";
import { MSG_ITEM_CONTENT_PREFIX, MSG_ITEM_PREFIX } from "../../../constants";
import { formatTimestamp } from "../../../utils/common";
import useAuthStore from "../../../store/auth";

interface MessageItemProps {
  message: MessageItemType;
  allMessages: MessageItemType[];
}

const MessageItem = ({ message, allMessages }: MessageItemProps) => {
  const { user } = useChatContext();
  const isCx = useAuthStore((state) => state.isCx);

  const isVisibleGroup = visibleTypeMessage.includes(message?.contentType);

  const renderMessageByType = (message: MessageItemType) => {
    switch (message?.contentType) {
      case MessageType.TextMessage:
        return <TextMessageItem message={message} />;
      case MessageType.PictureMessage:
        return <ImageMessageItem message={message} />;
      case MessageType.FileMessage:
        return <FileMessageItem message={message} />;
      case MessageType.VideoMessage:
        return <VideoMessageItem message={message} />;
      case MessageType.UrlTextMessage:
        return <TextMessageItem message={message} />;
      default:
        return <TextMessageItem message={message} />;
    }
  };
  if (!isVisibleGroup) return null;

  const isMine = message?.sendID === user?.userID;

  const previousMessage = getVisibleNeighbor(allMessages, message, "prev");
  const nextMessage = getVisibleNeighbor(allMessages, message, "next");
  const prevSameUser = previousMessage?.sendID === message?.sendID;
  const nextSameUser = nextMessage?.sendID === message?.sendID;

  const prevTimeBreak =
    !previousMessage ||
    !dayjs(message.sendTime).isSame(previousMessage.sendTime, "days");

  const showTimeBreak = prevTimeBreak;

  const showSenderAvatar = !nextSameUser;
  const showSenderName = !prevSameUser && !isMine;

  return (
    <div
      className="flex flex-col gap-2 py-1 px-3 sm:p x-4"
      key={message?.clientMsgID}
      id={`${MSG_ITEM_PREFIX}${message?.clientMsgID}`}
    >
      {showTimeBreak && (
        <div className="flex justify-center">
          <span className="text-xs text-gray-600 text-center bg-neutral-100 px-2 py-1 rounded-full">
            {formatTimestamp(message.sendTime, {
              dateMonthFormat: "DD MMMM",
            })}
          </span>
        </div>
      )}
      <div
        className={clsx("flex", isMine ? "justify-end" : "justify-start")}
        key={message?.clientMsgID}
      >
        <div
          className={clsx(
            "flex flex-1 items-end gap-2",
            isMine ? "justify-end" : "justify-start"
          )}
        >
          {!isMine && (
            <div className="flex items-center justify-center w-[32px] h-[32px]">
              {showSenderAvatar && (
                <Avatar src={message?.senderFaceUrl}>
                  {message?.senderNickname?.charAt?.(0) || "A"}
                </Avatar>
              )}
            </div>
          )}
          <div
            className={clsx(
              "flex flex-col flex-[0.8]",
              isMine ? "items-end" : "items-start"
            )}
          >
            {showSenderName && (
              <span className="text-xs text-gray-500 mb-1 px-3">
                {message?.senderNickname}
              </span>
            )}
            <div
              className={clsx(
                "px-3 py-2 rounded-2xl max-w-full break-words flex flex-col flex-1 text-gray-900 gap-1",
                isMine ? "bg-blue-100" : "bg-white"
              )}
              id={`${MSG_ITEM_CONTENT_PREFIX}${message?.clientMsgID}`}
            >
              {message?.contentType === MessageType.MergeMessage ? (
                <div>
                  {message?.mergeElem?.multiMessage?.map((item) => {
                    return renderMessageByType(item);
                  })}
                  {message?.textElem && <TextMessageItem message={message} />}
                </div>
              ) : (
                renderMessageByType(message)
              )}
              <span
                className={clsx(
                  "text-xs text-gray-500 text-right text-gray-500"
                )}
              >
                {dayjs(message?.sendTime).format("HH:mm")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;

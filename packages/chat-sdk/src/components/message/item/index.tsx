import { GroupMessageItem } from "../../../types/chat";
import dayjs from "dayjs";
import clsx from "clsx";
import { Avatar } from "antd";
import isToday from "dayjs/plugin/isToday";
import { useChatContext } from "../../../context/ChatContext";
import {
  MessageItem as MessageItemType,
  MessageType,
  SessionType,
} from "@openim/wasm-client-sdk";
import TextMessageItem from "./TextMessage";
import ImageMessageItem from "./ImageMessage";
import FileMessageItem from "./FileMessage";
import VideoMessageItem from "./VideoMessage";

dayjs.extend(isToday);

interface MessageItemProps {
  groupMessage: GroupMessageItem;
}

const visibleTypeMessage = [
  MessageType.TextMessage,
  MessageType.PictureMessage,
  MessageType.VoiceMessage,
  MessageType.VideoMessage,
  MessageType.FileMessage,
  MessageType.AtTextMessage,
  MessageType.MergeMessage,
  MessageType.CardMessage,
  MessageType.LocationMessage,
  MessageType.CustomMessage,
  MessageType.QuoteMessage,
  MessageType.FaceMessage,
];

const MessageItem = ({ groupMessage }: MessageItemProps) => {
  const { user } = useChatContext();

  const messagesInGroup = groupMessage?.messages || [];
  const isToday = dayjs(groupMessage?.sendTime).isToday();
  const isVisibleGroup = messagesInGroup?.some((message) =>
    visibleTypeMessage.includes(message?.contentType)
  );

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
      default:
        return <TextMessageItem message={message} />;
    }
  };
  if (!isVisibleGroup) return null;

  return (
    <div
      className="flex flex-col gap-2 my-4 mx-3 sm:mx-4"
      key={groupMessage?.groupMessageID}
    >
      <div className="flex justify-center">
        <span className="text-xs text-gray-600 text-center bg-neutral-100 px-2 py-1 rounded-full">
          {dayjs(groupMessage?.sendTime).format(
            isToday ? "HH:mm" : "HH:mm, DD MMMM"
          )}
        </span>
      </div>
      {messagesInGroup?.map((message, messageIndex) => {
        if (!visibleTypeMessage.includes(message?.contentType)) return null;
        const isMine = message?.sendID === user?.userID;
        const showAvatar = messageIndex === messagesInGroup.length - 1;
        const showSenderName =
          messageIndex === 0 && message?.sessionType === SessionType.Group;
        return (
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
                  {showAvatar && (
                    <Avatar>
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
                {!isMine && showSenderName && (
                  <span className="text-xs text-gray-500 mb-1 px-3">
                    {message?.senderNickname}
                  </span>
                )}
                <div
                  className={clsx(
                    "px-3 py-2 rounded-2xl max-w-full break-words flex flex-col flex-1 text-gray-900 gap-1",
                    isMine ? "bg-blue-100" : "bg-gray-100"
                  )}
                >
                  {message?.contentType === MessageType.MergeMessage ? (
                    <div>
                      {message?.mergeElem?.multiMessage?.map((item) => {
                        return renderMessageByType(item);
                      })}
                      {message?.textElem && (
                        <TextMessageItem message={message} />
                      )}
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
        );
      })}
    </div>
  );
};

export default MessageItem;

import { GroupMessageItem } from "../../types/chat";
import dayjs from "dayjs";
import clsx from "clsx";
import { Avatar } from "antd";
import isToday from "dayjs/plugin/isToday";
import { useChatContext } from "../../context/ChatContext";
import { SessionType } from "@openim/wasm-client-sdk";

dayjs.extend(isToday);

interface MessageItemProps {
  groupMessage: GroupMessageItem;
}
const MessageItem = ({ groupMessage }: MessageItemProps) => {
  const { user } = useChatContext();

  const messagesInGroup = groupMessage?.messages || [];
  const isToday = dayjs(groupMessage?.sendTime).isToday();
  return (
    <div
      className="flex flex-col gap-2 my-4 mx-3 sm:mx-4"
      key={groupMessage?.groupMessageID}
    >
      <div className="flex justify-center">
        <span className="text-xs text-gray-600 text-center bg-neutral-100 px-2 py-1 rounded-full">
          {dayjs(groupMessage?.sendTime).format(
            isToday ? "HH:mm" : "HH:mm, DD MM"
          )}
        </span>
      </div>
      {messagesInGroup?.map((message, messageIndex) => {
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
                "flex items-end gap-2",
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
              <div className="flex flex-col items-start flex-[0.8]">
                {!isMine && showSenderName && (
                  <span className="text-xs text-gray-500 mb-1 px-3">
                    {message?.senderNickname}
                  </span>
                )}
                <div
                  className={clsx(
                    "px-3 py-2 rounded-2xl max-w-full break-words flex flex-col text-gray-900",
                    isMine ? "bg-blue-100" : "bg-gray-100"
                  )}
                >
                  <p className="text-sm sm:text-base whitespace-pre-wrap">
                    {message?.textElem?.content || "Tin nhắn không khả dụng"}
                  </p>
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

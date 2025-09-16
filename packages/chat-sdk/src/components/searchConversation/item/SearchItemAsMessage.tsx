"use client";
import { MessageItem } from "@openim/wasm-client-sdk";
import { Avatar } from "antd";
import { formatTimestamp, highlightSearch } from "../../../utils/common";

interface SearchItemAsMessageProps {
  message: MessageItem;
  searchTerm: string;
}

const SearchItemAsMessage = (props: SearchItemAsMessageProps) => {
  const { message, searchTerm = "" } = props;

  let msgContent = "";
  try {
    msgContent = JSON.parse(message?.content || "{}")?.content || "";
  } catch (error) {
    console.error("Failed to parse message content", error);
    if (typeof message?.content === "string") {
      msgContent = message?.content;
    }
  }
  return (
    <div
      key={message.clientMsgID}
      className="py-3 px-2 flex items-center gap-3 hover:bg-gray-100 hover:rounded-sm cursor-pointer border-b mx-1"
    >
      <div>
        <Avatar
          size={"large"}
          src={message.senderFaceUrl}
          alt={message.senderNickname}
        >
          {message.senderNickname.charAt(0).toUpperCase()}
        </Avatar>
      </div>
      <div className="flex flex-col flex-1 min-w-0 gap-1">
        <div className="flex flex-1 items-center justify-between">
          <span className="text-sm flex-1 font-semibold truncate">
            {message.senderNickname}
          </span>
          <span className="text-xs text-gray-500">
            {formatTimestamp(message.sendTime)}
          </span>
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <span
            className="text-xs flex-1 text-gray-500 truncate"
            dangerouslySetInnerHTML={{
              __html: highlightSearch(msgContent, searchTerm),
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchItemAsMessage;

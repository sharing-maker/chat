"use client";
import { MessageItem, SessionType } from "@openim/wasm-client-sdk";
import { Avatar } from "antd";
import { formatTimestamp, highlightSearch } from "../../../utils/common";
import { DChatSDK } from "../../../constants/sdk";
import { useChatContext } from "../../../context/ChatContext";
import { message as antdMessage } from "antd";
import { useTranslation } from "react-i18next";
import useConversationStore from "../../../store/conversation";

interface SearchItemAsMessageProps {
  message: MessageItem;
  searchTerm: string;
}

const SearchItemAsMessage = (props: SearchItemAsMessageProps) => {
  const { t } = useTranslation();
  const { message, searchTerm = "" } = props;
  const { user } = useChatContext();

  const onPressItem = async () => {
    const { data } = await DChatSDK.getOneConversation({
      sourceID:
        message.sessionType === SessionType.Group
          ? message.groupID
          : user?.userID !== message.sendID
          ? message.sendID
          : message.recvID,
      sessionType: message.sessionType,
    });
    if (!data) {
      return antdMessage.error(t("err_get_conversation"));
    }
    useConversationStore
      .getState()
      .setConversationData(data, message.clientMsgID);
    useConversationStore
      .getState()
      .setSelectedConversationId(data.conversationID);
  };

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
      onClick={onPressItem}
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

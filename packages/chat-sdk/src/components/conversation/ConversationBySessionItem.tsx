"use client";
import { ConversationItem, MessageType } from "@openim/wasm-client-sdk";
import { useTranslation } from "react-i18next";
import { ISessionByStatus } from "../../store/type";
import useConversationStore from "../../store/conversation";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Avatar, Badge } from "antd";
import { Icon } from "../icon";
import { useChatContext } from "../../context/ChatContext";
import { useConversationDisplayData } from "../../hooks/conversation/useConversation";

interface ConversationBySessionItemProps {
  sessionItem: ISessionByStatus;
}

const ConversationBySessionItem = ({
  sessionItem,
}: ConversationBySessionItemProps) => {
  const { t } = useTranslation();
  const { user } = useChatContext();
  const conversation = useConversationStore((state) =>
    state.conversationList.find(
      (conv) => conv.conversationID === sessionItem.conversationId
    )
  );
  const isSelected = useConversationStore(
    (state) => state.selectedConversationId === sessionItem.conversationId
  );

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const setConversationData = useConversationStore(
    (state) => state.setConversationData
  );
  const setSelectedConversationId = useConversationStore(
    (state) => state.setSelectedConversationId
  );

  const handleConversationClick = (conversation: ConversationItem) => {
    setConversationData(conversation);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("threadId", conversation.conversationID);
    router.push(`${pathname}?${newSearchParams.toString()}`);

    setSelectedConversationId(conversation.conversationID);
  };

  if (!conversation) return null;
  const { avatar, displayName = "" } = useConversationDisplayData(conversation);

  return (
    <div
      key={conversation.conversationID}
      onClick={() => handleConversationClick(conversation)}
      className={`relative p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
        isSelected ? "bg-blue-50" : "bg-white"
      }`}
    >
      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
      )}

      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {/* TODO: add status */}
          <Badge dot={true} status={"success"} offset={[-2, 36]}>
            <Avatar size={48} src={avatar} alt={displayName}>
              {displayName.charAt(0).toUpperCase()}
            </Avatar>
          </Badge>
        </div>

        {/* Conversation Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm truncate">
                {displayName}
              </h3>
              <p className="text-xs text-gray-500 truncate mt-0.5">
                {parseLatestMessage(conversation.latestMsg, user?.userID)}
              </p>
            </div>

            <div className="flex flex-col items-end gap-1 ml-2">
              {/* Timestamp */}
              <span className="text-xs text-gray-400">
                {formatTimestamp(conversation.latestMsgSendTime)}
              </span>

              {/* Unread count only */}
              <div className="flex items-center gap-1">
                {conversation.unreadCount > 0 && (
                  <Badge count={conversation.unreadCount} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationBySessionItem;

const parseLatestMessage = (
  latestMsg: string,
  currentUserId?: string
): string => {
  if (!latestMsg) return "";

  try {
    const msgData = JSON.parse(latestMsg);
    const contentType = msgData?.contentType;
    const isMe = currentUserId && msgData.sendID === currentUserId;
    const sender = isMe ? "Me" : msgData?.senderNickname || msgData.sendID;

    switch (contentType) {
      case MessageType.TextMessage:
        if (msgData.textElem?.content) {
          return `${sender}: ${msgData.textElem.content}`;
        }
        break;
      case MessageType.PictureMessage:
        return (
          <span>
            {sender}: <Icon icon="image-o" size={16} className="mr-1" />
            Hình ảnh
          </span>
        ) as any;
      case MessageType.VoiceMessage:
        return `${sender}: [Tin nhắn thoại]`;
      case MessageType.VideoMessage:
        return `${sender}: [Video]`;
      case MessageType.FileMessage:
        return `${sender}: [File đính kèm]`;
      default:
        return "Tin nhắn không khả dụng";
    }
    return "Tin nhắn không khả dụng";
  } catch (error) {
    console.error("Error parsing latest message:", error);
    return "";
  }
};

const formatTimestamp = (timestamp: number): string => {
  if (!timestamp) return "";

  const date = new Date(timestamp);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    // Today - show time
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } else if (diffInDays === 1) {
    // Yesterday
    return "Hôm qua";
  } else if (diffInDays < 7) {
    // This week - show day name
    return date.toLocaleDateString("vi-VN", { weekday: "long" });
  } else {
    // Older - show date
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    });
  }
};

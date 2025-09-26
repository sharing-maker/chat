"use client";
import { ConversationItem } from "@openim/wasm-client-sdk";
import { useTranslation } from "react-i18next";
import { ISessionByStatus } from "../../store/type";
import useConversationStore from "../../store/conversation";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Avatar, Badge } from "antd";
import { useChatContext } from "../../context/ChatContext";
import { useConversationDisplayData } from "../../hooks/conversation/useConversation";
import { formatTimestamp, parseLatestMessage } from "../../utils/common";

interface ConversationBySessionItemProps {
  sessionItem: ISessionByStatus;
}

const ConversationBySessionItem = ({
  sessionItem,
}: ConversationBySessionItemProps) => {
  const { t } = useTranslation();
  const { user } = useChatContext();
  const isSelected = useConversationStore(
    (state) =>
      state.selectedConversationId === sessionItem?.conversation?.conversationID
  );

  const conversation = sessionItem?.conversation;

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
  const { avatar, displayName = "" } = useConversationDisplayData(
    conversation || null
  );

  if (!conversation) return null;

  return (
    <div
      key={conversation.conversationID}
      onClick={() => handleConversationClick(conversation)}
      className={`relative p-3 border-b border-gray-100 hover:bg-gray-100 cursor-pointer transition-colors ${
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
            <Avatar size={48} src={avatar}>
              {displayName?.charAt?.(0) || "A"}
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
                {formatTimestamp(conversation.latestMsgSendTime, {
                  hasTime: false,
                })}
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

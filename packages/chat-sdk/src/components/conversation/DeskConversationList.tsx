"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Input, Avatar, Badge, Empty } from "antd";
import { ConversationItem } from "@openim/wasm-client-sdk";
import { Icon } from "../icon";
import { useChatContext } from "../../context/ChatContext";
import useConversationStore from "../../store/conversation";

interface DChatConversationItem extends ConversationItem {
  lastMessage: string;
  timestamp: string;
}

const parseLatestMessage = (
  latestMsg: string,
  currentUserId?: string
): string => {
  if (!latestMsg) return "";

  try {
    const msgData = JSON.parse(latestMsg);

    // Check for text message (textElem)
    if (msgData.textElem?.content) {
      const isMe = currentUserId && msgData.sendID === currentUserId;
      const sender = isMe ? "Me" : msgData?.senderNickname || msgData.sendID;
      return `${sender}: ${msgData.textElem.content}`;
    }

    // TODO: Handle other message types (fileElem, videoElem, etc.)
    // For now, return empty string for non-text messages
    // This can be enhanced later to show appropriate previews

    return "Tin nhắn không khả dụng";
  } catch (error) {
    console.error("Error parsing latest message:", error);
    return "";
  }
};

// Utility function to format timestamp
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

// Transform API data to UI-friendly format
const transformConversationData = (
  apiData: ConversationItem[],
  currentUserId?: string
): DChatConversationItem[] => {
  return apiData.map((conv) => ({
    ...conv,
    id: conv.conversationID,
    threadId: conv.conversationID,
    name: conv.showName || "Unknown User",
    username: conv.userID || conv.groupID || "",
    avatar: conv.faceURL || "",
    lastMessage: parseLatestMessage(conv.latestMsg, currentUserId),
    timestamp: formatTimestamp(conv.latestMsgSendTime),
    unreadCount: conv.unreadCount,
  }));
};

interface DeskConversationListProps {
  onConversationSelect?: (conversationId: string, threadId: string) => void;
  className?: string;
}

const DeskConversationList = ({
  onConversationSelect,
  className = "",
}: DeskConversationListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useChatContext();
  const setConversationData = useConversationStore(
    (state) => state.setConversationData
  );
  const selectedConversationId = useConversationStore(
    (state) => state.selectedConversationId
  );
  const setSelectedConversationId = useConversationStore(
    (state) => state.setSelectedConversationId
  );

  const conversationList = useConversationStore(
    (state) => state.conversationList
  );

  console.log({ conversationList });
  // Transform real conversation data from the API
  const conversations = transformConversationData(
    conversationList || [],
    user?.userID
  );

  const handleConversationClick = (conversation: ConversationItem) => {
    setConversationData(conversation);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("threadId", conversation.conversationID);
    router.push(`${pathname}?${newSearchParams.toString()}`);

    setSelectedConversationId(conversation.conversationID);

    onConversationSelect?.(
      conversation.conversationID,
      conversation.conversationID
    );
  };

  useEffect(() => {
    const threadId = searchParams.get("threadId");
    if (threadId) {
      setSelectedConversationId(threadId);
      const selectedConversation = conversations.find(
        (conv: ConversationItem) => conv.conversationID === threadId
      );
      if (selectedConversation) {
        setConversationData(selectedConversation);
      }
    } else if (conversations.length > 0) {
      setSelectedConversationId(conversations[0].conversationID);
      setConversationData(conversations[0]);
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("threadId", conversations[0].conversationID);
      router.replace(`${pathname}?${newSearchParams.toString()}`);
    }
  }, [searchParams, conversations.length]);

  return (
    <div
      className={`flex flex-col h-full bg-white border-r border-gray-200 w-[320px] ${className}`}
    >
      <div className="p-3 border-b border-gray-200">
        <Input
          placeholder="Tìm kiếm"
          prefix={<Icon icon="search-o" size={18} className="text-gray-400" />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="rounded-lg"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation: DChatConversationItem) => (
          <div
            key={conversation.conversationID}
            onClick={() => handleConversationClick(conversation)}
            className={`relative p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
              selectedConversationId === conversation.conversationID
                ? "bg-blue-50"
                : "bg-white"
            }`}
          >
            {/* Selected indicator */}
            {selectedConversationId === conversation.conversationID && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
            )}

            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                {/* TODO: add status */}
                <Badge dot={true} status={"success"} offset={[-2, 36]}>
                  <Avatar
                    size={48}
                    src={conversation.faceURL}
                    alt={conversation.showName}
                  >
                    {conversation.showName.charAt(0).toUpperCase()}
                  </Avatar>
                </Badge>
              </div>

              {/* Conversation Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">
                      {conversation.showName}
                    </h3>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {conversation.lastMessage}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1 ml-2">
                    {/* Timestamp */}
                    <span className="text-xs text-gray-400">
                      {conversation.timestamp}
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
        ))}

        {/* Empty state */}
        {conversations.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <Empty
              image={
                <Icon
                  icon="chat-square-b"
                  size={48}
                  className="text-gray-300"
                />
              }
              description={
                <div>
                  <p className="text-lg font-medium mb-2 text-gray-500">
                    Không tìm thấy cuộc trò chuyện
                  </p>
                  <p className="text-sm text-gray-400">
                    {searchQuery
                      ? "Thử tìm kiếm với từ khóa khác"
                      : "Chưa có cuộc trò chuyện nào"}
                  </p>
                </div>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DeskConversationList;

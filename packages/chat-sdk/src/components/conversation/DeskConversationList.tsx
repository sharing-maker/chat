"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Input, Empty } from "antd";
import { ConversationItem, MessageType } from "@openim/wasm-client-sdk";
import { Icon } from "../icon";
import { useChatContext } from "../../context/ChatContext";
import useConversationStore from "../../store/conversation";
import { DChatConversationItem } from "./type";
import ConversationItemList from "./ConversationItemList";
import { DChatSDK } from "../../constants/sdk";

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
            {sender}: <Icon icon="image-b" size={16} className="mr-1" />
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

const DeskConversationList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [conversationIdFromSession, setConversationIdFromSession] = useState<
    string[]
  >([]);
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
  const assignedSessionList = useConversationStore(
    (state) => state.assignedSessionList
  );

  // Transform real conversation data from the API
  const conversations = useMemo(() => {
    const filteredConversation = conversationList.filter((conv) =>
      conversationIdFromSession.includes(conv.conversationID)
    );
    return transformConversationData(filteredConversation || [], user?.userID);
  }, [conversationList, conversationIdFromSession, user?.userID]);

  useEffect(() => {
    const conversationIds = assignedSessionList.map(
      (session) => session.conversationId
    );

    DChatSDK.getMultipleConversation(conversationIds).then(({ data }) => {
      const extractConversationIDs = data.map((conv) => conv.conversationID);
      setConversationIdFromSession(extractConversationIDs);
    });
  }, [assignedSessionList]);

  console.log({ assignedSessionList });

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
      className={`flex flex-col h-full bg-white border-r border-gray-200 w-[320px]`}
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
          <ConversationItemList
            key={conversation.conversationID}
            conversation={conversation}
            isSelected={selectedConversationId === conversation.conversationID}
          />
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

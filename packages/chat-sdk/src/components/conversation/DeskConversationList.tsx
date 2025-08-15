"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useConversationList } from "../../hooks/conversation/useConversation";
import { Icon } from "../icon";

interface DeskConversationItem {
  id: string;
  threadId: string;
  name: string;
  username: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
  status:
    | "unassigned"
    | "slow"
    | "waiting"
    | "not_replied"
    | "processing"
    | "paused"
    | "closed";
  source: string;
}

const mockConversations: DeskConversationItem[] = [
  {
    id: "1",
    threadId: "thread_001",
    name: "Phương Huyền (phhuyen2110)",
    username: "phhuyen2110",
    avatar:
      "https://i.pinimg.com/736x/55/e5/ed/55e5edbb1a5b5f6e4f3cefc98de629ca.jpg",
    lastMessage: "Customer: hi Livechat Obefe",
    timestamp: "27/07",
    unreadCount: 1,
    isOnline: true,
    status: "unassigned",
    source: "obefe",
  },
  {
    id: "2",
    threadId: "thread_002",
    name: "Phương Huyền (phhuyen2110)",
    username: "phhuyen2110",
    avatar:
      "https://i.pinimg.com/736x/55/e5/ed/55e5edbb1a5b5f6e4f3cefc98de629ca.jpg",
    lastMessage: "Customer: hi Livechat Obefe",
    timestamp: "27/07",
    unreadCount: 1,
    isOnline: true,
    status: "slow",
    source: "obefe",
  },
  {
    id: "3",
    threadId: "thread_003",
    name: "Phương Huyền (phhuyen2110)",
    username: "phhuyen2110",
    avatar:
      "https://i.pinimg.com/736x/55/e5/ed/55e5edbb1a5b5f6e4f3cefc98de629ca.jpg",
    lastMessage: "Customer: hi Livechat Obefe",
    timestamp: "27/07",
    unreadCount: 1,
    isOnline: true,
    status: "waiting",
    source: "obefe",
  },
  {
    id: "4",
    threadId: "thread_004",
    name: "Phương Huyền (phhuyen2110)",
    username: "phhuyen2110",
    avatar:
      "https://i.pinimg.com/736x/55/e5/ed/55e5edbb1a5b5f6e4f3cefc98de629ca.jpg",
    lastMessage: "Customer: hi Livechat Obefe",
    timestamp: "27/07",
    unreadCount: 1,
    isOnline: true,
    status: "not_replied",
    source: "obefe",
  },
  {
    id: "5",
    threadId: "thread_005",
    name: "Phương Huyền (phhuyen2110)",
    username: "phhuyen2110",
    avatar:
      "https://i.pinimg.com/736x/55/e5/ed/55e5edbb1a5b5f6e4f3cefc98de629ca.jpg",
    lastMessage: "Customer: hi Livechat Obefe",
    timestamp: "27/07",
    unreadCount: 1,
    isOnline: true,
    status: "processing",
    source: "obefe",
  },
  {
    id: "6",
    threadId: "thread_006",
    name: "Phương Huyền (phhuyen2110)",
    username: "phhuyen2110",
    avatar:
      "https://i.pinimg.com/736x/55/e5/ed/55e5edbb1a5b5f6e4f3cefc98de629ca.jpg",
    lastMessage: "Customer: hi Livechat Obefe",
    timestamp: "27/07",
    unreadCount: 1,
    isOnline: true,
    status: "closed",
    source: "obefe",
  },
];

interface DeskConversationListProps {
  onConversationSelect?: (conversationId: string, threadId: string) => void;
  selectedConversationId?: string;
  className?: string;
}

const getStatusIcon = (status: DeskConversationItem["status"]) => {
  switch (status) {
    case "unassigned":
      return {
        icon: "user-del-o",
        bgColor: "bg-red-100",
        iconColor: "text-red-500",
      };
    case "slow":
      return {
        icon: "warning-square-o",
        bgColor: "bg-orange-100",
        iconColor: "text-orange-500",
      };
    case "waiting":
      return {
        icon: "time-circle-o",
        bgColor: "bg-yellow-100",
        iconColor: "text-yellow-600",
      };
    case "not_replied":
      return {
        icon: "arrow-reply-o",
        bgColor: "bg-orange-100",
        iconColor: "text-orange-500",
      };
    case "processing":
      return {
        icon: "play-b",
        bgColor: "bg-blue-100",
        iconColor: "text-blue-500",
      };
    case "paused":
      return {
        icon: "pause-b",
        bgColor: "bg-gray-100",
        iconColor: "text-gray-500",
      };
    case "closed":
      return {
        icon: "check-b",
        bgColor: "bg-green-100",
        iconColor: "text-green-500",
      };
    default:
      return null;
  }
};

const DeskConversationList = ({
  onConversationSelect,
  selectedConversationId,
  className = "",
}: DeskConversationListProps) => {
  const { conversationList } = useConversationList();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  console.log(conversationList);

  const currentThreadId = searchParams.get("threadId");
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(
    currentThreadId
  );

  useEffect(() => {
    setSelectedThreadId(currentThreadId);
  }, [currentThreadId]);

  const conversations = mockConversations;

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConversationClick = (conversation: DeskConversationItem) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("threadId", conversation.threadId);

    router.push(`${pathname}?${newSearchParams.toString()}`);

    setSelectedThreadId(conversation.threadId);

    onConversationSelect?.(conversation.id, conversation.threadId);
  };

  return (
    <div
      className={`flex flex-col h-full bg-white border-r border-gray-200 ${className}`}
    >
      <div className="p-3 border-b border-gray-200">
        <div className="relative">
          <Icon
            icon="search-o"
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Tìm kiếm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredConversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => handleConversationClick(conversation)}
            className={`relative p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
              selectedThreadId === conversation.threadId
                ? "bg-blue-50"
                : "bg-white"
            }`}
          >
            {/* Selected indicator */}
            {selectedThreadId === conversation.threadId && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
            )}

            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <img
                  src={conversation.avatar}
                  alt={conversation.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {/* Online status */}
                {conversation.isOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>

              {/* Conversation Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">
                      {conversation.name}
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

                    {/* Icons row */}
                    <div className="flex items-center gap-1">
                      {/* Unread count */}
                      {conversation.unreadCount > 0 && (
                        <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-red-500 rounded-full">
                          {conversation.unreadCount}
                        </span>
                      )}

                      {/* Status icon */}
                      {(() => {
                        const statusIcon = getStatusIcon(conversation.status);
                        if (!statusIcon) return null;

                        return (
                          <div
                            className={`w-5 h-5 ${statusIcon.bgColor} rounded-full flex items-center justify-center`}
                          >
                            <Icon
                              icon={statusIcon.icon as any}
                              size={12}
                              className={statusIcon.iconColor}
                            />
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Empty state */}
        {filteredConversations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <Icon
              icon="chat-square-b"
              size={48}
              className="text-gray-300 mb-4"
            />
            <p className="text-lg font-medium mb-2">
              Không tìm thấy cuộc trò chuyện
            </p>
            <p className="text-sm text-center">
              {searchQuery
                ? "Thử tìm kiếm với từ khóa khác"
                : "Chưa có cuộc trò chuyện nào"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeskConversationList;

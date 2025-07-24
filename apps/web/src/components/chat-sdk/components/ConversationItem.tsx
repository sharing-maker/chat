"use client"
import type { Conversation } from "../types"
import { formatDistanceToNow } from "date-fns"

interface ConversationItemProps {
  conversation: Conversation
  onClick: () => void
}

export function ConversationItem({ conversation, onClick }: ConversationItemProps) {
  const otherParticipants = conversation.participants.filter((p) => p.id !== "user-1")
  const displayName = otherParticipants.length > 0 ? otherParticipants[0].name : conversation.title

  return (
    <div
      onClick={onClick}
      className="flex items-center p-3 hover:bg-gray-50 cursor-pointer rounded-lg transition-colors"
    >
      <div className="flex-shrink-0 w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
        {otherParticipants[0]?.avatar ? (
          <img
            src={otherParticipants[0].avatar || "/placeholder.svg"}
            alt={displayName}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <span className="text-sm font-medium text-gray-600">{displayName.charAt(0).toUpperCase()}</span>
        )}
      </div>

      <div className="ml-3 flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
          {conversation.lastMessage && (
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(conversation.lastMessage.timestamp, { addSuffix: true })}
            </p>
          )}
        </div>

        {conversation.lastMessage && (
          <p className="text-sm text-gray-500 truncate">{conversation.lastMessage.content}</p>
        )}

        <div className="flex items-center justify-between mt-1">
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              conversation.type === "support"
                ? "bg-blue-100 text-blue-800"
                : conversation.type === "sales"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
            }`}
          >
            {conversation.type}
          </span>

          {conversation.unreadCount > 0 && (
            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
              {conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

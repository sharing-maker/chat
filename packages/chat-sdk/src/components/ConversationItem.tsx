"use client"
import type { Conversation } from "../types"
import { useChatContext } from "../context/ChatContext"

interface ConversationItemProps {
  conversation: Conversation
  isSelected?: boolean
  onClick?: () => void
}

export function ConversationItem({ conversation, isSelected, onClick }: ConversationItemProps) {
  const context = useChatContext()
  const user = context?.user

  // Get the other participant (not the current user)
  const otherParticipant = conversation.participants.find((p) => p.id !== user?.userID)

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (days === 1) {
      return "Yesterday"
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: "short" })
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }

  return (
    <div
      className={`flex items-center p-3 sm:p-4 cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors ${
        isSelected ? "bg-blue-50 border-r-2 border-blue-500" : ""
      }`}
      onClick={onClick}
    >
      <div className="relative flex-shrink-0">
        <img
          src={otherParticipant?.avatar || "/placeholder.svg?height=48&width=48&query=user"}
          alt={otherParticipant?.name || "User"}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
        />
        {otherParticipant?.status === "online" && (
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-white"></div>
        )}
      </div>

      <div className="ml-3 flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate pr-2">
            {otherParticipant?.name || "Unknown User"}
          </h3>
          {conversation.lastMessage && (
            <span className="text-xs text-gray-500 flex-shrink-0">
              {formatTime(conversation.lastMessage.timestamp)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs sm:text-sm text-gray-600 truncate pr-2">
            {conversation.lastMessage?.content || "No messages yet"}
          </p>
          {conversation.unreadCount > 0 && (
            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-500 rounded-full flex-shrink-0 min-w-[20px] h-5">
              {conversation.unreadCount > 99 ? "99+" : conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

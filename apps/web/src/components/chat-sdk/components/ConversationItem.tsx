"use client"
import type { Conversation } from "../types"

interface ConversationItemProps {
  conversation: Conversation
  isActive: boolean
  onClick: () => void
}

export default function ConversationItem({ conversation, isActive, onClick }: ConversationItemProps) {
  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))

    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60))
      return minutes < 1 ? "now" : `${minutes}m`
    } else if (hours < 24) {
      return `${hours}h`
    } else {
      const days = Math.floor(hours / 24)
      return `${days}d`
    }
  }

  return (
    <div
      onClick={onClick}
      className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
        isActive ? "bg-blue-50" : "hover:bg-gray-50"
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className="relative">
          <img
            src={conversation.participants[0]?.avatar || "/placeholder-user.jpg"}
            alt={conversation.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          {conversation.unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {conversation.unreadCount}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900 truncate">{conversation.name}</h3>
            <span className="text-xs text-gray-500">{formatTime(conversation.timestamp)}</span>
          </div>
          <p className="text-sm text-gray-600 truncate mt-1">{conversation.lastMessage}</p>
        </div>
      </div>
    </div>
  )
}

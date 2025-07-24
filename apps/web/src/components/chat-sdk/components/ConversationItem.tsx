"use client"

import type { Conversation } from "../types"

interface ConversationItemProps {
  conversation: Conversation
  isSelected: boolean
  onClick: () => void
}

export default function ConversationItem({ conversation, isSelected, onClick }: ConversationItemProps) {
  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "now"
    if (minutes < 60) return `${minutes}m`
    if (hours < 24) return `${hours}h`
    return `${days}d`
  }

  return (
    <div
      className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${
        isSelected ? "bg-blue-50" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex-shrink-0 mr-3">
        <img
          src={conversation.participants[0]?.avatar || "/placeholder.svg?height=40&width=40"}
          alt={conversation.name}
          className="w-10 h-10 rounded-full"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900 truncate">{conversation.name}</h3>
          <span className="text-xs text-gray-500">{formatTime(conversation.timestamp)}</span>
        </div>
        <p className="text-sm text-gray-600 truncate mt-1">{conversation.lastMessage}</p>
      </div>
      {conversation.unreadCount > 0 && (
        <div className="flex-shrink-0 ml-2">
          <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-600 rounded-full">
            {conversation.unreadCount}
          </span>
        </div>
      )}
    </div>
  )
}

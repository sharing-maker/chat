"use client"

import { formatDistanceToNow } from "date-fns"
import type { Conversation } from "../types"

interface ConversationItemProps {
  conversation: Conversation
  isActive?: boolean
  onClick?: () => void
  className?: string
}

export function ConversationItem({ conversation, isActive = false, onClick, className = "" }: ConversationItemProps) {
  const participant = conversation.participants[0] // Assuming direct chat for now

  return (
    <div
      onClick={onClick}
      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
        isActive ? "bg-blue-50 border-blue-200" : ""
      } ${className}`}
    >
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600">
            {participant?.avatar ? (
              <img
                src={participant.avatar || "/placeholder.svg"}
                alt={participant.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              participant?.name.charAt(0).toUpperCase()
            )}
          </div>
          {participant?.isOnline && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 truncate">{conversation.title || participant?.name}</h3>
            {conversation.lastMessage && (
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(conversation.lastMessage.timestamp), { addSuffix: true })}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between mt-1">
            <p className="text-sm text-gray-600 truncate">{conversation.lastMessage?.content || "No messages yet"}</p>
            {conversation.unreadCount > 0 && (
              <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-500 rounded-full">
                {conversation.unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

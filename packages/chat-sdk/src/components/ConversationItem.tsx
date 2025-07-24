"use client"
import type { Conversation } from "../types"
import { useChatContext } from "../context/ChatContext"

interface ConversationItemProps {
  conversation: Conversation
  isActive: boolean
}

export function ConversationItem({ conversation, isActive }: ConversationItemProps) {
  const { setActiveConversation } = useChatContext()

  return (
    <button
      onClick={() => setActiveConversation(conversation.id)}
      className={`w-full p-4 text-left hover:bg-gray-100 transition-colors ${
        isActive ? "bg-blue-50 border-r-2 border-blue-600" : ""
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-gray-700">{conversation.name.charAt(0)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{conversation.name}</p>
          {conversation.lastMessage && (
            <p className="text-xs text-gray-500 truncate">{conversation.lastMessage.content}</p>
          )}
        </div>
        {conversation.unreadCount > 0 && (
          <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
            {conversation.unreadCount}
          </span>
        )}
      </div>
    </button>
  )
}

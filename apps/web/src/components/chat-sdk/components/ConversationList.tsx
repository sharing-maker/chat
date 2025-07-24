"use client"
import { ConversationItem } from "./ConversationItem"
import { useChatContext } from "../context/ChatContext"

interface ConversationListProps {
  onConversationSelect?: (conversationId: string) => void
  selectedConversationId?: string
  className?: string
}

export function ConversationList({
  onConversationSelect,
  selectedConversationId,
  className = "",
}: ConversationListProps) {
  const { state } = useChatContext()
  const conversations = state.conversations || []
  const isLoading = false

  if (isLoading) {
    return (
      <div className={`flex flex-col space-y-2 p-3 sm:p-4 ${className}`}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-center space-x-3 p-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={`flex flex-col ${className}`}>
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          isSelected={selectedConversationId === conversation.id}
          onClick={() => onConversationSelect?.(conversation.id)}
        />
      ))}
    </div>
  )
}

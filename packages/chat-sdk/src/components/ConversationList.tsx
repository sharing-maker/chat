"use client"

import { useChatContext } from "../context/ChatContext"
import { ConversationItem } from "./ConversationItem"

interface ConversationListProps {
  className?: string
}

export function ConversationList({ className = "" }: ConversationListProps) {
  const { conversations, activeConversation, setActiveConversation } = useChatContext()

  return (
    <div className={`bg-white border-r border-gray-200 ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
      </div>

      <div className="overflow-y-auto">
        {conversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            isActive={conversation.id === activeConversation}
            onClick={() => setActiveConversation(conversation.id)}
          />
        ))}
      </div>
    </div>
  )
}

"use client"
import type { Conversation } from "../types"
import { ConversationItem } from "./ConversationItem"

interface ConversationListProps {
  conversations: Conversation[]
  onSelectConversation: (conversationId: string) => void
}

export function ConversationList({ conversations, onSelectConversation }: ConversationListProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {conversations.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>No conversations yet</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {conversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                onClick={() => onSelectConversation(conversation.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

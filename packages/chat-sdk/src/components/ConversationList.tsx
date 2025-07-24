"use client"
import { useChatContext } from "../context/ChatContext"
import { ConversationItem } from "./ConversationItem"

export function ConversationList() {
  const { state } = useChatContext()

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {state.conversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            isActive={conversation.id === state.activeConversationId}
          />
        ))}
      </div>
    </div>
  )
}

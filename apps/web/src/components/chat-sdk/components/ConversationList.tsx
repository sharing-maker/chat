"use client"

import { useChatContext } from "../context/ChatContext"
import ConversationItem from "./ConversationItem"

interface ConversationListProps {
  onSelectConversation: () => void
}

export default function ConversationList({ onSelectConversation }: ConversationListProps) {
  const { state, dispatch } = useChatContext()

  const handleSelectConversation = (conversationId: string) => {
    dispatch({ type: "SET_CURRENT_CONVERSATION", payload: conversationId })
    onSelectConversation()
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {state.conversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          isSelected={conversation.id === state.currentConversationId}
          onClick={() => handleSelectConversation(conversation.id)}
        />
      ))}
    </div>
  )
}

"use client"
import { useChatContext } from "../context/ChatContext"
import ConversationItem from "./ConversationItem"

interface ConversationListProps {
  onConversationSelect: (conversationId: string) => void
}

export default function ConversationList({ onConversationSelect }: ConversationListProps) {
  const { state, dispatch } = useChatContext()

  const handleConversationClick = (conversationId: string) => {
    dispatch({ type: "SET_CURRENT_CONVERSATION", payload: conversationId })
    onConversationSelect(conversationId)
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {state.conversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          isActive={conversation.id === state.currentConversationId}
          onClick={() => handleConversationClick(conversation.id)}
        />
      ))}
    </div>
  )
}

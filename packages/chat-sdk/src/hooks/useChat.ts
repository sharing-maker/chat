"use client"

import { useCallback } from "react"
import { useChatContext } from "../context/ChatContext"

export function useChat() {
  const { state, sendMessage, setActiveConversation } = useChatContext()

  const sendTextMessage = useCallback(
    (content: string) => {
      sendMessage(content)
    },
    [sendMessage],
  )

  const switchConversation = useCallback(
    (conversationId: string) => {
      setActiveConversation(conversationId)
    },
    [setActiveConversation],
  )

  return {
    currentUser: state.currentUser,
    conversations: state.conversations,
    activeConversationId: state.activeConversationId,
    messages: state.messages,
    isConnected: state.isConnected,
    sendTextMessage,
    switchConversation,
  }
}

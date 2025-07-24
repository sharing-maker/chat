"use client"

import { useMemo } from "react"
import { useChatContext } from "../context/ChatContext"

export function useMessages(conversationId?: string) {
  const { state } = useChatContext()

  const targetConversationId = conversationId || state.activeConversationId

  const messages = useMemo(() => {
    if (!targetConversationId) return []
    return state.messages[targetConversationId] || []
  }, [state.messages, targetConversationId])

  const unreadCount = useMemo(() => {
    return messages.filter((message) => !message.isRead).length
  }, [messages])

  return {
    messages,
    unreadCount,
    conversationId: targetConversationId,
  }
}

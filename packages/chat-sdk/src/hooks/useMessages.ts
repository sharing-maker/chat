"use client"

import { useMemo } from "react"
import { useChatContext } from "../context/ChatContext"

export function useMessages(conversationId?: string) {
  const { messages } = useChatContext()

  const filteredMessages = useMemo(() => {
    if (!conversationId) return messages
    return messages.filter(
      (message) =>
        // For now, we'll show all messages since we don't have conversation filtering
        // In a real implementation, you'd filter by conversation
        true,
    )
  }, [messages, conversationId])

  return {
    messages: filteredMessages,
  }
}

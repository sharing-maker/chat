"use client"

import { useCallback } from "react"
import { useChatContext } from "../context/ChatContext"

export function useTyping(conversationId: string) {
  const { state } = useChatContext()

  const startTyping = useCallback(() => {
    // Demo implementation - no actual typing functionality
  }, [])

  const stopTyping = useCallback(() => {
    // Demo implementation - no actual typing functionality
  }, [])

  const typingUsers = state.typingStatuses
    .filter((t) => t.conversationId === conversationId && t.userId !== state.config?.userId && t.isTyping)
    .map((t) => state.users[t.userId])
    .filter(Boolean)

  return {
    startTyping,
    stopTyping,
    typingUsers,
    isTyping: typingUsers.length > 0,
  }
}

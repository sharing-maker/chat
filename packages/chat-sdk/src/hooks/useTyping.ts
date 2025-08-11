"use client"

import { useCallback, useEffect, useRef } from "react"
import { useChatContext } from "../context/ChatContextOld"
import { useSocket } from "./useSocket"

export function useTyping(conversationId: string) {
  const { state } = useChatContext()
  const { sendMessage } = useSocket()
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  const startTyping = useCallback(() => {
    if (!state.config?.userId || !conversationId) return

    sendMessage({
      type: "typing",
      data: {
        userId: state.config.userId,
        conversationId,
        isTyping: true,
      },
    })

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping()
    }, 3000)
  }, [state.config?.userId, conversationId, sendMessage])

  const stopTyping = useCallback(() => {
    if (!state.config?.userId || !conversationId) return

    sendMessage({
      type: "typing",
      data: {
        userId: state.config.userId,
        conversationId,
        isTyping: false,
      },
    })

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
  }, [state.config?.userId, conversationId, sendMessage])

  const typingUsers = state.typingStatuses
    .filter((t) => t.conversationId === conversationId && t.userId !== state.config?.userId && t.isTyping)
    .map((t) => state.users[t.userId])
    .filter(Boolean)

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

  return {
    startTyping,
    stopTyping,
    typingUsers,
    isTyping: typingUsers.length > 0,
  }
}

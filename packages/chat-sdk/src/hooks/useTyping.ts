"use client"

import { useCallback, useEffect, useRef } from "react"
import { useChatContext } from "../context/ChatContext"
import { useSocket } from "./useSocket"

export function useTyping(conversationId: string) {
  const context = useChatContext()
  const user = context?.user
  const { sendMessage } = useSocket()
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  const startTyping = useCallback(() => {
    if (!user?.userID || !conversationId) return

    sendMessage({
      type: "typing",
      data: {
        userId: user.userID,
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
  }, [user?.userID, conversationId, sendMessage])

  const stopTyping = useCallback(() => {
    if (!user?.userID || !conversationId) return

    sendMessage({
      type: "typing",
      data: {
        userId: user.userID,
        conversationId,
        isTyping: false,
      },
    })

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
  }, [user?.userID, conversationId, sendMessage])

  // For now, return empty typing users - will be integrated with OpenIM SDK
  const typingUsers: any[] = []

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

"use client"

import { useCallback } from "react"
import { useChatContext } from "../context/ChatContext"
import type { Message } from "../types"

export function useChat(conversationId: string) {
  const { state, dispatch } = useChatContext()

  const sendMessage = useCallback(
    async (content: string, type: "text" | "image" | "file" = "text") => {
      if (!state.config?.userId || !conversationId) return

      const message: Message = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        conversationId,
        senderId: state.config.userId,
        content,
        type,
        timestamp: new Date(),
        status: "sending",
      }

      // Add message optimistically
      dispatch({ type: "ADD_MESSAGE", payload: message })

      // Simulate message delivery
      setTimeout(() => {
        dispatch({
          type: "UPDATE_MESSAGE",
          payload: { ...message, status: "delivered" },
        })
      }, 100)

      // Update conversation's last message
      const conversation = state.conversations.find((c) => c.id === conversationId)
      if (conversation) {
        dispatch({
          type: "UPDATE_CONVERSATION",
          payload: {
            ...conversation,
            lastMessage: { ...message, status: "delivered" },
            updatedAt: new Date(),
          },
        })
      }
    },
    [state.config, conversationId, dispatch, state.conversations],
  )

  return {
    sendMessage,
  }
}

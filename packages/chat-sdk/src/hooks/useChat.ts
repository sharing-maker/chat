"use client"

import { useCallback } from "react"
import { useChatContext } from "../context/ChatContext"
import { useSocket } from "./useSocket"
import type { Message, MessageStatus } from "../types"

export function useChat(conversationId: string) {
  const context = useChatContext()
  const user = context?.user
  const { sendMessage: sendSocketMessage, isConnected } = useSocket()

  const sendMessage = useCallback(
    async (content: string, type: "text" | "image" | "file" = "text") => {
      if (!user?.userID || !conversationId) return

      const message: Message = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        conversationId,
        senderId: user.userID,
        content,
        type,
        timestamp: new Date(),
        status: "sending",
      }

      try {
        // Try to send via WebSocket if connected
        const socketSent = sendSocketMessage({
          type: "message",
          data: message,
        })

        // Update message status
        const updatedMessage = {
          ...message,
          status: (socketSent && isConnected ? "sent" : "delivered") as MessageStatus,
        }

        console.log("Message sent:", updatedMessage)
      } catch (error) {
        console.error("Failed to send message:", error)
      }
    },
    [user, conversationId, sendSocketMessage, isConnected],
  )

  const markAsRead = useCallback(
    async (messageId: string) => {
      if (!user?.userID) return

      try {
        sendSocketMessage({
          type: "read",
          data: { messageId, conversationId },
        })
      } catch (error) {
        console.error("Failed to mark message as read:", error)
      }
    },
    [user, conversationId, sendSocketMessage],
  )

  return {
    sendMessage,
    markAsRead,
  }
}

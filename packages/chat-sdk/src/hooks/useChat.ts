"use client"

import { useCallback } from "react"
import { useChatContext } from "../context/ChatContext"

export function useChat(conversationId: string) {
  const { sendMessage: contextSendMessage } = useChatContext()

  const sendMessage = useCallback(
    async (content: string) => {
      return contextSendMessage(conversationId, content)
    },
    [conversationId, contextSendMessage],
  )

  return {
    sendMessage,
  }
}

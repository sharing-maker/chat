"use client"

import { useState } from "react"
import { useChatContext } from "../context/ChatContext"

export function useMessages(conversationId: string) {
  const context = useChatContext()
  const [messages] = useState([]) // Empty for now, will be populated with real OpenIM SDK data

  return {
    messages: messages || [],
    isLoading: false,
  }
}

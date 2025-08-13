"use client"
import { useChatContext } from "../context/ChatContext"

export function useConversationList() {
  const context = useChatContext()

  return {
    conversations: [], // Empty for now, will be populated with real OpenIM SDK data
    isLoading: false,
  }
}

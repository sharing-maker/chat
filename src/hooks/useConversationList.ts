"use client"
import { useChatContext } from "../context/ChatContext"

export function useConversationList() {
  const { state } = useChatContext()

  return {
    conversations: state.conversations || [],
    isLoading: false,
  }
}

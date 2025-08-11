"use client"
import { useChatContext } from "../context/ChatContextOld"

export function useConversationList() {
  const { state } = useChatContext()

  return {
    conversations: state.conversations || [],
    isLoading: false,
  }
}

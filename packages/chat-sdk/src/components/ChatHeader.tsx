"use client"
import { useChatContext } from "../context/ChatContext"

export function ChatHeader() {
  const { state } = useChatContext()

  const activeConversation = state.conversations.find((conv) => conv.id === state.activeConversationId)

  return (
    <div className="bg-blue-600 text-white p-4 border-b">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-sm font-medium">{activeConversation?.name.charAt(0) || "C"}</span>
        </div>
        <div>
          <h3 className="font-medium">{activeConversation?.name || "Chat"}</h3>
          <p className="text-xs text-blue-100">{state.isConnected ? "Online" : "Offline"}</p>
        </div>
      </div>
    </div>
  )
}

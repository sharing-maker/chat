"use client"

import { useState } from "react"
import { useChatContext } from "../context/ChatContext"
import ConversationList from "./ConversationList"
import ChatHeader from "./ChatHeader"
import MessageList from "./MessageList"
import ChatInput from "./ChatInput"

interface ChatLayoutProps {
  onClose: () => void
}

export default function ChatLayout({ onClose }: ChatLayoutProps) {
  const { state } = useChatContext()
  const [view, setView] = useState<"conversations" | "chat">("conversations")

  const currentConversation = state.conversations.find((conv) => conv.id === state.currentConversationId)

  const handleConversationSelect = (conversationId: string) => {
    setView("chat")
  }

  const handleBackToConversations = () => {
    setView("conversations")
  }

  return (
    <div className="flex flex-col h-full">
      {view === "conversations" ? (
        <>
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <ConversationList onConversationSelect={handleConversationSelect} />
        </>
      ) : (
        <>
          <ChatHeader conversation={currentConversation} onBack={handleBackToConversations} onClose={onClose} />
          <div className="flex-1 flex flex-col min-h-0">
            <MessageList />
            <ChatInput />
          </div>
        </>
      )}
    </div>
  )
}

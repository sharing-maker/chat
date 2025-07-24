"use client"

import React, { useState } from "react"
import { MessageSquare, X } from "lucide-react"
import { ChatProvider } from "../context/ChatContext"
import { ChatLayout } from "./ChatLayout"

export function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false)

  // Cast Lucide icons to React components to fix TypeScript error
  const XIcon = X as React.ComponentType<{ className?: string }>
  const MessageSquareIcon = MessageSquare as React.ComponentType<{ className?: string }>

  const chatConfig = {
    userId: "current-user-id",
    token: "demo-token",
    apiUrl: "https://api.example.com",
    wsUrl: "demo", // Use demo mode
    onTokenRefresh: async () => {
      // In a real app, refresh the token here
      return "new-token"
    },
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-0 md:inset-auto md:bottom-20 md:right-4 w-full h-full md:w-[400px] md:h-[600px] bg-white rounded-lg shadow-xl flex flex-col overflow-hidden transition-all duration-300 ease-in-out transform origin-bottom-right md:scale-100">
          <ChatProvider {...chatConfig}>
            <ChatLayout />
          </ChatProvider>
        </div>
      )}

      {/* Chat Bubble Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <XIcon className="w-6 h-6" /> : <MessageSquareIcon className="w-6 h-6" />}
      </button>
    </div>
  )
}

"use client"

import { useState } from "react"
import { MessageCircle, X } from "lucide-react"
import { ChatProvider } from "../context/ChatContext"
import { ChatLayout } from "./ChatLayout"

export function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Chat Bubble Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-200 flex items-center justify-center z-50"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 z-40 overflow-hidden">
          <ChatProvider userId="user-1" token="demo-token" websocketUrl="demo" enableWebSocket={false}>
            <ChatLayout />
          </ChatProvider>
        </div>
      )}
    </>
  )
}

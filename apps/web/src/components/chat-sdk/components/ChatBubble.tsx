"use client"

import { useState } from "react"
import { MessageCircle, X } from "lucide-react"
import { ChatProvider } from "../context/ChatContext"
import { ChatLayout } from "./ChatLayout"

export function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  return (
    <ChatProvider>
      <div className="fixed bottom-4 right-4 z-50">
        {isOpen && (
          <div className="mb-4 w-80 h-96 bg-white rounded-lg shadow-2xl border slide-up">
            <ChatLayout onClose={() => setIsOpen(false)} />
          </div>
        )}

        <button
          onClick={toggleChat}
          className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
          aria-label={isOpen ? "Close chat" : "Open chat"}
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </button>
      </div>
    </ChatProvider>
  )
}

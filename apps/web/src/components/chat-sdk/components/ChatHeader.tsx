"use client"

import type { Conversation } from "../types"

interface ChatHeaderProps {
  conversation?: Conversation
  onBack: () => void
  onClose: () => void
}

export default function ChatHeader({ conversation, onBack, onClose }: ChatHeaderProps) {
  if (!conversation) return null

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
      <div className="flex items-center">
        <button onClick={onBack} className="mr-3 text-gray-500 hover:text-gray-700" aria-label="Back to conversations">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex items-center">
          <img
            src={conversation.participants[0]?.avatar || "/placeholder.svg?height=32&width=32"}
            alt={conversation.name}
            className="w-8 h-8 rounded-full mr-3"
          />
          <div>
            <h3 className="text-sm font-medium text-gray-900">{conversation.name}</h3>
            <p className="text-xs text-gray-500">Online</p>
          </div>
        </div>
      </div>
      <button onClick={onClose} className="text-gray-500 hover:text-gray-700" aria-label="Close chat">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

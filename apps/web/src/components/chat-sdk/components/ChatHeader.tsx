"use client"
import { ArrowLeft, X } from "lucide-react"
import type { Conversation } from "../types"

interface ChatHeaderProps {
  conversation?: Conversation
  onBack: () => void
  onClose: () => void
}

export function ChatHeader({ conversation, onBack, onClose }: ChatHeaderProps) {
  if (!conversation) return null

  const otherParticipants = conversation.participants.filter((p) => p.id !== "user-1")
  const displayName = otherParticipants.length > 0 ? otherParticipants[0].name : conversation.title

  return (
    <div className="flex items-center justify-between p-4 border-b bg-white">
      <div className="flex items-center">
        <button
          onClick={onBack}
          className="mr-3 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Back to conversations"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center">
          <div className="flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            {otherParticipants[0]?.avatar ? (
              <img
                src={otherParticipants[0].avatar || "/placeholder.svg"}
                alt={displayName}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <span className="text-xs font-medium text-gray-600">{displayName.charAt(0).toUpperCase()}</span>
            )}
          </div>

          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-900">{displayName}</h3>
            {otherParticipants[0]?.isOnline && <p className="text-xs text-green-600">Online</p>}
          </div>
        </div>
      </div>

      <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors" aria-label="Close chat">
        <X className="w-5 h-5" />
      </button>
    </div>
  )
}

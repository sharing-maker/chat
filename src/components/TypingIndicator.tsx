"use client"
import { useTyping } from "../hooks/useTyping"

interface TypingIndicatorProps {
  conversationId: string
}

export function TypingIndicator({ conversationId }: TypingIndicatorProps) {
  const { typingUsers, isTyping } = useTyping(conversationId)

  if (!isTyping) return null

  const getTypingText = () => {
    if (typingUsers.length === 1) {
      return `${typingUsers[0].name} is typing...`
    } else if (typingUsers.length === 2) {
      return `${typingUsers[0].name} and ${typingUsers[1].name} are typing...`
    } else if (typingUsers.length > 2) {
      return `${typingUsers[0].name} and ${typingUsers.length - 1} others are typing...`
    }
    return "Someone is typing..."
  }

  return (
    <div className="flex items-center space-x-2 px-3 sm:px-4 py-2">
      <div className="flex space-x-1">
        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"></div>
        <div
          className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "0.1s" }}
        ></div>
        <div
          className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></div>
      </div>
      <span className="text-xs sm:text-sm text-gray-500">{getTypingText()}</span>
    </div>
  )
}

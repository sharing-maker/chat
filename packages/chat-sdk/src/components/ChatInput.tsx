"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Send, Smile } from "lucide-react"
import { useChatContext } from "../context/ChatContext"
import type { ChatInputProps } from "../types"

export function ChatInput({
  conversationId,
  onSendMessage,
  placeholder = "Type a message...",
  disabled = false,
  className = "",
}: ChatInputProps) {
  const [message, setMessage] = useState("")
  const { sendMessage: sendChatMessage } = useChatContext()

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!message.trim() || disabled) return

      // Use integrated chat system if available, otherwise use callback
      if (sendChatMessage) {
        await sendChatMessage(conversationId || "", message.trim())
      } else {
        onSendMessage?.(message.trim())
      }

      setMessage("")
    },
    [message, disabled, sendChatMessage, conversationId, onSendMessage],
  )

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSubmit(e as any)
      }
    },
    [handleSubmit],
  )

  return (
    <div className={`bg-white border-t border-gray-200 p-3 sm:p-4 ${className}`}>
      <div className="bg-gray-50 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="px-4 py-3">
          <form onSubmit={handleSubmit} className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={placeholder}
                disabled={disabled}
                className="w-full bg-transparent border-none outline-none resize-none text-sm sm:text-base text-gray-900 placeholder-gray-500 leading-5"
                rows={1}
                style={{
                  minHeight: "20px",
                  maxHeight: "120px",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={disabled || !message.trim()}
              className="flex-shrink-0 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        <div className="px-4 pb-3 border-t border-gray-100">
          <div className="flex items-center space-x-2 justify-start">
            <button
              disabled={disabled}
              className="p-1.5 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 active:scale-95 text-gray-500 hover:text-yellow-500"
              aria-label="Emoji"
              title="Emoji"
            >
              <Smile className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

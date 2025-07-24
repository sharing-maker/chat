"use client"

import type React from "react"
import { useState } from "react"
import { useChatContext } from "../context/ChatContext"
import type { Message } from "../types"

export default function ChatInput() {
  const { state, dispatch } = useChatContext()
  const [inputValue, setInputValue] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!inputValue.trim() || !state.currentConversationId) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      senderId: state.currentUser.id,
      timestamp: new Date(),
      type: "text",
    }

    dispatch({
      type: "ADD_MESSAGE",
      payload: {
        conversationId: state.currentConversationId,
        message: newMessage,
      },
    })

    setInputValue("")

    // Simulate typing indicator and response
    dispatch({ type: "SET_TYPING", payload: true })
    setTimeout(() => {
      dispatch({ type: "SET_TYPING", payload: false })

      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Thanks for your message! How else can I help you?",
        senderId: "support",
        timestamp: new Date(),
        type: "text",
      }

      dispatch({
        type: "ADD_MESSAGE",
        payload: {
          conversationId: state.currentConversationId!,
          message: responseMessage,
        },
      })
    }, 2000)
  }

  return (
    <div className="p-4 border-t border-gray-200 bg-white">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  )
}

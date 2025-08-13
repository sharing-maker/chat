"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Paperclip, Smile } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "agent"
  timestamp: Date
  type: "text" | "image" | "file"
}

export default function MessageList({ conversationId }: { conversationId: string }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! How can I help you today?",
      sender: "agent",
      timestamp: new Date(Date.now() - 60000),
      type: "text",
    },
    {
      id: "2",
      content: "I have a question about my order",
      sender: "user",
      timestamp: new Date(Date.now() - 30000),
      type: "text",
    },
    {
      id: "3",
      content: "I'd be happy to help you with your order. Could you please provide your order number?",
      sender: "agent",
      timestamp: new Date(),
      type: "text",
    },
  ])
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        content: newMessage,
        sender: "user",
        timestamp: new Date(),
        type: "text",
      }
      setMessages((prev) => [...prev, message])
      setNewMessage("")

      // Simulate agent response
      setTimeout(() => {
        const agentMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "Thank you for your message. I'm processing your request...",
          sender: "agent",
          timestamp: new Date(),
          type: "text",
        }
        setMessages((prev) => [...prev, agentMessage])
      }, 1000)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">CS</span>
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Customer Support</h2>
            <p className="text-sm text-green-600">● Online</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.sender === "user"
                  ? "bg-blue-500 text-white rounded-br-sm"
                  : "bg-gray-100 text-gray-900 rounded-bl-sm"
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className={`text-xs mt-1 ${message.sender === "user" ? "text-blue-100" : "text-gray-500"}`}>
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-end space-x-2">
          <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
            <Paperclip size={20} />
          </button>
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full px-4 py-2 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={1}
            />
          </div>
          <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
            <Smile size={20} />
          </button>
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}

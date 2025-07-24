"use client"

import { useEffect, useRef } from "react"
import { useChatContext } from "../context/ChatContext"
import { MessageItem } from "./MessageItem"

export function MessageList() {
  const { state } = useChatContext()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const messages = state.activeConversationId ? state.messages[state.activeConversationId] || [] : []

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} isOwn={message.senderId === state.currentUser?.id} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}

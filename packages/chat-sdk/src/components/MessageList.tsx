"use client"

import { useEffect, useRef } from "react"
import { useChatContext } from "../context/ChatContext"
import { MessageItem } from "./MessageItem"
import { DateDivider } from "./DateDivider"

interface MessageListProps {
  conversationId: string
  className?: string
}

export function MessageList({ conversationId, className = "" }: MessageListProps) {
  const { messages, currentUser } = useChatContext()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const groupedMessages = messages.reduce((groups: { [key: string]: typeof messages }, message) => {
    const date = new Date(message.timestamp).toDateString()
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(message)
    return groups
  }, {})

  return (
    <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${className}`}>
      {Object.entries(groupedMessages).map(([date, dayMessages]) => (
        <div key={date}>
          <DateDivider date={new Date(date)} />
          {dayMessages.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
              isOwn={message.senderId === currentUser?.id}
              showAvatar={message.senderId !== currentUser?.id}
            />
          ))}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}

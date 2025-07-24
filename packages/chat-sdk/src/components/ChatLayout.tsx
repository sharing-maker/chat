"use client"

import { ChatProvider } from "../context/ChatContext"
import { ChatHeader } from "./ChatHeader"
import { MessageList } from "./MessageList"
import { ChatInput } from "./ChatInput"
import type { User } from "../types"

interface ChatLayoutProps {
  conversationId: string
  currentUser?: User
  className?: string
}

export function ChatLayout({ conversationId, currentUser, className = "" }: ChatLayoutProps) {
  const defaultUser: User = {
    id: "user-1",
    name: "You",
    avatar: "/placeholder-user.jpg",
    isOnline: true,
  }

  return (
    <ChatProvider currentUser={currentUser || defaultUser}>
      <div className={`flex flex-col h-full bg-white ${className}`}>
        <ChatHeader conversationId={conversationId} />
        <MessageList conversationId={conversationId} />
        <ChatInput conversationId={conversationId} />
      </div>
    </ChatProvider>
  )
}

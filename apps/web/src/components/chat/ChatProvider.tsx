"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface ChatContextType {
  messages: any[]
  conversations: any[]
  activeConversation: string | null
  setActiveConversation: (id: string) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({
  children,
  config,
}: {
  children: ReactNode
  config?: any
}) {
  const [messages, setMessages] = useState([])
  const [conversations, setConversations] = useState([
    {
      id: "sg_3408237279",
      name: "Customer Support",
      lastMessage: "Hello, how can we help you?",
      timestamp: new Date(),
    },
  ])
  const [activeConversation, setActiveConversation] = useState<string | null>("sg_3408237279")

  return (
    <ChatContext.Provider
      value={{
        messages,
        conversations,
        activeConversation,
        setActiveConversation,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChatContext() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider")
  }
  return context
}

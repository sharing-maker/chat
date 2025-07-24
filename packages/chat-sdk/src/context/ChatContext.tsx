"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { Message, User, Conversation, ChatConfig } from "../types"

interface ChatContextType {
  messages: Message[]
  conversations: Conversation[]
  currentUser: User | null
  activeConversation: string | null
  config: ChatConfig
  sendMessage: (conversationId: string, content: string) => Promise<void>
  addMessage: (message: Message) => void
  setActiveConversation: (conversationId: string) => void
  setCurrentUser: (user: User) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

interface ChatProviderProps {
  children: ReactNode
  config?: ChatConfig
  currentUser?: User
}

export function ChatProvider({ children, config = {}, currentUser }: ChatProviderProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(currentUser || null)

  const sendMessage = useCallback(
    async (conversationId: string, content: string) => {
      if (!user) return

      const newMessage: Message = {
        id: Date.now().toString(),
        content,
        senderId: user.id,
        timestamp: new Date(),
        type: "text",
        isRead: false,
        isDelivered: true,
      }

      setMessages((prev) => [...prev, newMessage])

      // Simulate bot response after a delay
      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: `Thanks for your message: "${content}". This is a demo response!`,
          senderId: "bot",
          timestamp: new Date(),
          type: "text",
          isRead: false,
          isDelivered: true,
        }
        setMessages((prev) => [...prev, botMessage])
      }, 1000)
    },
    [user],
  )

  const addMessage = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message])
  }, [])

  const setCurrentUser = useCallback((newUser: User) => {
    setUser(newUser)
  }, [])

  const value: ChatContextType = {
    messages,
    conversations,
    currentUser: user,
    activeConversation,
    config,
    sendMessage,
    addMessage,
    setActiveConversation,
    setCurrentUser,
  }

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export function useChatContext() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider")
  }
  return context
}

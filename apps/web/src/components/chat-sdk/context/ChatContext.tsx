"use client"

import type React from "react"
import { createContext, useContext, useReducer, type ReactNode } from "react"
import type { Message, Conversation, User } from "../types"

interface ChatState {
  conversations: Conversation[]
  currentConversationId: string | null
  messages: { [conversationId: string]: Message[] }
  currentUser: User
  isTyping: boolean
}

type ChatAction =
  | { type: "SET_CONVERSATIONS"; payload: Conversation[] }
  | { type: "SET_CURRENT_CONVERSATION"; payload: string | null }
  | { type: "ADD_MESSAGE"; payload: { conversationId: string; message: Message } }
  | { type: "SET_MESSAGES"; payload: { conversationId: string; messages: Message[] } }
  | { type: "SET_TYPING"; payload: boolean }

const initialState: ChatState = {
  conversations: [
    {
      id: "1",
      name: "Support Team",
      lastMessage: "How can we help you today?",
      timestamp: new Date(),
      unreadCount: 0,
      participants: [{ id: "support", name: "Support Team", avatar: "/placeholder-user.jpg" }],
    },
    {
      id: "2",
      name: "Sales Team",
      lastMessage: "Thanks for your interest!",
      timestamp: new Date(Date.now() - 3600000),
      unreadCount: 2,
      participants: [{ id: "sales", name: "Sales Team", avatar: "/placeholder-user.jpg" }],
    },
  ],
  currentConversationId: "1",
  messages: {
    "1": [
      {
        id: "1",
        content: "Hello! How can we help you today?",
        senderId: "support",
        timestamp: new Date(Date.now() - 1800000),
        type: "text",
      },
      {
        id: "2",
        content: "I have a question about your pricing.",
        senderId: "user",
        timestamp: new Date(Date.now() - 1200000),
        type: "text",
      },
      {
        id: "3",
        content: "I'd be happy to help with that! What specific information are you looking for?",
        senderId: "support",
        timestamp: new Date(Date.now() - 600000),
        type: "text",
      },
    ],
    "2": [
      {
        id: "4",
        content: "Thanks for your interest in our product!",
        senderId: "sales",
        timestamp: new Date(Date.now() - 3600000),
        type: "text",
      },
      {
        id: "5",
        content: "Would you like to schedule a demo?",
        senderId: "sales",
        timestamp: new Date(Date.now() - 3000000),
        type: "text",
      },
    ],
  },
  currentUser: {
    id: "user",
    name: "You",
    avatar: "/placeholder-user.jpg",
  },
  isTyping: false,
}

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "SET_CONVERSATIONS":
      return { ...state, conversations: action.payload }
    case "SET_CURRENT_CONVERSATION":
      return { ...state, currentConversationId: action.payload }
    case "ADD_MESSAGE":
      const { conversationId, message } = action.payload
      return {
        ...state,
        messages: {
          ...state.messages,
          [conversationId]: [...(state.messages[conversationId] || []), message],
        },
      }
    case "SET_MESSAGES":
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.conversationId]: action.payload.messages,
        },
      }
    case "SET_TYPING":
      return { ...state, isTyping: action.payload }
    default:
      return state
  }
}

const ChatContext = createContext<{
  state: ChatState
  dispatch: React.Dispatch<ChatAction>
} | null>(null)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState)

  return <ChatContext.Provider value={{ state, dispatch }}>{children}</ChatContext.Provider>
}

export function useChatContext() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider")
  }
  return context
}

"use client"

import { createContext, useContext, useReducer, useCallback, type ReactNode } from "react"
import type { ChatState, ChatAction, ChatContextType, User, Conversation, Message } from "../types"

const initialUser: User = {
  id: "user-1",
  name: "You",
  avatar: "/placeholder-user.jpg",
  email: "user@example.com",
  isOnline: true,
}

const initialConversations: Conversation[] = [
  {
    id: "conv-1",
    title: "Support Chat",
    participants: [
      initialUser,
      {
        id: "support-1",
        name: "Sarah (Support)",
        avatar: "/placeholder-user.jpg",
        isOnline: true,
      },
    ],
    lastMessage: {
      id: "msg-1",
      content: "Hi! How can I help you today?",
      senderId: "support-1",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      type: "text",
    },
    unreadCount: 1,
    createdAt: new Date(Date.now() - 1000 * 60 * 60),
    updatedAt: new Date(Date.now() - 1000 * 60 * 5),
    type: "support",
  },
  {
    id: "conv-2",
    title: "Sales Inquiry",
    participants: [
      initialUser,
      {
        id: "sales-1",
        name: "Mike (Sales)",
        avatar: "/placeholder-user.jpg",
        isOnline: true,
      },
    ],
    lastMessage: {
      id: "msg-2",
      content: "Thanks for your interest in our product!",
      senderId: "sales-1",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      type: "text",
    },
    unreadCount: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30),
    type: "sales",
  },
]

const initialMessages = {
  "conv-1": [
    {
      id: "msg-1",
      content: "Hi! How can I help you today?",
      senderId: "support-1",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      type: "text" as const,
    },
  ],
  "conv-2": [
    {
      id: "msg-2",
      content: "Thanks for your interest in our product!",
      senderId: "sales-1",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      type: "text" as const,
    },
  ],
}

const initialState: ChatState = {
  conversations: initialConversations,
  messages: initialMessages,
  currentConversationId: null,
  isLoading: false,
  error: null,
  currentUser: initialUser,
}

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "SET_CONVERSATIONS":
      return {
        ...state,
        conversations: action.payload,
      }

    case "ADD_CONVERSATION":
      return {
        ...state,
        conversations: [...state.conversations, action.payload],
      }

    case "SET_CURRENT_CONVERSATION":
      return {
        ...state,
        currentConversationId: action.payload,
      }

    case "ADD_MESSAGE":
      const { conversationId, message } = action.payload
      return {
        ...state,
        messages: {
          ...state.messages,
          [conversationId]: [...(state.messages[conversationId] || []), message],
        },
        conversations: state.conversations.map((conv) =>
          conv.id === conversationId ? { ...conv, lastMessage: message, updatedAt: new Date() } : conv,
        ),
      }

    case "SET_MESSAGES":
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.conversationId]: action.payload.messages,
        },
      }

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      }

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      }

    case "MARK_AS_READ":
      return {
        ...state,
        conversations: state.conversations.map((conv) =>
          conv.id === action.payload ? { ...conv, unreadCount: 0 } : conv,
        ),
      }

    default:
      return state
  }
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState)

  const sendMessage = useCallback(
    (conversationId: string, content: string) => {
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        content,
        senderId: state.currentUser.id,
        timestamp: new Date(),
        type: "text",
      }

      dispatch({
        type: "ADD_MESSAGE",
        payload: { conversationId, message: newMessage },
      })

      // Simulate response after a delay
      setTimeout(
        () => {
          const conversation = state.conversations.find((c) => c.id === conversationId)
          if (conversation) {
            const otherParticipant = conversation.participants.find((p) => p.id !== state.currentUser.id)
            if (otherParticipant) {
              const responses = [
                "Thanks for your message! I'll get back to you shortly.",
                "I understand your concern. Let me help you with that.",
                "That's a great question! Here's what I can tell you...",
                "I appreciate you reaching out. Let me assist you.",
                "Thanks for the information. I'll look into this right away.",
              ]

              const responseMessage: Message = {
                id: `msg-${Date.now()}-response`,
                content: responses[Math.floor(Math.random() * responses.length)],
                senderId: otherParticipant.id,
                timestamp: new Date(),
                type: "text",
              }

              dispatch({
                type: "ADD_MESSAGE",
                payload: { conversationId, message: responseMessage },
              })
            }
          }
        },
        1000 + Math.random() * 2000,
      )
    },
    [state.currentUser.id, state.conversations],
  )

  const createConversation = useCallback(
    (title: string, type: Conversation["type"]) => {
      const newConversation: Conversation = {
        id: `conv-${Date.now()}`,
        title,
        participants: [state.currentUser],
        unreadCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        type,
      }

      dispatch({
        type: "ADD_CONVERSATION",
        payload: newConversation,
      })
    },
    [state.currentUser],
  )

  const setCurrentConversation = useCallback((conversationId: string) => {
    dispatch({
      type: "SET_CURRENT_CONVERSATION",
      payload: conversationId,
    })

    dispatch({
      type: "MARK_AS_READ",
      payload: conversationId,
    })
  }, [])

  const value: ChatContextType = {
    state,
    dispatch,
    sendMessage,
    createConversation,
    setCurrentConversation,
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

"use client"

import { createContext, useContext, useReducer, useCallback, type ReactNode } from "react"
import type { ChatState, ChatAction, ChatContextType, Message } from "../types"

const initialState: ChatState = {
  currentUser: null,
  conversations: [],
  activeConversationId: null,
  messages: {},
  isTyping: {},
  isConnected: false,
}

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "SET_USER":
      return { ...state, currentUser: action.payload }
    case "SET_CONVERSATIONS":
      return { ...state, conversations: action.payload }
    case "SET_ACTIVE_CONVERSATION":
      return { ...state, activeConversationId: action.payload }
    case "ADD_MESSAGE":
      const { conversationId, message } = action.payload
      return {
        ...state,
        messages: {
          ...state.messages,
          [conversationId]: [...(state.messages[conversationId] || []), message],
        },
      }
    case "SET_TYPING":
      return {
        ...state,
        isTyping: {
          ...state.isTyping,
          [action.payload.userId]: action.payload.isTyping,
        },
      }
    case "SET_CONNECTED":
      return { ...state, isConnected: action.payload }
    default:
      return state
  }
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

interface ChatProviderProps {
  children: ReactNode
  userId: string
  token: string
  websocketUrl: string
  enableWebSocket?: boolean
}

export function ChatProvider({ children, userId, token, websocketUrl, enableWebSocket = true }: ChatProviderProps) {
  const [state, dispatch] = useReducer(chatReducer, {
    ...initialState,
    currentUser: {
      id: userId,
      name: "Demo User",
      avatar: "/placeholder-user.jpg",
      isOnline: true,
    },
    conversations: [
      {
        id: "conv-1",
        name: "General Chat",
        participants: [
          { id: userId, name: "Demo User", isOnline: true },
          { id: "bot-1", name: "Chat Bot", isOnline: true },
        ],
        unreadCount: 0,
        isGroup: false,
      },
    ],
    activeConversationId: "conv-1",
    messages: {
      "conv-1": [
        {
          id: "msg-1",
          content: "Welcome to the chat! How can I help you today?",
          senderId: "bot-1",
          timestamp: new Date(Date.now() - 60000),
          type: "text",
          isRead: true,
        },
      ],
    },
    isConnected: true,
  })

  const sendMessage = useCallback(
    (content: string) => {
      if (!state.activeConversationId || !state.currentUser) return

      const message: Message = {
        id: `msg-${Date.now()}`,
        content,
        senderId: state.currentUser.id,
        timestamp: new Date(),
        type: "text",
        isRead: false,
      }

      dispatch({
        type: "ADD_MESSAGE",
        payload: { conversationId: state.activeConversationId, message },
      })

      // Simulate bot response
      setTimeout(() => {
        const botMessage: Message = {
          id: `msg-${Date.now()}-bot`,
          content: `Thanks for your message: "${content}". This is a demo response!`,
          senderId: "bot-1",
          timestamp: new Date(),
          type: "text",
          isRead: false,
        }

        dispatch({
          type: "ADD_MESSAGE",
          payload: { conversationId: state.activeConversationId!, message: botMessage },
        })
      }, 1000)
    },
    [state.activeConversationId, state.currentUser],
  )

  const setActiveConversation = useCallback((conversationId: string) => {
    dispatch({ type: "SET_ACTIVE_CONVERSATION", payload: conversationId })
  }, [])

  const value: ChatContextType = {
    state,
    dispatch,
    sendMessage,
    setActiveConversation,
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

import type React from "react"
export interface User {
  id: string
  name: string
  avatar?: string
  isOnline?: boolean
}

export interface Message {
  id: string
  content: string
  senderId: string
  timestamp: Date
  type: "text" | "image" | "file"
  isRead?: boolean
  replyTo?: string
}

export interface Conversation {
  id: string
  name: string
  participants: User[]
  lastMessage?: Message
  unreadCount: number
  isGroup: boolean
  avatar?: string
}

export interface ChatState {
  currentUser: User | null
  conversations: Conversation[]
  activeConversationId: string | null
  messages: Record<string, Message[]>
  isTyping: Record<string, boolean>
  isConnected: boolean
}

export type ChatAction =
  | { type: "SET_USER"; payload: User }
  | { type: "SET_CONVERSATIONS"; payload: Conversation[] }
  | { type: "SET_ACTIVE_CONVERSATION"; payload: string }
  | { type: "ADD_MESSAGE"; payload: { conversationId: string; message: Message } }
  | { type: "SET_TYPING"; payload: { userId: string; isTyping: boolean } }
  | { type: "SET_CONNECTED"; payload: boolean }

export interface ChatContextType {
  state: ChatState
  dispatch: React.Dispatch<ChatAction>
  sendMessage: (content: string) => void
  setActiveConversation: (conversationId: string) => void
}

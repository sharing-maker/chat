export interface User {
  id: string
  name: string
  avatar?: string
  status?: "online" | "offline" | "away"
  lastSeen?: Date
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  content: string
  type: "text" | "image" | "file" | "audio" | "video"
  timestamp: Date
  status: "sending" | "sent" | "delivered" | "read" | "failed"
  metadata?: Record<string, any>
  caption?: string
  fileUrl?: string
  fileName?: string
}

export interface Conversation {
  id: string
  participants: User[]
  type: "direct" | "group"
  name: string
  avatar?: string
  lastMessage: string
  timestamp: Date
  unreadCount: number
  updatedAt?: Date
  metadata?: Record<string, any>
}

export interface TypingStatus {
  userId: string
  conversationId: string
  isTyping: boolean
  timestamp: Date
}

export interface ChatConfig {
  userId: string
  token: string
  wsUrl?: string
  onTokenRefresh?: () => Promise<string>
}

export interface ChatContextType {
  conversations: Conversation[]
  currentConversationId: string | null
  messages: { [conversationId: string]: Message[] }
  currentUser: User
  isTyping: boolean
}

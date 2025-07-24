export interface User {
  id: string
  name: string
  avatar?: string
  status?: "online" | "offline" | "away"
  lastSeen?: Date
}

export interface Message {
  id: string
  content: string
  senderId: string
  timestamp: Date
  type: "text" | "image" | "file"
  status?: "sent" | "delivered" | "read"
  attachments?: Attachment[]
}

export interface Attachment {
  id: string
  name: string
  url: string
  type: string
  size: number
}

export interface Conversation {
  id: string
  name: string
  participants: User[]
  lastMessage?: string
  timestamp: Date
  unreadCount: number
  type?: "direct" | "group"
}

export interface ChatConfig {
  userId: string
  token: string
  wsUrl?: string
  onTokenRefresh?: () => Promise<string>
}

export interface TypingStatus {
  userId: string
  conversationId: string
  isTyping: boolean
}

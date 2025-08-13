export type MessageStatus = "sending" | "sent" | "delivered" | "read"

export interface User {
  id: string
  name: string
  avatar?: string
  status: "online" | "offline" | "away"
  lastSeen?: Date
}

// Existing Message interface (used by context/hooks)
export interface Message {
  id: string
  conversationId: string
  senderId: string
  content: string
  type: "text" | "image" | "file" | "promo"// Keep existing types for internal data model
  timestamp: Date
  status: MessageStatus
  attachments?: Attachment[]
  promoData?: PromotionalMessageData // Added promoData here for internal Message type
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
  participants: User[]
  lastMessage?: Message
  unreadCount: number
  updatedAt: Date
  type: "direct" | "group"
  name?: string
  avatar?: string
}

export interface TypingStatus {
  userId: string
  conversationId: string
  isTyping: boolean
}

export interface ChatConfig {
  userId: string
  token: string
  apiUrl?: string
  wsUrl?: string
  onTokenRefresh?: () => Promise<string>
}

export interface SocketMessage {
  type: "message" | "typing" | "read" | "user_status"
  data: any
}

// New types for MessageItem component's props
export type MessageAttachment = {
  id: string // Added ID for image preview modal
  type: "image" | "file"
  url: string
  name?: string
  size?: number
}

export type PromotionalMessageData = {
  imageUrl: string
  title: string
  description: string
  buttonText: string
  buttonUrl: string
}

export type DisplayMessage = {
  id: string
  senderId: string
  type: "text" | "media" | "promo" // Updated type for display
  text?: string
  attachments?: MessageAttachment[]
  promoData?: PromotionalMessageData
  createdAt: string // ISO string or similar for display
  isMine: boolean
}

export type MessageItemProps = {
  message: DisplayMessage
  isGrouped?: boolean
  onImageClick?: (imageId: string, images: { id: string; url: string; name?: string }[]) => void // New prop
}

export * from "./sdk"

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
  type?: "text" | "image" | "file" | "sticker"
  attachments?: MessageAttachment[]
  isRead?: boolean
  isDelivered?: boolean
}

export interface MessageAttachment {
  id: string
  type: "image" | "file" | "audio" | "video"
  url: string
  name: string
  size?: number
  mimeType?: string
}

export interface Conversation {
  id: string
  participants: User[]
  lastMessage?: Message
  unreadCount: number
  updatedAt: Date
  title?: string
  type: "direct" | "group"
}

export interface TypingStatus {
  userId: string
  conversationId: string
  isTyping: boolean
}

export interface ChatConfig {
  apiUrl?: string
  socketUrl?: string
  theme?: "light" | "dark"
  features?: {
    typing?: boolean
    readReceipts?: boolean
    fileUpload?: boolean
    emoji?: boolean
    stickers?: boolean
  }
}

export interface ChatInputProps {
  conversationId?: string
  onSendMessage?: (message: string) => void
  onEmojiClick?: (emoji: string) => void
  onStickerClick?: (sticker: string) => void
  onFileUpload?: (file: File) => void
  onImageUpload?: (file: File) => void
  onContactShare?: () => void
  onVoiceRecord?: () => void
  onVoiceMessage?: (audioBlob: Blob) => void
  onQuickReact?: (reaction: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export interface MessageItemProps {
  message: Message
  user?: User
  isOwn?: boolean
  showAvatar?: boolean
  showTimestamp?: boolean
  onReact?: (messageId: string, reaction: string) => void
  onReply?: (message: Message) => void
  onEdit?: (messageId: string, newContent: string) => void
  onDelete?: (messageId: string) => void
  className?: string
}

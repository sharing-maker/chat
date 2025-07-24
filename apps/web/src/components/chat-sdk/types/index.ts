import type React from "react"
export interface User {
  id: string
  name: string
  avatar?: string
  email?: string
  isOnline?: boolean
}

export interface Message {
  id: string
  content: string
  senderId: string
  timestamp: Date
  type: "text" | "image" | "file"
  attachments?: MessageAttachment[]
  isRead?: boolean
}

export interface MessageAttachment {
  id: string
  type: "image" | "file"
  url: string
  name: string
  size?: number
}

export interface Conversation {
  id: string
  title: string
  participants: User[]
  lastMessage?: Message
  unreadCount: number
  createdAt: Date
  updatedAt: Date
  type: "support" | "sales" | "general"
}

export interface ChatState {
  conversations: Conversation[]
  messages: { [conversationId: string]: Message[] }
  currentConversationId: string | null
  isLoading: boolean
  error: string | null
  currentUser: User
}

export interface ChatAction {
  type:
    | "SET_CONVERSATIONS"
    | "ADD_CONVERSATION"
    | "SET_CURRENT_CONVERSATION"
    | "ADD_MESSAGE"
    | "SET_MESSAGES"
    | "SET_LOADING"
    | "SET_ERROR"
    | "MARK_AS_READ"
  payload?: any
}

export interface ChatContextType {
  state: ChatState
  dispatch: React.Dispatch<ChatAction>
  sendMessage: (conversationId: string, content: string) => void
  createConversation: (title: string, type: Conversation["type"]) => void
  setCurrentConversation: (conversationId: string) => void
}

export interface TypingStatus {
  userId: string
  conversationId: string
  isTyping: boolean
}

export interface ChatConfig {
  apiUrl?: string
  theme?: "light" | "dark"
  position?: "bottom-right" | "bottom-left"
  showUserAvatars?: boolean
  enableFileUpload?: boolean
  maxFileSize?: number
}

export interface Attachment {
  id: string
  name: string
  size: number
  type: string
  url: string
}

export interface SocketMessage {
  type: "message" | "typing" | "user_joined" | "user_left"
  data: any
}

export interface ChatInputProps {
  onSendMessage: (message: string) => void
  placeholder?: string
  disabled?: boolean
  showAttachments?: boolean
}

export interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void
  isOpen: boolean
  onClose: () => void
}

export interface DisplayMessage extends Message {
  sender: User
  isOwn: boolean
}

export interface MessageItemProps {
  message: DisplayMessage
  showAvatar?: boolean
  showTimestamp?: boolean
}

export interface PromotionalMessageData {
  title: string
  description: string
  buttonText: string
  buttonUrl: string
  imageUrl?: string
}

// Main exports for the SDK
export { ChatProvider, useChatContext } from "./context/ChatContext"

// Hooks
export { useChat } from "./hooks/useChat"
export { useMessages } from "./hooks/useMessages"
export { useConversationList } from "./hooks/useConversationList"
export { useTyping } from "./hooks/useTyping"
export { useSocket } from "./hooks/useSocket"
export { useSwipeGesture } from "./hooks/useSwipeGesture"

// Components
export { ChatLayout } from "./components/ChatLayout"
export { ConversationList } from "./components/ConversationList"
export { ConversationItem } from "./components/ConversationItem"
export { ChatHeader } from "./components/ChatHeader"
export { MessageList } from "./components/MessageList"
export { MessageItem } from "./components/MessageItem"
export { ChatInput } from "./components/ChatInput"
export { TypingIndicator } from "./components/TypingIndicator"
export { DateDivider } from "./components/DateDivider"
export { AutoScrollAnchor } from "./components/AutoScrollAnchor"
export { SwipeIndicator } from "./components/SwipeIndicator"
export { EmojiPicker } from "./components/EmojiPicker"
export { ChatInputDemo } from "./components/ChatInputDemo"
export { MessageItemDemo } from "./components/MessageItemDemo"
export { ImageLightbox } from "./components/ImageLightbox"

// Types
export type {
  User,
  Message,
  Conversation,
  TypingStatus,
  ChatConfig,
  Attachment,
  SocketMessage,
  ChatInputProps,
  EmojiPickerProps,
  DisplayMessage,
  MessageItemProps,
  MessageAttachment,
  PromotionalMessageData,
} from "./types"

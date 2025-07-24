// Main exports for the SDK
export { ChatProvider, useChatContext } from "./context/ChatContext"

// Hooks
export { useChat } from "./hooks/useChat"
export { useMessages } from "./hooks/useMessages"
export { useTyping } from "./hooks/useTyping"

// Components
export { ChatLayout } from "./components/ChatLayout"
export { ChatHeader } from "./components/ChatHeader"
export { MessageList } from "./components/MessageList"
export { MessageItem } from "./components/MessageItem"
export { ChatInput } from "./components/ChatInput"
export { ConversationList } from "./components/ConversationList"
export { ConversationItem } from "./components/ConversationItem"
export { DateDivider } from "./components/DateDivider"

// Types
export type {
  User,
  Message,
  Conversation,
  TypingStatus,
  ChatConfig,
  ChatInputProps,
  MessageItemProps,
} from "./types"

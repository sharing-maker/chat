import type React from "react" // Import React for React.Ref
import { DChatConfigProps } from "./sdk"
import { SelfUserInfo } from "@openim/wasm-client-sdk"

export interface ChatInputProps {
  onSendMessage?: (message: string) => void
  onEmojiClick?: (emoji: string) => void
  onFileUpload?: (file: File) => void
  onImageUpload?: (file: File) => void
  onContactShare?: () => void
  onVoiceRecord?: () => void
  onVoiceMessage?: () => void
  onQuickReact?: () => void
  placeholder?: string
  disabled?: boolean
  className?: string
  onStickerClick?: (sticker: string) => void
  conversationId?: string
}

export interface EmojiPickerProps {
  onEmojiSelect?: (emoji: string) => void
  onClose?: () => void
  isOpen?: boolean
  ref?: React.Ref<HTMLDivElement> // Add ref prop
  style?: React.CSSProperties
}

export interface StickerPickerProps {
  onStickerSelect?: (sticker: string) => void
  onClose?: () => void
  isOpen?: boolean
  ref?: React.Ref<HTMLDivElement> // Add ref prop
  style?: React.CSSProperties
}

export interface TextFormattingToolbarProps {
  isOpen: boolean
  onClose: () => void
  onFormatSelect: (format: string) => void
  selectedFormats?: string[]
  ref?: React.Ref<HTMLDivElement> // Add ref prop
  style?: React.CSSProperties
}

export interface ChatContextType {
  user: SelfUserInfo | null
}

export interface ChatProviderProps {
  children: React.ReactNode;
  config: DChatConfigProps;
}

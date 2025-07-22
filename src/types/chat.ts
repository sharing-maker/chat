import type React from "react" // Import React for React.Ref

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
}

export interface EmojiPickerProps {
  onEmojiSelect?: (emoji: string) => void
  onClose?: () => void
  isOpen?: boolean
  ref?: React.Ref<HTMLDivElement> // Add ref prop
}

export interface StickerPickerProps {
  onStickerSelect?: (sticker: string) => void
  onClose?: () => void
  isOpen?: boolean
  ref?: React.Ref<HTMLDivElement> // Add ref prop
}

export interface TextFormattingToolbarProps {
  isOpen: boolean
  onClose: () => void
  onFormatSelect: (format: string) => void
  selectedFormats?: string[]
  ref?: React.Ref<HTMLDivElement> // Add ref prop
}

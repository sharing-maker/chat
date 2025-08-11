interface ChatInputProps {
    onSendMessage?: (message: string) => void;
    onEmojiClick?: (emoji: string) => void;
    onFileUpload?: (file: File) => void;
    onImageUpload?: (file: File) => void;
    onContactShare?: () => void;
    onVoiceRecord?: () => void;
    onVoiceMessage?: () => void;
    onQuickReact?: () => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}
export declare function ChatInputWithCustomIcon({ onSendMessage, onEmojiClick, onFileUpload, onImageUpload, onContactShare, onVoiceRecord, onVoiceMessage, onQuickReact, placeholder, disabled, className, }: ChatInputProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ChatInputWithCustomIcon.d.ts.map

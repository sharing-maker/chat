export declare function useChat(conversationId: string): {
    sendMessage: (content: string, type?: "text" | "image" | "file") => Promise<void>;
    markAsRead: (messageId: string) => Promise<void>;
};
//# sourceMappingURL=useChat.d.ts.map
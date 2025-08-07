import { type ReactNode } from "react";
import type React from "react";
import type { ChatConfig, Conversation, Message, User, TypingStatus } from "../types";
interface ChatState {
    config: ChatConfig | null;
    conversations: Conversation[];
    messages: Record<string, Message[]>;
    users: Record<string, User>;
    typingStatuses: TypingStatus[];
    currentUser: User | null;
    isConnected: boolean;
}
type ChatAction = {
    type: "SET_CONFIG";
    payload: ChatConfig;
} | {
    type: "SET_CONVERSATIONS";
    payload: Conversation[];
} | {
    type: "ADD_CONVERSATION";
    payload: Conversation;
} | {
    type: "UPDATE_CONVERSATION";
    payload: Conversation;
} | {
    type: "SET_MESSAGES";
    payload: {
        conversationId: string;
        messages: Message[];
    };
} | {
    type: "ADD_MESSAGE";
    payload: Message;
} | {
    type: "UPDATE_MESSAGE";
    payload: Message;
} | {
    type: "SET_USERS";
    payload: Record<string, User>;
} | {
    type: "UPDATE_USER";
    payload: User;
} | {
    type: "SET_TYPING";
    payload: TypingStatus;
} | {
    type: "REMOVE_TYPING";
    payload: {
        userId: string;
        conversationId: string;
    };
} | {
    type: "SET_CONNECTION_STATUS";
    payload: boolean;
};
interface ChatContextType {
    state: ChatState;
    dispatch: React.Dispatch<ChatAction>;
}
export declare function useChatContext(): ChatContextType;
interface ChatProviderProps {
    children: ReactNode;
    userId: string;
    token: string;
    onTokenRefresh?: () => Promise<string>;
    websocketUrl?: string;
    enableWebSocket?: boolean;
}
export declare function ChatProvider({ children, userId, token, onTokenRefresh, websocketUrl, // Use "demo" as default to disable WebSocket
enableWebSocket, }: ChatProviderProps): React.JSX.Element;
export {};
//# sourceMappingURL=ChatContext.d.ts.map
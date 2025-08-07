import type { Message } from "../types";
interface MessageListProps {
    messages: Message[];
    isLoadingMore?: boolean;
    onLoadMore?: () => void;
    hasMore?: boolean;
    currentUserId: string;
    conversationId?: string;
    className?: string;
    onSwipeBack?: () => void;
}
export declare function MessageList({ messages, // Add default empty array
isLoadingMore, onLoadMore, hasMore, currentUserId, conversationId, className, onSwipeBack, }: MessageListProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=MessageList.d.ts.map
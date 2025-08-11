import type { Conversation } from "../types";
interface ConversationItemProps {
    conversation: Conversation;
    isSelected?: boolean;
    onClick?: () => void;
}
export declare function ConversationItem({ conversation, isSelected, onClick }: ConversationItemProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ConversationItem.d.ts.map

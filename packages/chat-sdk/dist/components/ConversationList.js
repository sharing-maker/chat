"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useConversationList } from "../hooks/useConversationList";
import { ConversationItem } from "./ConversationItem";
export function ConversationList({ onConversationSelect, selectedConversationId, className = "", }) {
    const { conversations, isLoading } = useConversationList();
    if (isLoading) {
        return (_jsx("div", { className: `flex flex-col space-y-2 p-3 sm:p-4 ${className}`, children: [...Array(5)].map((_, i) => (_jsx("div", { className: "animate-pulse", children: _jsxs("div", { className: "flex items-center space-x-3 p-3", children: [_jsx("div", { className: "w-10 h-10 sm:w-12 sm:h-12 bg-gray-300 rounded-full" }), _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "h-4 bg-gray-300 rounded w-3/4 mb-2" }), _jsx("div", { className: "h-3 bg-gray-300 rounded w-1/2" })] })] }) }, i))) }));
    }
    return (_jsx("div", { className: `flex flex-col ${className}`, children: conversations.map((conversation) => (_jsx(ConversationItem, { conversation: conversation, isSelected: selectedConversationId === conversation.id, onClick: () => onConversationSelect === null || onConversationSelect === void 0 ? void 0 : onConversationSelect(conversation.id) }, conversation.id))) }));
}

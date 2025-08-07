"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTyping } from "../hooks/useTyping";
export function TypingIndicator({ conversationId }) {
    const { typingUsers, isTyping } = useTyping(conversationId);
    if (!isTyping)
        return null;
    const getTypingText = () => {
        if (typingUsers.length === 1) {
            return `${typingUsers[0].name} is typing...`;
        }
        else if (typingUsers.length === 2) {
            return `${typingUsers[0].name} and ${typingUsers[1].name} are typing...`;
        }
        else if (typingUsers.length > 2) {
            return `${typingUsers[0].name} and ${typingUsers.length - 1} others are typing...`;
        }
        return "Someone is typing...";
    };
    return (_jsxs("div", { className: "flex items-center space-x-2 px-3 sm:px-4 py-2", children: [_jsxs("div", { className: "flex space-x-1", children: [_jsx("div", { className: "w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" }), _jsx("div", { className: "w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce", style: { animationDelay: "0.1s" } }), _jsx("div", { className: "w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce", style: { animationDelay: "0.2s" } })] }), _jsx("span", { className: "text-xs sm:text-sm text-gray-500", children: getTypingText() })] }));
}

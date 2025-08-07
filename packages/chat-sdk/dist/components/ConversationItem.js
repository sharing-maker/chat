"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useChatContext } from "../context/ChatContext";
export function ConversationItem({ conversation, isSelected, onClick }) {
    var _a;
    const { state } = useChatContext();
    // Get the other participant (not the current user)
    const otherParticipant = conversation.participants.find((p) => { var _a; return p.id !== ((_a = state.config) === null || _a === void 0 ? void 0 : _a.userId); });
    const formatTime = (date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days === 0) {
            return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        }
        else if (days === 1) {
            return "Yesterday";
        }
        else if (days < 7) {
            return date.toLocaleDateString([], { weekday: "short" });
        }
        else {
            return date.toLocaleDateString([], { month: "short", day: "numeric" });
        }
    };
    return (_jsxs("div", { className: `flex items-center p-3 sm:p-4 cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors ${isSelected ? "bg-blue-50 border-r-2 border-blue-500" : ""}`, onClick: onClick, children: [_jsxs("div", { className: "relative flex-shrink-0", children: [_jsx("img", { src: (otherParticipant === null || otherParticipant === void 0 ? void 0 : otherParticipant.avatar) || "/placeholder.svg?height=48&width=48&query=user", alt: (otherParticipant === null || otherParticipant === void 0 ? void 0 : otherParticipant.name) || "User", className: "w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover" }), (otherParticipant === null || otherParticipant === void 0 ? void 0 : otherParticipant.status) === "online" && (_jsx("div", { className: "absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-white" }))] }), _jsxs("div", { className: "ml-3 flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsx("h3", { className: "text-sm sm:text-base font-medium text-gray-900 truncate pr-2", children: (otherParticipant === null || otherParticipant === void 0 ? void 0 : otherParticipant.name) || "Unknown User" }), conversation.lastMessage && (_jsx("span", { className: "text-xs text-gray-500 flex-shrink-0", children: formatTime(conversation.lastMessage.timestamp) }))] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("p", { className: "text-xs sm:text-sm text-gray-600 truncate pr-2", children: ((_a = conversation.lastMessage) === null || _a === void 0 ? void 0 : _a.content) || "No messages yet" }), conversation.unreadCount > 0 && (_jsx("span", { className: "inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-500 rounded-full flex-shrink-0 min-w-[20px] h-5", children: conversation.unreadCount > 99 ? "99+" : conversation.unreadCount }))] })] })] }));
}

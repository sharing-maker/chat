"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useChatContext } from "../context/ChatContext";
export function ChatHeader({ conversationId, onBackClick, onMenuClick }) {
    const { state } = useChatContext();
    const conversation = state.conversations.find((c) => c.id === conversationId);
    const otherParticipant = conversation === null || conversation === void 0 ? void 0 : conversation.participants.find((p) => { var _a; return p.id !== ((_a = state.config) === null || _a === void 0 ? void 0 : _a.userId); });
    if (!conversation || !otherParticipant) {
        return null;
    }
    const getStatusText = () => {
        if (otherParticipant.status === "online") {
            return "Online";
        }
        else if (otherParticipant.lastSeen) {
            const now = new Date();
            const diff = now.getTime() - otherParticipant.lastSeen.getTime();
            const minutes = Math.floor(diff / (1000 * 60));
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);
            if (minutes < 1)
                return "Last seen just now";
            if (minutes < 60)
                return `Last seen ${minutes}m ago`;
            if (hours < 24)
                return `Last seen ${hours}h ago`;
            return `Last seen ${days}d ago`;
        }
        return "Offline";
    };
    return (_jsxs("div", { className: "flex items-center p-3 sm:p-4 border-b border-gray-200 bg-white relative", children: [_jsx("button", { onClick: onBackClick, className: "md:hidden p-3 mr-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 -ml-3 transition-colors", "aria-label": "Go back to conversations", children: _jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }) }) }), _jsxs("div", { className: "relative", children: [_jsx("img", { src: otherParticipant.avatar || "/placeholder.svg?height=40&width=40&query=user", alt: otherParticipant.name, className: "w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover" }), otherParticipant.status === "online" && (_jsx("div", { className: "absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-white" }))] }), _jsxs("div", { className: "ml-3 flex-1 min-w-0", children: [_jsx("h2", { className: "text-base sm:text-lg font-semibold text-gray-900 truncate", children: otherParticipant.name }), _jsx("p", { className: "text-xs sm:text-sm text-gray-500 truncate", children: getStatusText() })] }), _jsx("div", { className: "md:hidden absolute top-full left-0 right-0 bg-blue-50 border-b border-blue-100 px-4 py-2 text-xs text-blue-600 text-center animate-pulse swipe-tutorial", children: "\uD83D\uDCA1 Tip: Swipe right anywhere to go back" }), _jsxs("div", { className: "flex items-center space-x-1 sm:space-x-2", children: [_jsx("button", { className: "p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors", children: _jsx("svg", { className: "w-4 h-4 sm:w-5 sm:h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" }) }) }), _jsx("button", { className: "p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors", children: _jsx("svg", { className: "w-4 h-4 sm:w-5 sm:h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" }) }) }), _jsx("button", { onClick: onMenuClick, className: "md:hidden p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors", "aria-label": "Open menu", children: _jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 6h16M4 12h16M4 18h16" }) }) })] })] }));
}

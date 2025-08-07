"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { ConversationList } from "./ConversationList";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { useChatContext } from "../context/ChatContext";
import { useSwipeGesture } from "../hooks/useSwipeGesture";
import { useMessages } from "../hooks/useMessages";
export function ChatLayout({ className = "" }) {
    var _a;
    const [selectedConversationId, setSelectedConversationId] = useState('conv-1');
    const [showSidebar, setShowSidebar] = useState(false);
    const { state } = useChatContext();
    const messagesHook = useMessages(selectedConversationId || "");
    const handleConversationSelect = (conversationId) => {
        setSelectedConversationId(conversationId);
        setShowSidebar(false); // Hide sidebar on mobile after selection
    };
    const handleBackToList = () => {
        setSelectedConversationId(null);
        setShowSidebar(true);
    };
    // Swipe gesture for going back to conversation list
    const swipeRef = useSwipeGesture({
        onSwipeRight: () => {
            // Only trigger on mobile when a conversation is selected
            if (selectedConversationId && window.innerWidth < 768) {
                handleBackToList();
            }
        },
        threshold: 100, // Minimum swipe distance
        restraint: 100, // Maximum vertical movement allowed
        allowedTime: 300, // Maximum time for swipe
        enabled: !!selectedConversationId, // Only enable when conversation is selected
    });
    return (_jsxs("div", { className: `flex h-screen bg-white ${className}`, ref: swipeRef, children: [showSidebar && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden", onClick: () => setShowSidebar(false) })), _jsxs("div", { className: `
        fixed inset-y-0 left-0 z-50 w-full bg-white transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:w-80 md:border-r md:border-gray-200
        ${showSidebar ? "translate-x-0" : "-translate-x-full"}
        ${selectedConversationId ? "hidden md:flex" : "flex"}
        flex-col h-full
      `, children: [_jsx("div", { className: "flex-shrink-0 p-3 sm:p-4 border-b border-gray-200 bg-white", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "Messages" }), _jsxs("div", { className: "flex items-center space-x-2", children: [!state.isConnected && (_jsxs("div", { className: "flex items-center text-xs text-gray-500", children: [_jsx("div", { className: "w-2 h-2 bg-gray-400 rounded-full mr-2" }), _jsx("span", { className: "hidden sm:inline", children: "Demo Mode" })] })), _jsx("button", { onClick: () => setShowSidebar(false), className: "md:hidden p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100", children: _jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] })] }) }), _jsx("div", { className: "flex-1 overflow-y-auto", children: _jsx(ConversationList, { selectedConversationId: selectedConversationId || undefined, onConversationSelect: handleConversationSelect, className: "h-full" }) })] }), _jsx("div", { className: `
        flex-1 flex flex-col relative h-full
        ${selectedConversationId ? "flex" : "hidden md:flex"}
      `, children: selectedConversationId ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "md:hidden absolute top-2 left-2 z-10 pointer-events-none", children: _jsx("div", { className: "bg-black bg-opacity-20 text-white text-xs px-2 py-1 rounded-full opacity-0 transition-opacity duration-200 swipe-hint", children: "\u2190 Swipe to go back" }) }), _jsx("div", { className: "flex-shrink-0", children: _jsx(ChatHeader, { conversationId: selectedConversationId, onBackClick: handleBackToList, onMenuClick: () => setShowSidebar(true) }) }), _jsxs("div", { className: "flex-1 min-h-0", children: [" ", _jsx(MessageList, { messages: messagesHook.messages, currentUserId: ((_a = state.config) === null || _a === void 0 ? void 0 : _a.userId) || "", conversationId: selectedConversationId, className: "h-full" })] }), _jsx("div", { className: "flex-shrink-0", children: _jsx(ChatInput, {}) })] })) : (_jsx("div", { className: "flex-1 flex items-center justify-center text-gray-500 p-4", children: _jsxs("div", { className: "text-center max-w-sm", children: [_jsx("div", { className: "w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center", children: _jsx("svg", { className: "w-8 h-8 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" }) }) }), _jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "Select a conversation" }), _jsx("p", { className: "text-gray-500 text-sm sm:text-base", children: "Choose a conversation from the sidebar to start messaging" }), !state.isConnected && (_jsx("p", { className: "text-xs text-gray-400 mt-2", children: "Running in demo mode - WebSocket disabled" })), _jsx("button", { onClick: () => setShowSidebar(true), className: "mt-4 md:hidden px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors", children: "View Conversations" })] }) })) })] }));
}

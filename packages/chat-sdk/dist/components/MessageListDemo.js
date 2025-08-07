"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { MessageList } from "./MessageList";
export function MessageListDemo() {
    const [messages, setMessages] = useState([
        // Yesterday's messages
        {
            id: "demo-old-1",
            conversationId: "demo-conv",
            senderId: "user-2",
            content: "Hey! How was your weekend?",
            type: "text",
            timestamp: new Date(Date.now() - 86400000 - 3600000), // Yesterday
            status: "read",
        },
        {
            id: "demo-old-2",
            conversationId: "demo-conv",
            senderId: "current-user",
            content: "It was great! Went hiking 🏔️",
            type: "text",
            timestamp: new Date(Date.now() - 86400000 - 3000000), // Yesterday
            status: "read",
        },
        // Today's messages
        {
            id: "demo-1",
            conversationId: "demo-conv",
            senderId: "user-2",
            content: "Good morning! How are you today? 😊",
            type: "text",
            timestamp: new Date(Date.now() - 3600000), // 1 hour ago
            status: "read",
        },
        {
            id: "demo-2",
            conversationId: "demo-conv",
            senderId: "current-user",
            content: "Morning! I'm doing great, thanks for asking!",
            type: "text",
            timestamp: new Date(Date.now() - 3000000), // 50 minutes ago
            status: "read",
        },
        {
            id: "demo-3",
            conversationId: "demo-conv",
            senderId: "user-2",
            content: "Check out these photos from my trip!",
            type: "image",
            timestamp: new Date(Date.now() - 2400000), // 40 minutes ago
            status: "read",
            attachments: [
                {
                    id: "att-1",
                    name: "trip1.jpg",
                    url: "/placeholder.svg?height=300&width=400",
                    type: "image/jpeg",
                    size: 245760,
                },
                {
                    id: "att-2",
                    name: "trip2.jpg",
                    url: "/placeholder.svg?height=300&width=400",
                    type: "image/jpeg",
                    size: 198432,
                },
            ],
        },
        {
            id: "demo-4",
            conversationId: "demo-conv",
            senderId: "current-user",
            content: "Wow, those are amazing! 😍",
            type: "text",
            timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
            status: "read",
        },
        {
            id: "demo-5",
            conversationId: "demo-conv",
            senderId: "user-2",
            content: "Here's the document you requested",
            type: "file",
            timestamp: new Date(Date.now() - 1200000), // 20 minutes ago
            status: "read",
            attachments: [
                {
                    id: "att-3",
                    name: "report.pdf",
                    url: "/placeholder.svg?height=200&width=200",
                    type: "application/pdf",
                    size: 1024000,
                },
            ],
        },
        {
            id: "demo-6",
            conversationId: "demo-conv",
            senderId: "current-user",
            content: "Perfect, thanks! I'll review it this afternoon.",
            type: "text",
            timestamp: new Date(Date.now() - 600000), // 10 minutes ago
            status: "read",
        },
    ]);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const handleLoadMore = () => {
        setIsLoadingMore(true);
        // Simulate loading more messages
        setTimeout(() => {
            const olderMessages = [
                {
                    id: `older-${Date.now()}-1`,
                    conversationId: "demo-conv",
                    senderId: "user-2",
                    content: "Hey, did you see the news today?",
                    type: "text",
                    timestamp: new Date(Date.now() - 172800000), // 2 days ago
                    status: "read",
                },
                {
                    id: `older-${Date.now()}-2`,
                    conversationId: "demo-conv",
                    senderId: "current-user",
                    content: "Yes! It's quite interesting.",
                    type: "text",
                    timestamp: new Date(Date.now() - 172800000 + 300000), // 2 days ago + 5 min
                    status: "read",
                },
            ];
            setMessages((prev) => [...olderMessages, ...prev]);
            setIsLoadingMore(false);
            // Simulate no more messages after a few loads
            if (messages.length > 15) {
                setHasMore(false);
            }
        }, 1500);
    };
    const handleSendMessage = (content) => {
        const newMessage = {
            id: `new-${Date.now()}`,
            conversationId: "demo-conv",
            senderId: "current-user",
            content,
            type: "text",
            timestamp: new Date(),
            status: "sending",
        };
        setMessages((prev) => [...prev, newMessage]);
        // Simulate message status update
        setTimeout(() => {
            setMessages((prev) => prev.map((msg) => (msg.id === newMessage.id ? Object.assign(Object.assign({}, msg), { status: "delivered" }) : msg)));
        }, 1000);
    };
    return (_jsxs("div", { className: "max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden h-[600px] flex flex-col", children: [_jsxs("div", { className: "bg-gray-50 p-4 border-b flex-shrink-0", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "MessageList Demo" }), _jsx("p", { className: "text-sm text-gray-600", children: "Features: Auto-scroll, lazy loading, date grouping, sender grouping" })] }), _jsx("div", { className: "flex-1 overflow-hidden", children: _jsx(MessageList, { messages: messages, isLoadingMore: isLoadingMore, onLoadMore: handleLoadMore, hasMore: hasMore, currentUserId: "current-user", conversationId: "demo-conv" }) }), _jsx("div", { className: "border-t p-4 flex-shrink-0", children: _jsxs("form", { onSubmit: (e) => {
                        e.preventDefault();
                        const input = e.currentTarget.elements.namedItem("message");
                        if (input.value.trim()) {
                            handleSendMessage(input.value.trim());
                            input.value = "";
                        }
                    }, className: "flex space-x-2", children: [_jsx("input", { name: "message", type: "text", placeholder: "Nh\u1EADp tin nh\u1EAFn \u0111\u1EC3 test auto-scroll...", className: "flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" }), _jsx("button", { type: "submit", className: "px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors", children: "G\u1EEDi" })] }) })] }));
}

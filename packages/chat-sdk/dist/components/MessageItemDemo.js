"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MessageItem } from "./MessageItem";
import { DateDivider } from "./DateDivider";
export function MessageItemDemo() {
    // Demo messages showcasing all message types
    const demoMessages = [
        // Text message from other user
        {
            id: "demo-1",
            senderId: "user-2",
            type: "text",
            text: "Hey! How are you doing today? 😊",
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            isMine: false,
        },
        // Text message from current user
        {
            id: "demo-2",
            senderId: "current-user",
            type: "text",
            text: "I'm doing great! Thanks for asking. Check out this link: https://example.com",
            createdAt: new Date(Date.now() - 3000000).toISOString(),
            isMine: true,
        },
        // Media message with text and image from other user
        {
            id: "demo-3",
            senderId: "user-2",
            type: "media",
            text: "Look at this beautiful sunset I captured! 📸",
            attachments: [
                {
                    id: "demo-3-1",
                    type: "image",
                    url: "/placeholder.svg?height=300&width=400",
                    name: "sunset.jpg",
                    size: 245760,
                },
            ],
            createdAt: new Date(Date.now() - 2400000).toISOString(),
            isMine: false,
        },
        // Media message with multiple images from current user
        {
            id: "demo-4",
            senderId: "current-user",
            type: "media",
            text: "My vacation photos! 🏖️",
            attachments: [
                {
                    id: "demo-4-1",
                    type: "image",
                    url: "/placeholder.svg?height=200&width=300",
                    name: "beach1.jpg",
                    size: 180000,
                },
                {
                    id: "demo-4-2",
                    type: "image",
                    url: "/placeholder.svg?height=200&width=300",
                    name: "beach2.jpg",
                    size: 195000,
                },
            ],
            createdAt: new Date(Date.now() - 1800000).toISOString(),
            isMine: true,
        },
        // Media message with file from other user
        {
            id: "demo-5",
            senderId: "user-2",
            type: "media",
            text: "Here's the document you requested",
            attachments: [
                {
                    id: "demo-5-1",
                    type: "file",
                    url: "/placeholder.svg?height=200&width=200",
                    name: "project-proposal.pdf",
                    size: 1024000,
                },
            ],
            createdAt: new Date(Date.now() - 1200000).toISOString(),
            isMine: false,
        },
        // Media message with mixed attachments from current user
        {
            id: "demo-6",
            senderId: "current-user",
            type: "media",
            text: "Screenshot and the related document",
            attachments: [
                {
                    id: "demo-6-1",
                    type: "image",
                    url: "/placeholder.svg?height=400&width=300",
                    name: "screenshot.png",
                    size: 156000,
                },
                {
                    id: "demo-6-2",
                    type: "file",
                    url: "/placeholder.svg?height=200&width=200",
                    name: "instructions.docx",
                    size: 45000,
                },
            ],
            createdAt: new Date(Date.now() - 600000).toISOString(),
            isMine: true,
        },
        // Promotional message (system message)
        {
            id: "demo-7",
            senderId: "system",
            type: "promo",
            promoData: {
                imageUrl: "/placeholder.svg?height=200&width=400",
                title: "Giảm 30% đơn hàng hôm nay!",
                description: "Khuyến mãi đặc biệt chỉ trong hôm nay. Đừng bỏ lỡ cơ hội tiết kiệm!",
                buttonText: "Đặt ngay",
                buttonUrl: "https://example.com/sale",
            },
            createdAt: new Date(Date.now() - 300000).toISOString(),
            isMine: false,
        },
        // Recent text message from other user
        {
            id: "demo-8",
            senderId: "user-2",
            type: "text",
            text: "Thanks for sharing! Those photos are amazing 🤩",
            createdAt: new Date(Date.now() - 60000).toISOString(),
            isMine: false,
        },
    ];
    const groupMessagesByDate = () => {
        const groups = [];
        let currentDate = "";
        let currentGroup = [];
        demoMessages.forEach((message) => {
            const messageDate = new Date(message.createdAt).toDateString();
            if (messageDate !== currentDate) {
                if (currentGroup.length > 0) {
                    groups.push({ date: currentDate, messages: currentGroup });
                }
                currentDate = messageDate;
                currentGroup = [message];
            }
            else {
                currentGroup.push(message);
            }
        });
        if (currentGroup.length > 0) {
            groups.push({ date: currentDate, messages: currentGroup });
        }
        return groups;
    };
    const messageGroups = groupMessagesByDate();
    return (_jsxs("div", { className: "max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden", children: [_jsxs("div", { className: "bg-gray-50 p-4 border-b", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "MessageItem Demo" }), _jsx("p", { className: "text-sm text-gray-600", children: "Showcasing all message types: text, media, and promotional" })] }), _jsx("div", { className: "h-96 overflow-y-auto p-4 space-y-4", children: messageGroups.map((group, groupIndex) => (_jsxs("div", { children: [_jsx(DateDivider, { date: new Date(group.date) }), _jsx("div", { className: "space-y-2", children: group.messages.map((message, messageIndex) => {
                                const prevMessage = messageIndex > 0 ? group.messages[messageIndex - 1] : null;
                                const isGrouped = (prevMessage === null || prevMessage === void 0 ? void 0 : prevMessage.senderId) === message.senderId &&
                                    new Date(message.createdAt).getTime() - new Date(prevMessage.createdAt).getTime() < 300000; // 5 minutes
                                return _jsx(MessageItem, { message: message, isGrouped: isGrouped }, message.id);
                            }) })] }, group.date))) })] }));
}

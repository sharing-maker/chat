"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { ChatInput } from "./ChatInput";
export function ChatInputDemo() {
    const [messages, setMessages] = useState([]);
    const handleSendMessage = (message) => {
        setMessages((prev) => [...prev, message]);
        console.log("Message sent:", message);
    };
    const handleEmojiClick = (emoji) => {
        console.log("Emoji clicked:", emoji);
    };
    const handleStickerClick = (sticker) => {
        console.log("Sticker clicked:", sticker);
        setMessages((prev) => [...prev, `Sticker: ${sticker}`]);
    };
    const handleFileUpload = (file) => {
        console.log("File uploaded:", file.name);
        setMessages((prev) => [...prev, `📎 File: ${file.name}`]);
    };
    const handleImageUpload = (file) => {
        console.log("Image uploaded:", file.name);
        setMessages((prev) => [...prev, `🖼️ Image: ${file.name}`]);
    };
    const handleContactShare = () => {
        console.log("Contact share clicked");
        setMessages((prev) => [...prev, "👤 Contact shared"]);
    };
    const handleVoiceRecord = () => {
        console.log("Voice record clicked");
    };
    const handleQuickReact = () => {
        console.log("Quick react clicked");
        setMessages((prev) => [...prev, "👍"]);
    };
    return (_jsxs("div", { className: "max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden", children: [_jsx("div", { className: "h-96 p-4 bg-gray-50 overflow-y-auto", children: _jsxs("div", { className: "space-y-3", children: [_jsx("div", { className: "text-center text-gray-500 text-sm mb-4", children: "Demo Chat Interface" }), messages.map((message, index) => (_jsx("div", { className: "flex justify-end", children: _jsx("div", { className: "bg-blue-500 text-white px-4 py-2 rounded-2xl rounded-tr-md max-w-xs", children: message }) }, index))), messages.length === 0 && (_jsx("div", { className: "text-center text-gray-400 text-sm", children: "Type a message, select emoji, or send sticker to test the ChatInput component" }))] }) }), _jsx(ChatInput, { onSendMessage: handleSendMessage, onEmojiClick: handleEmojiClick, onStickerClick: handleStickerClick, onFileUpload: handleFileUpload, onImageUpload: handleImageUpload, onContactShare: handleContactShare, onVoiceRecord: handleVoiceRecord, onQuickReact: handleQuickReact, placeholder: "Nh\u1EADp tin nh\u1EAFn" })] }));
}

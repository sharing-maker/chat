"use client";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useChatContext } from "../context/ChatContext";
import { FileText, Download } from "lucide-react";
import Image from "next/image";
export function MessageItem({ message, isGrouped, onImageClick }) {
    const { state } = useChatContext();
    const isOwnMessage = message.isMine;
    const sender = state.users[message.senderId];
    const formatFileSize = (bytes) => {
        if (bytes === 0)
            return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };
    const renderTextMessage = (msg) => {
        const content = msg.text || "";
        // Simple regex to detect URLs and make them clickable
        const linkRegex = /(https?:\/\/[^\s]+)/g;
        const parts = content.split(linkRegex);
        return (_jsx("div", { className: `px-3 py-2 sm:px-4 sm:py-2 rounded-2xl max-w-full break-words ${isOwnMessage ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"} ${isGrouped ? (isOwnMessage ? "rounded-tr-md" : "rounded-tl-md") : ""}`, children: _jsx("p", { className: "text-sm sm:text-base whitespace-pre-wrap", children: parts.map((part, index) => linkRegex.test(part) ? (_jsx("a", { href: part, target: "_blank", rel: "noopener noreferrer", className: "underline text-blue-200 hover:text-blue-100", children: part }, index)) : (part)) }) }));
    };
    const renderMediaMessage = (msg) => {
        var _a, _b;
        const imageAttachments = ((_a = msg.attachments) === null || _a === void 0 ? void 0 : _a.filter((att) => att.type === "image")) || [];
        return (_jsxs("div", { className: `flex flex-col gap-2 ${isOwnMessage ? "items-end" : "items-start"}`, children: [msg.text && (_jsx("div", { className: `px-3 py-2 sm:px-4 sm:py-2 rounded-2xl max-w-full break-words ${isOwnMessage ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"} ${isGrouped ? (isOwnMessage ? "rounded-tr-md" : "rounded-tl-md") : ""}`, children: _jsx("p", { className: "text-sm sm:text-base whitespace-pre-wrap", children: msg.text }) })), _jsx("div", { className: `grid gap-2 ${imageAttachments.length > 1 ? "grid-cols-2" : "grid-cols-1"}`, children: (_b = msg.attachments) === null || _b === void 0 ? void 0 : _b.map((attachment, idx) => (_jsx("div", { className: `relative rounded-lg overflow-hidden ${isOwnMessage ? "bg-blue-100" : "bg-gray-100"}`, children: attachment.type === "image" ? (_jsxs(_Fragment, { children: [_jsx(Image, { src: attachment.url || "/placeholder.svg", alt: attachment.name || "Attached image", width: 200, height: 150, className: "w-full h-auto object-cover cursor-pointer", onClick: () => onImageClick === null || onImageClick === void 0 ? void 0 : onImageClick(attachment.id, imageAttachments.map((img) => ({ id: img.id, url: img.url, name: img.name }))) }), _jsx("div", { className: "absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity", children: _jsx("span", { className: "text-white text-xs font-medium p-1 rounded bg-black/50", children: "Xem \u1EA3nh" }) })] })) : (_jsxs("a", { href: attachment.url, download: attachment.name, className: "flex items-center p-3 space-x-2 text-gray-800 hover:bg-gray-200 transition-colors", children: [_jsx(FileText, { className: "w-5 h-5 flex-shrink-0" }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("span", { className: "block text-sm font-medium truncate", children: attachment.name || "File" }), _jsx("span", { className: "block text-xs text-gray-500", children: attachment.size ? formatFileSize(attachment.size) : "Unknown size" })] }), _jsx(Download, { className: "w-4 h-4 flex-shrink-0 text-gray-600" })] })) }, idx))) })] }));
    };
    const renderPromoMessage = (msg) => {
        if (!msg.promoData)
            return null;
        const { imageUrl, title, description, buttonText, buttonUrl } = msg.promoData;
        return (_jsxs("div", { className: "w-full max-w-xs mx-auto my-2 bg-white shadow-md rounded-lg overflow-hidden border border-gray-200", children: [_jsx("div", { className: "relative w-full h-32 bg-gray-200", children: _jsx(Image, { src: imageUrl || "/placeholder.svg", alt: title, fill: true, style: { objectFit: "cover" }, className: "rounded-t-lg" }) }), _jsxs("div", { className: "p-4", children: [_jsx("h3", { className: "text-base font-semibold text-gray-900 mb-1", children: title }), _jsx("p", { className: "text-sm text-gray-600 mb-3", children: description }), _jsx("a", { href: buttonUrl, target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors", children: buttonText })] })] }));
    };
    return (_jsx("div", { className: `flex ${isOwnMessage ? "justify-end" : "justify-start"} ${isGrouped ? "mt-0.5 sm:mt-1" : "mt-3 sm:mt-4"}`, children: _jsxs("div", { className: `flex items-end space-x-2 max-w-[85%] sm:max-w-xs lg:max-w-md ${isOwnMessage ? "flex-row-reverse space-x-reverse" : ""}`, style: message.type === "promo" ? { maxWidth: "none" } : {}, children: [message.type !== "promo" && !isOwnMessage && !isGrouped && (_jsx("img", { src: (sender === null || sender === void 0 ? void 0 : sender.avatar) || "/placeholder.svg?height=32&width=32&query=user", alt: (sender === null || sender === void 0 ? void 0 : sender.name) || "User", className: "w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover flex-shrink-0" })), message.type !== "promo" && !isOwnMessage && isGrouped && (_jsx("div", { className: "w-6 sm:w-8 flex-shrink-0" }) // Spacer for grouped messages
                ), _jsxs("div", { className: `flex flex-col ${isOwnMessage ? "items-end" : "items-start"}`, children: [message.type !== "promo" && !isGrouped && !isOwnMessage && (_jsx("span", { className: "text-xs text-gray-500 mb-1 px-3", children: (sender === null || sender === void 0 ? void 0 : sender.name) || "Unknown User" })), message.type === "text" && renderTextMessage(message), message.type === "media" && renderMediaMessage(message), message.type === "promo" && renderPromoMessage(message), message.type !== "promo" && (_jsx("div", { className: `flex items-center space-x-1 mt-1 px-2 ${isOwnMessage ? "flex-row-reverse space-x-reverse" : ""}`, children: isOwnMessage && (_jsx("svg", { className: "w-3 h-3 sm:w-4 sm:h-4 text-blue-500", fill: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { d: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" }) })) }))] })] }) }));
}

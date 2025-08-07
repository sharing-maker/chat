"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { useState } from "react";
import { X, Search, Clock, Smile, Heart, Hand, Car, Lightbulb, Coffee, Flag } from "lucide-react";
const emojiCategories = {
    recent: {
        label: "Thường xuyên sử dụng",
        icon: Clock,
        emojis: ["😊", "😂", "❤️", "👍", "😢", "😮", "😡", "🎉", "👏"],
    },
    smileys: {
        label: "Mặt cười & con người",
        icon: Smile,
        emojis: [
            "😀",
            "😃",
            "😄",
            "😁",
            "😆",
            "😅",
            "😂",
            "🤣",
            "😊",
            "😇",
            "🙂",
            "🙃",
            "😉",
            "😌",
            "😍",
            "🥰",
            "😘",
            "😗",
            "😙",
            "😚",
            "😋",
            "😛",
            "😝",
            "😜",
            "🤪",
            "🤨",
            "🧐",
            "🤓",
            "😎",
            "🤩",
            "🥳",
            "😏",
            "😒",
            "😞",
            "😔",
            "😟",
            "😕",
            "🙁",
            "☹️",
            "😣",
            "😖",
            "😫",
            "😩",
            "🥺",
            "😢",
            "😭",
            "😤",
            "😠",
            "😡",
            "🤬",
            "🤯",
            "😳",
            "🥵",
            "🥶",
            "😱",
            "😨",
            "😰",
            "😥",
            "😓",
            "🤗",
            "🤔",
            "🤭",
            "🤫",
            "🤥",
            "😶",
            "😐",
            "😑",
            "😬",
            "🙄",
            "😯",
            "😦",
            "😧",
            "😮",
            "😲",
            "🥱",
            "😴",
            "🤤",
            "😪",
            "😵",
            "🤐",
        ],
    },
    gestures: {
        label: "Cử chỉ",
        icon: Hand,
        emojis: [
            "👍",
            "👎",
            "👌",
            "✌️",
            "🤞",
            "🤟",
            "🤘",
            "🤙",
            "👈",
            "👉",
            "👆",
            "🖕",
            "👇",
            "☝️",
            "👏",
            "🙌",
            "👐",
            "🤲",
            "🤝",
            "🙏",
        ],
    },
    hearts: {
        label: "Trái tim",
        icon: Heart,
        emojis: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝"],
    },
    objects: {
        label: "Đồ vật",
        icon: Coffee,
        emojis: ["📱", "💻", "⌨️", "🖥️", "🖨️", "📷", "📹", "🎥", "📞", "☎️", "📠", "📺", "📻", "🎵", "🎶", "🎤", "🎧", "📢"],
    },
    travel: {
        label: "Du lịch",
        icon: Car,
        emojis: ["🚗", "🚕", "🚙", "🚌", "🚎", "🏎️", "🚓", "🚑", "🚒", "🚐", "🛻", "🚚", "🚛", "🚜", "🏍️", "🛵", "🚲", "🛴"],
    },
    activities: {
        label: "Hoạt động",
        icon: Lightbulb,
        emojis: [
            "⚽",
            "🏀",
            "🏈",
            "⚾",
            "🥎",
            "🎾",
            "🏐",
            "🏉",
            "🥏",
            "🎱",
            "🪀",
            "🏓",
            "🏸",
            "🏒",
            "🏑",
            "🥍",
            "🏏",
            "🪃",
        ],
    },
    flags: {
        label: "Cờ",
        icon: Flag,
        emojis: ["🏳️", "🏴", "🏁", "🚩", "🏳️‍🌈", "🏳️‍⚧️", "🇺🇳", "🇻🇳", "🇺🇸", "🇬🇧", "🇫🇷", "🇩🇪", "🇯🇵", "🇰🇷", "🇨🇳", "🇮🇳"],
    },
};
export const EmojiPicker = React.forwardRef(({ onEmojiSelect, onClose, isOpen = false, style }, ref) => {
    const [activeCategory, setActiveCategory] = useState("recent");
    const [searchTerm, setSearchTerm] = useState("");
    if (!isOpen)
        return null;
    const handleEmojiClick = (emoji) => {
        onEmojiSelect === null || onEmojiSelect === void 0 ? void 0 : onEmojiSelect(emoji);
    };
    const filteredEmojis = searchTerm
        ? emojiCategories[activeCategory].emojis.filter((emoji) => 
        // Simple search - in a real app you'd have emoji names/keywords
        emoji.includes(searchTerm))
        : emojiCategories[activeCategory].emojis;
    return (_jsx("div", { ref: ref, className: "absolute bottom-full mb-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-full sm:max-w-xs md:w-80", style: style, children: _jsxs("div", { className: "p-2", children: [_jsxs("div", { className: "flex items-center justify-between mb-2 pb-1 border-b border-gray-100", children: [Object.entries(emojiCategories).map(([key, category]) => {
                            const Icon = category.icon;
                            const isActive = activeCategory === key;
                            return (_jsx("button", { onClick: () => setActiveCategory(key), className: `
                    p-1.5 rounded-full transition-all duration-200 hover:bg-gray-100
                    ${isActive ? "text-blue-500 bg-blue-50" : "text-gray-500"}
                  `, title: category.label, children: _jsx(Icon, { className: "w-4 h-4" }) }, key));
                        }), _jsx("button", { onClick: onClose, className: "p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100", children: _jsx(X, { className: "w-4 h-4" }) })] }), _jsxs("div", { className: "relative mb-2", children: [_jsx(Search, { className: "absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" }), _jsx("input", { type: "text", placeholder: "T\u00ECm ki\u1EBFm", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full pl-7 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent" })] }), _jsx("div", { className: "mb-2", children: _jsx("h3", { className: "text-xs font-medium text-gray-900", children: emojiCategories[activeCategory].label }) }), _jsx("div", { className: "grid grid-cols-9 gap-0.5 max-h-48 overflow-y-auto", children: filteredEmojis.map((emoji, index) => (_jsx("button", { onClick: () => handleEmojiClick(emoji), className: "p-1.5 text-lg hover:bg-gray-100 rounded transition-all duration-200 hover:scale-110 active:scale-95", title: emoji, children: emoji }, index))) }), filteredEmojis.length === 0 && (_jsxs("div", { className: "text-center py-4 text-gray-500", children: [_jsx("div", { className: "text-lg mb-1", children: "\uD83D\uDD0D" }), _jsx("p", { className: "text-xs", children: "Kh\u00F4ng t\u00ECm th\u1EA5y emoji n\u00E0o" })] }))] }) }));
});
EmojiPicker.displayName = "EmojiPicker";

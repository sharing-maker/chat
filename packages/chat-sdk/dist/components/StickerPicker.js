"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { useState } from "react";
import { X, Search, Heart, Smile, Star, Zap, Coffee, Music, Gamepad2Icon as GameController2, Sparkles, } from "lucide-react";
const stickerCategories = {
    popular: {
        label: "Phổ biến",
        icon: Star,
        stickers: ["🔥", "💯", "✨", "⭐", "🎉", "🎊", "💫", "🌟", "⚡"],
    },
    emotions: {
        label: "Cảm xúc",
        icon: Heart,
        stickers: ["❤️", "💕", "💖", "💗", "💓", "💘", "💝", "💟", "♥️", "💔", "❣️", "💋", "👑", "💎", "🌹"],
    },
    reactions: {
        label: "Phản ứng",
        icon: Smile,
        stickers: ["👍", "👎", "👏", "🙌", "👌", "✌️", "🤞", "🤟", "🤘", "👊", "✊", "🤛", "🤜", "👋", "🤚"],
    },
    fun: {
        label: "Vui nhộn",
        icon: Zap,
        stickers: ["🎯", "🎪", "🎨", "🎭", "🎪", "🎡", "🎢", "🎠", "🎳", "🎮", "🕹️", "🎲", "🃏", "🎴", "🀄"],
    },
    food: {
        label: "Đồ ăn",
        icon: Coffee,
        stickers: ["🍕", "🍔", "🍟", "🌭", "🥪", "🌮", "🌯", "🥙", "🧆", "🥚", "🍳", "🥘", "🍲", "🥗", "🍿"],
    },
    activities: {
        label: "Hoạt động",
        icon: GameController2,
        stickers: ["⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", "🪀", "🏓", "🏸", "🏒", "🏑"],
    },
    nature: {
        label: "Thiên nhiên",
        icon: Sparkles,
        stickers: ["🌸", "🌺", "🌻", "🌷", "🌹", "🥀", "🌾", "🌿", "☘️", "🍀", "🍃", "🌱", "🌲", "🌳", "🌴"],
    },
    music: {
        label: "Âm nhạc",
        icon: Music,
        stickers: ["🎵", "🎶", "🎼", "🎹", "🥁", "🎷", "🎺", "🎸", "🪕", "🎻", "🎤", "🎧", "📻", "🎚️", "🎛️"],
    },
};
export const StickerPicker = React.forwardRef(({ onStickerSelect, onClose, isOpen = false, style }, ref) => {
    const [activeCategory, setActiveCategory] = useState("popular");
    const [searchTerm, setSearchTerm] = useState("");
    if (!isOpen)
        return null;
    const handleStickerClick = (sticker) => {
        onStickerSelect === null || onStickerSelect === void 0 ? void 0 : onStickerSelect(sticker);
    };
    const filteredStickers = searchTerm
        ? stickerCategories[activeCategory].stickers.filter((sticker) => sticker.includes(searchTerm))
        : stickerCategories[activeCategory].stickers;
    return (_jsx("div", { ref: ref, className: "absolute bottom-full mb-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-full sm:max-w-xs md:w-80", style: style, children: _jsxs("div", { className: "p-2", children: [_jsxs("div", { className: "flex items-center justify-between mb-2 pb-1 border-b border-gray-100", children: [Object.entries(stickerCategories).map(([key, category]) => {
                            const Icon = category.icon;
                            const isActive = activeCategory === key;
                            return (_jsx("button", { onClick: () => setActiveCategory(key), className: `
                    p-1.5 rounded-full transition-all duration-200 hover:bg-gray-100
                    ${isActive ? "text-purple-500 bg-purple-50" : "text-gray-500"}
                  `, title: category.label, children: _jsx(Icon, { className: "w-4 h-4" }) }, key));
                        }), _jsx("button", { onClick: onClose, className: "p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100", children: _jsx(X, { className: "w-4 h-4" }) })] }), _jsxs("div", { className: "relative mb-2", children: [_jsx(Search, { className: "absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" }), _jsx("input", { type: "text", placeholder: "T\u00ECm sticker", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full pl-7 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-transparent" })] }), _jsx("div", { className: "mb-2", children: _jsx("h3", { className: "text-xs font-medium text-gray-900", children: stickerCategories[activeCategory].label }) }), _jsx("div", { className: "grid grid-cols-6 gap-1 max-h-48 overflow-y-auto", children: filteredStickers.map((sticker, index) => (_jsx("button", { onClick: () => handleStickerClick(sticker), className: "p-2 text-xl hover:bg-gray-100 rounded transition-all duration-200 hover:scale-110 active:scale-95 border border-gray-100 hover:border-gray-200", title: sticker, children: sticker }, index))) }), filteredStickers.length === 0 && (_jsxs("div", { className: "text-center py-4 text-gray-500", children: [_jsx("div", { className: "text-lg mb-1", children: "\uD83D\uDD0D" }), _jsx("p", { className: "text-xs", children: "Kh\u00F4ng t\u00ECm th\u1EA5y sticker n\u00E0o" })] }))] }) }));
});
StickerPicker.displayName = "StickerPicker";

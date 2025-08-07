"use client";
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
    return (<div ref={ref} className="absolute bottom-full mb-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-full sm:max-w-xs md:w-80" style={style} // Apply dynamic style here
    >
        <div className="p-2">
          {/* Category Icons Row - Compact */}
          <div className="flex items-center justify-between mb-2 pb-1 border-b border-gray-100">
            {Object.entries(emojiCategories).map(([key, category]) => {
            const Icon = category.icon;
            const isActive = activeCategory === key;
            return (<button key={key} onClick={() => setActiveCategory(key)} className={`
                    p-1.5 rounded-full transition-all duration-200 hover:bg-gray-100
                    ${isActive ? "text-blue-500 bg-blue-50" : "text-gray-500"}
                  `} title={category.label}>
                  <Icon className="w-4 h-4"/>
                </button>);
        })}

            {/* Close button */}
            <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
              <X className="w-4 h-4"/>
            </button>
          </div>

          {/* Search Bar - Compact */}
          <div className="relative mb-2">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400"/>
            <input type="text" placeholder="Tìm kiếm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-7 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"/>
          </div>

          {/* Category Title - Compact */}
          <div className="mb-2">
            <h3 className="text-xs font-medium text-gray-900">{emojiCategories[activeCategory].label}</h3>
          </div>

          {/* Emoji Grid - Compact */}
          <div className="grid grid-cols-9 gap-0.5 max-h-48 overflow-y-auto">
            {filteredEmojis.map((emoji, index) => (<button key={index} onClick={() => handleEmojiClick(emoji)} className="p-1.5 text-lg hover:bg-gray-100 rounded transition-all duration-200 hover:scale-110 active:scale-95" title={emoji}>
                {emoji}
              </button>))}
          </div>

          {/* Empty state */}
          {filteredEmojis.length === 0 && (<div className="text-center py-4 text-gray-500">
              <div className="text-lg mb-1">🔍</div>
              <p className="text-xs">Không tìm thấy emoji nào</p>
            </div>)}
        </div>
      </div>);
});
EmojiPicker.displayName = "EmojiPicker";

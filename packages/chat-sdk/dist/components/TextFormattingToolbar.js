"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { Bold, Italic, Strikethrough, List, ListOrdered, Link, Quote, Code, X } from "lucide-react";
const formatButtons = [
    { icon: Bold, label: "Đậm", format: "bold", shortcut: "Ctrl+B", symbol: "**" },
    { icon: Italic, label: "Nghiêng", format: "italic", shortcut: "Ctrl+I", symbol: "*" },
    { icon: Strikethrough, label: "Gạch ngang", format: "strikethrough", shortcut: "Ctrl+Shift+X", symbol: "~~" },
    { icon: ListOrdered, label: "Danh sách số", format: "numbered-list", shortcut: "Ctrl+Shift+7", symbol: "1." },
    { icon: List, label: "Danh sách dấu đầu dòng", format: "bullet-list", shortcut: "Ctrl+Shift+8", symbol: "•" },
    { icon: Link, label: "Liên kết", format: "link", shortcut: "Ctrl+K", symbol: "[]" },
    { icon: Quote, label: "Trích dẫn", format: "quote", shortcut: "Ctrl+Shift+>", symbol: ">" },
    { icon: Code, label: "Mã", format: "code", shortcut: "Ctrl+E", symbol: "`" },
];
export const TextFormattingToolbar = React.forwardRef(({ isOpen, onClose, onFormatSelect, selectedFormats = [], style }, ref) => {
    if (!isOpen)
        return null;
    return (_jsx("div", { ref: ref, className: "absolute bottom-full mb-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-full sm:max-w-xs md:w-80", style: style, children: _jsxs("div", { className: "p-2", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h3", { className: "text-xs font-medium text-gray-900", children: "\u0110\u1ECBnh d\u1EA1ng v\u0103n b\u1EA3n" }), _jsx("button", { onClick: onClose, className: "p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100", children: _jsx(X, { className: "w-3 h-3" }) })] }), _jsx("div", { className: "grid grid-cols-4 gap-1", children: formatButtons.map((button) => {
                        const Icon = button.icon;
                        const isSelected = selectedFormats.includes(button.format);
                        return (_jsxs("button", { onClick: () => onFormatSelect(button.format), className: `
                    flex flex-col items-center p-2 rounded transition-all duration-200 hover:bg-gray-50 active:scale-95
                    ${isSelected
                                ? "bg-blue-50 text-blue-600 border border-blue-200"
                                : "text-gray-600 hover:text-gray-800 border border-gray-200"}
                  `, title: `${button.label} (${button.shortcut})`, "aria-label": button.label, children: [_jsx(Icon, { className: "w-4 h-4 mb-1" }), _jsx("span", { className: "text-xs font-medium", children: button.symbol })] }, button.format));
                    }) }), _jsx("div", { className: "mt-2 pt-2 border-t border-gray-100", children: _jsx("p", { className: "text-xs text-gray-500 text-center", children: "\uD83D\uDCA1 S\u1EED d\u1EE5ng ph\u00EDm t\u1EAFt \u0111\u1EC3 \u0111\u1ECBnh d\u1EA1ng nhanh" }) })] }) }));
});
TextFormattingToolbar.displayName = "TextFormattingToolbar";
